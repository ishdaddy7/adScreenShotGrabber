"use strict";

// change console logs to system.stdout.write
// this thing shouldn't hold any states. just send results back and let the other stuff deal with how to manage it.
var fs = require('fs');
var page = require('webpage').create(),
    system = require('system'),
    toSearch,
    toSearchClean,
    urlFilter,
    toFind,
    foundData = {
        toSearch: '',
        toFind: '',
        pathToFile: '',
        lastSearched: '',
        found: false,
        id: ''
    }//,
    //foundDataArr

//initial browser settings
page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36';
page.viewportSize = {
    width: 1024,
    height: 768
}
phantom.cookiesEnabled = true;

//filter function for request data
function replacer(key, value){
    return value.url;
}

//temporary, reading from JSON file
/*function getFoundData () {
    foundDataArr = fs.read('sample.json');
    return JSON.parse(foundDataArr);
}*/

if (system.args.length === 1) {
    phantom.exit(1);
} else {
    toSearch = system.args[1];
    toSearchClean = toSearch.slice(7);
    toFind = system.args[2];
    urlFilter = new RegExp(toFind);
    foundData.id = system.args[3];
    foundData.toSearch = toSearch;
    foundData.toFind = toFind;

    page.onError = function(msg, trace) {
      var msgStack = ['phantom page ERROR for jobDetailId '+ foundData.id +': ' + msg];
      if (trace && trace.length) {
        msgStack.push('phantom page TRACE:');
        trace.forEach(function(t) {
          msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
        });
      }
      console.error(msgStack.join('\n'));
    }

    page.onResourceReceived = function (res) {
        var receivedUrl = JSON.stringify(res, replacer, 4);
            if ((urlFilter).test(receivedUrl)) {
                if (!foundData.found) foundData.found = true;
            }
    }

    //sadly phantomJS doesn't support ES6, backticks would have been sweet here.
    page.open(toSearch, function (status) {
        var now = Date.now();

        if (status !== 'success') {
            console.log('phantom: FAIL to load ' + toSearch + ' jobDetailId' + foundData.id + ' ' + new Date(), 'and status is ', status);
            console.log('phantom: about to exit unhealthily for jobDetailID', foundData.id)
            phantom.exit();
        }
        if (foundData.found){

            var path = 'screenshots/' + foundData.id + '_' + toSearchClean + '/' + Date.now() + '.' + toFind + '.png';
            console.log('phantom: found one for ', path, 'jobDetailID', foundData.id);
            foundData.pathToFile = path;
            foundData.lastSearched = now;
            var processPage = function (dataObj, pathUrl) {
                    try {
                        system.stdout.write(JSON.stringify(foundData));
                        page.render('../../public/'+pathUrl);
                    } catch (err){
                        console.log('phantom: could not process page for jobDetailId', foundData.id);
                    }
                }
            //slight delay to make sure everything loads before grabbing the screenshot
            setTimeout(processPage(foundData, path), 1000);

        } else {
            //stuff for if it isn't found
            console.log('phantom: loaded the page, but did not do anything useful for jobDetailId', foundData.id);
        }
        console.log('phantom: about to exit healthily for jobDetailID', foundData.id)
        phantom.exit();
    });
}
