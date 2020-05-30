# dwix

[!["Monthly Download"](https://img.shields.io/npm/dm/dwix.svg)](https://npmjs.org/package/dwix)
[!["Latest Release"](https://img.shields.io/npm/v/dwix.svg)](https://github.com/ShaunLWM/dwix/releases/latest)
[![MIT license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/ShaunLWM/dwix/blob/master/LICENSE)

A multithreaded open directory scraper

## Requirement

- NodeJS v8 and above

## Usage

```
Usage: dwix --verbose --output [dir] url

Options:
  --version       Show version number                                  [boolean]
  -v, --verbose   Enable verbose logging
  -p, --parallel  Number of urls to scan at once
  -o, --output    Output scanned urls to file
  -h, --help      Show help                                            [boolean]

Example
    $ dwix --verbose --output urls.txt http://127.0.0.1
```

## Instructions

1. `npm install -g dwix` or `yarn global add dwix`
2. Follow the usage stated above

## TODO

- None for now

## License

MIT License - Copyright (c) 2020 Shaun
