const argv = require("yargs").argv;
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const url = require("url");
const async = require("async");

const baseUrl = argv._[0];
const urlQueue = [baseUrl];
const files = {};
console.time("Execution");

async.whilst(
	function test(cb) {
		return cb(null, urlQueue.length > 0);
	},
	function iter(callback) {
		const urls = urlQueue.splice(0, 10);
		async.map(
			urls,
			async (dqUrl) => {
				console.log(`[+] Fetching ${dqUrl}`, `[${urlQueue.length}]`);
				const results = await fetch(dqUrl);
				const data = await results.text();
				const $ = cheerio.load(data);
				$("a").each((i, element) => {
					let dirPath = $(element).attr("href");
					if ((!$(element).text().toLowerCase().includes("parent directory") && !dirPath.startsWith("?")) && dirPath !== "../") {
						if (dirPath.endsWith("/")) {
							const newUrl = url.resolve(dqUrl, dirPath);
							if (!urlQueue.includes(newUrl)) {
								console.log(`[+] Adding ${newUrl}`);
								urlQueue.push(newUrl);
							}
						} else {
							const ext = dirPath.substr(dirPath.lastIndexOf(".") + 1);
							if (typeof files[ext] === "undefined") files[ext] = { count: 1, size: 0 };
							else files[ext].count += 1;
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
		console.log(`-----------------------------`);
		console.timeEnd("Execution");
		console.log(files);
	}
);
