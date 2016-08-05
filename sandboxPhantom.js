"use strict";
var fs = require('fs');
var page = require('webpage').create(),
    system = require('system'),
    address,
    addressClean,
    urlFilter,
    needle,
    foundStatus,
    foundData = {
        matchedUrls: [],
        searchedUrl: '',
        screenShotLocation: '',
        timeFound: '',
        success: false
    },
    foundDataArr;

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
    address = system.args[1];
    addressClean = address.slice(7);
    needle = system.args[2];
    urlFilter = new RegExp(needle);
    foundData.searchedUrl = address;

    page.onResourceReceived = function (res) {
        var receivedUrl = JSON.stringify(res, replacer, 4);
            if ((urlFilter).test(receivedUrl)) {
                if (!foundStatus) foundStatus = true;
                foundData.matchedUrls.push(receivedUrl)
            }
        }

    page.open(address, function (status) {
        var now = Date.now();
        if (status !== 'success') {
            console.log('FAIL to load the address ' + address + ' ' + new Date());
        }
        if (foundStatus){
            foundData.screenShotLocation = 'screenshots/' + addressClean + '/' + Date.now() + '.' + needle + '.png';
            foundData.timeFound = now;
            page.render('screenshots/' + addressClean + '/' + now + '.' + needle + '.png');
            foundDataArr = getFoundData();
            foundDataArr.push(foundData);
            fs.write('sample.json', JSON.stringify(foundDataArr));

        } else {

        }
        phantom.exit(foundStatus);
    });
}
