#!/usr/bin/env node

let http    = require('https');
let Stream  = require('stream').Transform;
let fs      = require('fs');
const chalk = require('chalk');

let start = 367836503;
let pages = 10;
let width = 2400
let verbose = false;
let cookie;

let count = 0;
let time = new Date();

let args = process.argv;
for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
        case '-s':
        case '--start':
            start = Number(args[i + 1]);
            break;
        case '-p':
        case '-pages':
            pages = Number(args[i + 1]);
            break;
        case '-w':
        case '--width':
            width = args[i + 1];
            break;
        case '-c':
        case '--cookie':
            cookie = args[i + 1];
            break;
        case '-h':
        case '--help':
            showHelp();
            break;
        case '-v':
        case '--verbose':
            verbose = true;
            break;
    }
}

if (cookie === null) {
    console.log(`JIGSAW_COOKIE required!`);
    console.log('To get a valid cookie, log in to ' +
                chalk.cyan('http://jigsaw.vitalsource.com/books/9780321990167') +
                '\nThen run this in the console:\n' +
                chalk.yellow('window.prompt("Copy to clipboard: Ctrl+C, Enter", document.cookie);'));
    exit(1);
    showHelp();
    return 1;
}

function showHelp() {
    console.log(`textbook_scraper.js [-s START_PAGE] [--verbose] [-p NUMBER_OF_PAGES] [-w IMAGE_WIDTH] -c JIGSAW_COOKIE`);
}

let options = {
    'method': 'GET',
    'hostname': 'jigsaw.vitalsource.com',
    'port': null,
    'path': '/books/9780321990167/pages/367836503/content?width=2400',
    'headers': {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'cookie': cookie,
        'cache-control': 'no-cache'
    }
};

function exit (exit_code) {
    time = (new Date() - time) / 1000;
    // Tell the user how we did if we didn't fail right away
    if (time > 1 || count > 0) {
        console.log(`Downloaded ${count} pages in ${time} seconds.`);
    }
    // Alert the console
    console.log("\007")
    process.exit(exit_code);
}

recursiveRequest(start);

function recursiveRequest(page) {
    if (page >= start + pages) {
        exit(0)
    }

    options.path = `/books/9780321990167/pages/${page}/content?width=${width}`;
    if (verbose) {
        console.log(chalk.cyan(`  Analyzing page ${page}: ${options.hostname}${options.path}`));
    }
    // Load the website for `page`
    http.request(options, function (response) {
      let chunks = [];

      response.on('data', function (chunk) {
        chunks.push(chunk);
      });

      response.on('error', function (err) {
        console.log(`Error occurred.`);
      });

      response.on('end', function () {
        // Extract the encrypted location / id
        let contents = Buffer.concat(chunks).toString();
        let id = contents.match('553246736447566b5831.*3d0a');
        if (id === null || id[0].length != 90) {
            // We are being redirected to a login page, our cookie isn't valid
            // if (contents.match('redirected')) {
                // Follow the redirect link and see if it's asking us to sign in
                // console.log(contents);
            // }
            if (verbose) {
                console.log(chalk.red(`   Avoiding page ${page} with id ${id}`));
            }
            recursiveRequest(page + 1);
        } else {
            options.path = `/books/9780321990167/images/${id}/encrypted/${width}`
            if (verbose) {
                console.log(chalk.green(`Downloading page ${page}: ${options.hostname}${options.path}`));
            }
            // Download the actual image
            http.request(options, function(response) {
                let data = new Stream();

                response.on('data', function(chunk) {
                    data.push(chunk);
                });

                response.on('error', function (err) {
                    console.log(`Error occurred.`);
                });

                response.on('end', function() {
                    fs.writeFileSync(`${page}.jpg`, data.read());
                    count++;
                    recursiveRequest(page + 1);
                });
            }).end();
        }
      });
    }).end();
}
