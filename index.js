const argv = require("yargs").argv;
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const url = require("url");
const async = require("async");
const fs = require("fs");

const baseUrl = argv._[0];
const urlQueue = [baseUrl];
const exts = {};

const blacklist = ["../", "./", "#!", "#!/"];
const seen = [];
const files = [];

console.time("Execution");
const print = (str) => {
	if (argv["verbose"] || argv["V"] || argv["v"]) console.log(str);
};

async.whilst(
	function test(cb) {
		return cb(null, urlQueue.length > 0);
	},
	function iter(callback) {
		const urls = urlQueue.splice(0, 10);
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
		print("Execution");
		print(exts);
		if (argv["output"]) fs.writeFileSync(argv["output"], files.join("\n"));
	}
);
