/**
 * Created by n3okill on 07-10-2015.
 */

"use strict";

/**
 * This script will calculate the velocity differences between node-mkdirp and enfs-mkdirp
 */


var nodePath = require("path"),
    rimraf = require("rimraf"),
    mkdirp = require("mkdirp"),
    enfs = require("../"),
    enfsMkdirp = enfs.mkdirp,
    enfsMkdirpSync = enfs.mkdirpSync;

var totalCreations, subDirs, cwd, tmpPath, mkdirpAsyncPath, mkdirpSyncPath, enfsMkdirpAsyncPath, enfsMkdirpSyncPath, paths,
    mkdirpAsyncPaths, mkdirpSyncPaths, enfsMkdirpAsyncPaths, enfsMkdirpSyncPaths, times,
    enfsMkdirpAsyncPathArray, enfsMkdirpSyncPathArray, enfsMkdirpAsyncPathsArray, enfsMkdirpSyncPathsArray, timeBetweenTests, steps, finalTimes = [];

//total steps to be executed
steps = 1;

totalCreations = 1000;
subDirs = 25;

//this variable will change for the biggest of the sync methods time (if bigger then initial value) to allow for disk activity to settle before the next test start
timeBetweenTests = 5000;

times = {
    mkdirp: {
        async: {start: 0, end: 0},
        sync: {start: 0, end: 0}
    },
    enfsMkdir: {
        async: {start: 0, end: 0},
        asyncArray: {start: 0, end: 0},
        sync: {start: 0, end: 0},
        syncArray: {start: 0, end: 0}
    }
};

cwd = process.cwd();
process.cwd();

tmpPath = nodePath.join(__dirname, "..", "tmp");
mkdirpAsyncPath = nodePath.join(tmpPath, "mkdir", "async");
mkdirpSyncPath = nodePath.join(tmpPath, "mkdir,sync");
enfsMkdirpAsyncPath = nodePath.join(tmpPath, "enfsMkdir", "async");
enfsMkdirpSyncPath = nodePath.join(tmpPath, "enfsMkdir", "sync");
enfsMkdirpAsyncPathArray = nodePath.join(tmpPath, "enfsMkdir", "array", "async");
enfsMkdirpSyncPathArray = nodePath.join(tmpPath, "enfsMkdir", "array", "sync");

//all generations will use the same sub dirs to avoid time generation constraints
paths = createSubPaths();

mkdirpAsyncPaths = paths;
mkdirpAsyncPaths = mkdirpAsyncPaths.map(function(path) {
    return nodePath.join(mkdirpAsyncPath, path.join(nodePath.sep));
});
mkdirpSyncPaths = paths;
mkdirpSyncPaths = mkdirpSyncPaths.map(function(path) {
    return nodePath.join(mkdirpSyncPath, path.join(nodePath.sep));
});
enfsMkdirpAsyncPaths = paths;
enfsMkdirpAsyncPaths = enfsMkdirpAsyncPaths.map(function(path) {
    return nodePath.join(enfsMkdirpAsyncPath, path.join(nodePath.sep));
});
enfsMkdirpSyncPaths = paths;
enfsMkdirpSyncPaths = enfsMkdirpSyncPaths.map(function(path) {
    return nodePath.join(enfsMkdirpSyncPath, path.join(nodePath.sep));
});

enfsMkdirpAsyncPathsArray = paths;
enfsMkdirpAsyncPathsArray = enfsMkdirpAsyncPathsArray.map(function(path) {
    return nodePath.join(enfsMkdirpAsyncPathArray, path.join(nodePath.sep));
});
enfsMkdirpSyncPathsArray = paths;
enfsMkdirpSyncPathsArray = enfsMkdirpSyncPathsArray.map(function(path) {
    return nodePath.join(enfsMkdirpSyncPathArray, path.join(nodePath.sep));
});

