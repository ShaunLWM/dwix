const fetch = require("node-fetch");
const cheerio = require("cheerio");
const url = require("url");
const async = require("async");
const fs = require("fs");
const argv = require("yargs")
	.usage(`Usage: trix --verbose --output [dir] url`)
	.alias("v", "verbose")
	.alias("V", "verbose")
	.describe("v", "Enable verbose logging")
	.alias("p", "parallel")
	.default("parallel", 10)
	.describe("p", "Number of urls to scan at once")
	.alias("o", "output")
	.describe("o", "Output scanned urls to file")
	.help("h")
	.alias("h", "help")
	.demandCommand(1).argv;

const baseUrl = argv._[0];
const blacklist = ["../", "./", "#!", "#!/"];
const seen = [];

const exts = {};
const files = [];

const urlQueue = [baseUrl];

const print = (str) => {
	if (argv["verbose"]) console.log(str);
};

if (argv["verbose"]) console.time("Execution");

async.whilst(
	function test(cb) {
		return cb(null, urlQueue.length > 0);
	},
	function iter(callback) {
		const urls = urlQueue.splice(0, argv["parallel"]);
		async.map(
			urls,
			async (dqUrl) => {
				print(`[+] Fetching ${dqUrl}`, `[${urlQueue.length}]`);
				const results = await fetch(dqUrl);
				const data = await results.text();
				seen.push(dqUrl);
				const $ = cheerio.load(data);
				$("a").each((i, element) => {
					let dirPath = $(element).attr("href");
					if (
						!$(element).text().toLowerCase().includes("parent directory") &&
						!dirPath.startsWith("?") &&
						!blacklist.includes(dirPath)
					) {
						if (dirPath.endsWith("/")) {
							const newUrl = url.resolve(dqUrl, dirPath);
							if (!urlQueue.includes(newUrl) && !seen.includes(newUrl)) {
								print(`[+] Adding ${newUrl}`);
								urlQueue.push(newUrl);
							}
						} else {
							const ext = dirPath
								.substr(dirPath.lastIndexOf(".") + 1)
								.toLowerCase();
							if (typeof exts[ext] === "undefined") {
								files.push(dirPath);
								exts[ext] = { count: 1, size: 0 };
							} else exts[ext].count += 1;
						}
					}
				});
			},
			(err, results) => {
				return callback(null);
			}
		);
	},
	function (err, n) {
		print(`-----------------------------`);
		print(exts);
		if (argv["verbose"]) console.timeEnd("Execution");
		if (argv["output"]) fs.writeFileSync(argv["output"], files.join("\n"));
	}
);
