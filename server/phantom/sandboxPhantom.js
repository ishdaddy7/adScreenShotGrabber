"use strict";
var fs = require('fs');
//const renderInterval = 1000*10;
var page = require('webpage').create(),
    system = require('system'),
    toSearch,
    toSearchClean,
    urlFilter,
    toFind,
    foundStatus,
    foundData = {
        searchedUrl: '',
        toFind: '',
        screenShotLocation: '',
        timeFound: '',
        success: false
    },
    foundDataArr,
    jobId;

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

function getFoundData () {
    foundDataArr = fs.read('sample.json');
    return JSON.parse(foundDataArr);
}

if (system.args.length === 1) {
    phantom.exit(1);
} else {
    toSearch = system.args[1];
    toSearchClean = toSearch.slice(7);
    toFind = system.args[2];
    jobId = system.args[3];
    urlFilter = new RegExp(toFind);
    foundData.searchedUrl = toSearch;
    foundData.toFind = toFind;

page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }
  console.error(msgStack.join('\n'));
}


    page.onResourceReceived = function (res) {
        var receivedUrl = JSON.stringify(res, replacer, 4);
            if ((urlFilter).test(receivedUrl)) {
                if (!foundStatus) foundStatus = true;
            }
    }

    //sadly phantomJS doesn't support ES6, backticks would have been sweet here.
    page.open(toSearch, function (status) {
        var now = Date.now();

        if (status !== 'success') {
            console.log('FAIL to load the toSearch ' + toSearch + ' ' + new Date());
        }
        if (foundStatus){
            var path = 'screenshots/' + toSearchClean + '/' + Date.now() + '.' + toFind + '.png';
            console.log('found one for ', path)
            foundData.screenShotLocation = path;
            foundData.timeFound = now;
            foundData.success = true;
            foundDataArr = getFoundData();
            console.log('entering processPage');
            var processPage = function (dataObj, pathUrl) {
                    console.log('inside process page');
                    try {
                        page.render(pathUrl);
                        foundDataArr.push(dataObj);
                        fs.write('sample.json', JSON.stringify(foundDataArr));
                    } catch (err){
                        console.log(err);
                    }
                }
            setTimeout(processPage(foundData, path), 1000*5);

        } else {
            //stuff for if it isn't found
            console.log('could not find what you were looking for');
        }
        console.log('about to exit')
        phantom.exit(foundStatus);
    });
}
