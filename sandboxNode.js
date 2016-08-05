'use strict';

var fs = require('fs');


const spawn = require('child_process').spawn;
const phantomScrape = spawn('phantomjs', ['sandboxPhantom.js', 'http://www.llbean.com', 'mathtag.com'])

phantomScrape.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

phantomScrape.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

phantomScrape.on('close', (code) => {
  console.log(`child process exited with code ${code}`)
});