console.log("Benchmarking mkdir with '" + subDirs + "' sub folders path and a total of '" + totalCreations + "' creations");

//execution will start by createMkdirSync
console.log("Execution will begin in %dms", 500);
setTimeout(function() {
    createMkdirSync();
}, 500);

function createMkdirSync() {
    times.mkdirp.sync.start = Date.now();
    startingEnding(true, "mkdirp sync");

    mkdirpSyncPaths.forEach(function(path) {
        mkdirp.sync(path);
    });
    times.mkdirp.sync.end = Date.now();
    startingEnding(false, "mkdirp sync");
    rimraf(mkdirpSyncPath, function() {
        if ((times.mkdirp.sync.end - times.mkdirp.sync.start) > timeBetweenTests) {
            timeBetweenTests = ((times.mkdirp.sync.end - times.mkdirp.sync.start) * 2);
        }
        nextTest();
        setTimeout(function() {
            createEsnoFsMkdirSync();
        }, timeBetweenTests);
    });
}

function createMkdirAsync() {
    var steps = 0;
    times.mkdirp.async.start = Date.now();

    startingEnding(true, "mkdirp async");

    mkdirpAsyncPaths.forEach(function(path) {
        mkdirp(path, end);
    });

    function end() {
        if (++steps === totalCreations) {
            times.mkdirp.async.end = Date.now();

            startingEnding(false, "mkdirp async");

            rimraf(mkdirpAsyncPath, function() {
                nextTest();
                setTimeout(function() {
                    createEsnofsMkdirAsync();
                }, timeBetweenTests);
            });
        }
    }
}

function createEsnofsMkdirAsync() {
    var steps = 0;
    times.enfsMkdir.async.start = Date.now();

    startingEnding(true, "enfsmkdirp async");

    enfsMkdirpAsyncPaths.forEach(function(path) {
        enfsMkdirp(path, end);
    });

    function end() {
        if (++steps === totalCreations) {
            times.enfsMkdir.async.end = Date.now();

            startingEnding(false, "enfsmkdirp async");

            rimraf(enfsMkdirpAsyncPath, function() {
                nextTest();
                setTimeout(function() {
                    createEsnofsMkdirAsyncArray();
                }, timeBetweenTests);
            });
        }
    }
}

function createEsnoFsMkdirSync() {
    times.enfsMkdir.sync.start = Date.now();
    startingEnding(true, "enfsmkdir sync");
    enfsMkdirpSyncPaths.forEach(function(path) {
        enfsMkdirpSync(path);
    });
    times.enfsMkdir.sync.end = Date.now();
    startingEnding(false, "enfsmkdir sync");
    rimraf(enfsMkdirpSyncPath, function() {
        nextTest();
        setTimeout(function() {
            createEsnofsMkdirSyncArray();
        }, timeBetweenTests);
    });
}

function createEsnofsMkdirSyncArray() {
    times.enfsMkdir.syncArray.start = Date.now();
    startingEnding(true, "enfsmkdir sync array");
    enfsMkdirpSync(enfsMkdirpSyncPathsArray);
    times.enfsMkdir.syncArray.end = Date.now();
    startingEnding(false, "enfsmkdir sync array");
    rimraf(enfsMkdirpSyncPathArray, function() {
        nextTest();
        setTimeout(function() {
            endSyncTests();
        }, timeBetweenTests);
    });
}


function createEsnofsMkdirAsyncArray() {
    times.enfsMkdir.asyncArray.start = Date.now();

    startingEnding(true, "enfsmkdir async array");

    enfsMkdirp(enfsMkdirpAsyncPathsArray, end);

    function end() {
        times.enfsMkdir.asyncArray.end = Date.now();

        startingEnding(false, "enfsmkdir async array");

        rimraf(enfsMkdirpAsyncPathArray, function() {
            setTimeout(function() {
                endExecution();
            }, timeBetweenTests);
        });
    }
}

