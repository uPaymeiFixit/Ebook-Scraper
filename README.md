# Ebook-Scraper
Downloads pages of a textbook from Vitalsource

This will download the pages (as jpegs) of an online textbook from Vitalsoure.

Note: This script will need some configuration to be used with different textbooks.

## Installation
`npm install`


## Documentation

`Ebook-Scraper.js [options] { -c COOKIE }`

  `-s` or `--start`: Beginning page number. Note: This usually isn't 1, it can be found in the textbook URL. (defaults to 367836503)
  
  `-c` or `--cookie`: **Required** jigsaw.vitalsource.com cookie. Should include `request_method` and `_jigsaw_session`. Get this from Postman or by logging into http://jigsaw.vitalsource.com/books/ then running `window.prompt("Copy to clipboard: Ctrl+C, Enter", document.cookie);` in the console.
  
  `-h` or `--help`: Shows the help message.
  
  `-i` or `--i`: ISBN of the book you want to download. This can usually be found from the URL. (defaults to 9780321990167)
    
  `-p` or `--pages`: Number of pages to download. (defaults to 10)
  
  `-v` or `--verbose`: Display status of each page as we go.
  
  `-w` or `--width`: Width (in pixels) to be downloaded. (defaults to 2400)
  
## Example

![screen shot 2017-01-27 at 17 39 43-2](https://cloud.githubusercontent.com/assets/1683528/22393346/6619b6d4-e4b9-11e6-8358-80541033f300.png)
