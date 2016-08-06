'use strict';

const fs = require('fs');
//let runCheckInterval = 1000 * 30;
let phantomScript = 'sandboxPhantom.js';

//pre-seeded pages
let pages = [{
      toSearch: 'http://www.cnn.com',
      toFind: 'google'
  }/*,{
      toSearch: 'http://www.llbean.com',
      toFind: 'mathtag.com'
    }*/,
    {
      toSearch: 'http://www.techcrunch.com',
      toFind: 'moatads'
    }
  ];

let counter = 0;
let checkPages = function(){
  counter++;
  pages.forEach(function(page){
    const spawn = require('child_process').spawn;
    const scrape = spawn('phantomjs', [phantomScript, page.toSearch, page.toFind]);
    scrape.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    })
    scrape.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
    });
  });
  if(counter === 2) {
    clearInterval(runCheckPages);
    return;
  }
}
//spawn phantom instances
var runCheckPages = setInterval(checkPages, 1000 * 10);