function startingEnding(isStart, test) {
    if (isStart) {
        console.log("Starting test on '" + test + "'");
    } else {
        console.log("Ending test on '" + test + "'");
    }
}


function createSubPaths() {
    var paths = [], subPath = [], i;
    for (i = 0; i < subDirs; i++) {
        subPath.push(Math.floor(Math.random() * Math.pow(16, 4)).toString(16));
    }
    for (i = 0; i < totalCreations; i++) {
        var p;
        p = subPath.slice();
        p.unshift(i);
        paths.push(p);
    }
    return paths;
}


function endSyncTests() {
    var mkdirSync, enfsMkdirSync, enfsMkdirSyncArray, time;
    mkdirSync = times.mkdirp.sync.end - times.mkdirp.sync.start;
    enfsMkdirSync = times.enfsMkdir.sync.end - times.enfsMkdir.sync.start;
    enfsMkdirSyncArray = times.enfsMkdir.syncArray.end - times.enfsMkdir.syncArray.start;

    if (mkdirSync > enfsMkdirSync) {
        if (mkdirSync > enfsMkdirSyncArray) {
            time = mkdirSync;
        } else {
            time = enfsMkdirSyncArray;
        }
    } else {
        if (enfsMkdirSync > enfsMkdirSyncArray) {
            time = enfsMkdirSync;
        } else {
            time = enfsMkdirSyncArray;
        }
    }
    if (time > timeBetweenTests) {
        timeBetweenTests = time + 1000;
    }
    console.log("Value between async tests will be: %dms", timeBetweenTests);
    createMkdirAsync();
}


function endExecution() {
    var i;
    times.mkdirp.async.time = times.mkdirp.async.end - times.mkdirp.async.start;
    times.mkdirp.sync.time = times.mkdirp.sync.end - times.mkdirp.sync.start;
    times.enfsMkdir.async.time = times.enfsMkdir.async.end - times.enfsMkdir.async.start;
    times.enfsMkdir.asyncArray.time = times.enfsMkdir.asyncArray.end - times.enfsMkdir.asyncArray.start;
    times.enfsMkdir.sync.time = times.enfsMkdir.sync.end - times.enfsMkdir.sync.start;
    times.enfsMkdir.syncArray.time = times.enfsMkdir.syncArray.end - times.enfsMkdir.syncArray.start;

    console.log("Benchmark Results: ");
    console.log("Mkdirp async: %dms", times.mkdirp.async.time);
    console.log("Mkdirp sync: %dms", times.mkdirp.sync.time);
    console.log("Esnofsmkdir async: %dms", times.enfsMkdir.async.time);
    console.log("Esnofsmkdir async array: %dms", times.enfsMkdir.asyncArray.time);
    console.log("Ensofsmkdir sync: %dms", times.enfsMkdir.sync.time);
    console.log("Esnofsmkdir sync array: %dms", times.enfsMkdir.syncArray.time);

    finalTimes.push([times.mkdirp.async.time, times.mkdirp.sync.time, times.enfsMkdir.async.time, times.enfsMkdir.asyncArray.time, times.enfsMkdir.sync.time, times.enfsMkdir.syncArray.time]);
    if (--steps > 0) {
        console.log("Next execution will begin in %dms", timeBetweenTests);
        setTimeout(function() {
            createMkdirSync();
        }, timeBetweenTests);
    } else {
        var timesCalc = [0, 0, 0, 0, 0, 0];
        for (i = 0; i < finalTimes.length; i++) {
            for (var j = 0; j < finalTimes[i].length; j++) {
                timesCalc[j] += finalTimes[i][j];
            }
        }
        for (i = 0; i < timesCalc.length; i++) {
            timesCalc[i] /= finalTimes.length;
        }
        console.log("Median time");
        console.log(timesCalc);
    }
}

function nextTest() {
    console.log("Next test will begin in %dms", timeBetweenTests);
}
