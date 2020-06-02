# dwix

[!["Monthly Download"](https://img.shields.io/npm/dm/dwix.svg)](https://npmjs.org/package/dwix)
[!["Latest Release"](https://img.shields.io/npm/v/dwix.svg)](https://github.com/ShaunLWM/dwix/releases/latest)
[![MIT license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/ShaunLWM/dwix/blob/master/LICENSE)

A parallel open directory mapper.

![output](/img/output.png)

## Requirement

- NodeJS v8 and above

## Usage

```
Usage: dwix --verbose --output [dir] <url>

Options:
  --version             Show version number                            [boolean]
  -v, --verbose         Enable verbose logging
  -p, --parallel        Number of urls to scan at once
  -o, --output          Output scanned urls to file
  -w, --whitelist       List of whitelisted extensions [affects output only]
  -i, --ignore-unknown  Ignore files with no extension [affects output only]
  -h, --help            Show help                                      [boolean]

Examples:
  dwix http://127.0.0.1
  dwix --verbose http://127.0.0.1
  dwix --verbose --output urls.txt http://127.0.0.1
  dwix --verbose --output urls.txt -i http://127.0.0.1
  dwix --verbose --output urls.txt --whitelist mp3 http://127.0.0.1
```

## Instructions

1. `npm install -g dwix` or `yarn global add dwix`
2. Follow the usage stated above

## TODO

- None for now

## License

MIT License - Copyright (c) 2020 Shaun
