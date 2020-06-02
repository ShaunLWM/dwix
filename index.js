#!/usr/bin/env node

const fetch = require("node-fetch");
const cheerio = require("cheerio");
const url = require("url");
const async = require("async");
const fs = require("fs");
const cTable = require("console.table");
const argv = require("yargs")
	.usage(`Usage: dwix --verbose --output [dir] url`)
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
if (typeof baseUrl === "undefined") throw new Error("Missing URL");

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
							let ext = dirPath
								.substr(dirPath.lastIndexOf(".") + 1)
								.toLowerCase();
							const split = dirPath.split(".");
							if (split.length < 2) ext = "unknown";
							files.push(url.resolve(dqUrl, dirPath));
							if (typeof exts[ext] === "undefined") exts[ext] = { count: 1 };
							else exts[ext].count += 1;
						}
					}
				});
			},
			(err) => {
				return callback(null);
			}
		);
	},
	function (err, n) {
		print(`-----------------------------`);
		const arr = [];
		for (const [key, value] of Object.entries(exts))
			arr.push({
				ext: key,
				...value,
			});

		print(console.table(arr.sort((a, b) => b.count - a.count)));
		if (argv["verbose"]) console.timeEnd("Execution");
		if (argv["output"]) fs.writeFileSync(argv["output"], files.join("\n"));
	}
);
