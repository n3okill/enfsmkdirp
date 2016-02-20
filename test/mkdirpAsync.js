/**
 * Created by JParreir on 05-10-2015.
 */
/* global afterEach, beforeEach, describe, it, after, before, process */

"use strict";

var nodePath = require("path"),
    nodeOs = require("os"),
    rimraf = require("rimraf"),
    enFs = require("enfspatch"),
    mkdirp = require("../"),
    mkdirpUtil = require("../lib/util"),
    cwd = process.cwd();


describe("enfsmkdirp async", function() {
    var _0777, _0755, _0744, tmpPath, isWindows, invalidWindowsDrive = "AB:\\";
    tmpPath = nodePath.join(nodeOs.tmpdir(), "enfsmkdirpasync");
    _0777 = parseInt("0777", 8);
    _0755 = parseInt("0755", 8);
    _0744 = parseInt("0744", 8);
    isWindows = /^win/.test(process.platform);
    before(function() {
        if (!enFs.existAccessSync(tmpPath)) {
            enFs.mkdirSync(tmpPath);
        }
        process.chdir(tmpPath);
    });
    afterEach(function() {
        rimraf.sync(tmpPath + nodePath.sep + "*");
    });
    after(function() {
        process.chdir(cwd);
        rimraf.sync(tmpPath);
    });

    it("should test mkdirp", function(done) {
        var file, x, y, z;
        x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        file = nodePath.join(tmpPath, [x, y, z].join(nodePath.sep));
        mkdirp.mkdirp(file, _0755, function(err) {
            (err === null).should.be.equal(true);
            enFs.stat(file, function(errStat, stat) {
                (errStat == null).should.be.equal(true);
                stat.isDirectory().should.be.equal(true);
                if (!isWindows) {
                    (stat.mode & _0777).should.be.equal(_0755);
                }
                done();
            });
        });
    });
    it("should test chmod", function(done) {
        var ps, file;
        ps = [tmpPath];
        for (var i = 0; i < 25; i++) {
            ps.push(Math.floor(Math.random() * Math.pow(16, 4)).toString(16));
        }
        file = ps.join(nodePath.sep);
        mkdirp.mkdirp(file, _0744, function(err) {
            (err === null).should.be.equal(true);
            enFs.stat(file, function(errStat, stat) {
                (errStat === null).should.be.equal(true);
                stat.isDirectory().should.be.equal(true);
                if (!isWindows) {
                    (stat.mode & _0777).should.be.equal(_0744);
                }
                mkdirp.mkdirp(file, _0755, function(err2) {
                    (err2 === null).should.be.equal(true);
                    enFs.stat(file, function(errStat2, stat2) {
                        (errStat2 === null).should.be.equal(true);
                        stat2.isDirectory().should.be.equal(true);
                        if (!isWindows) {
                            (stat2.mode & _0777).should.not.be.equal(_0755);
                            (stat2.mode & _0777).should.be.equal(_0744);
                        }
                        done();
                    });
                });
            });
        });
    });
    it("should test overwrite", function(done) {
        var ps, file, itw;
        ps = [tmpPath];
        for (var i = 0; i < 2; i++) {
            ps.push(Math.floor(Math.random() * Math.pow(16, 4)).toString(16));
        }
        file = ps.join(nodePath.sep);
        //a file in the way
        itw = ps.slice(0, 2).join(nodePath.sep);
        enFs.writeFile(itw, "I am in the way", function(errWrite) {
            (errWrite === null).should.be.equal(true);
            enFs.stat(itw, function(errStat, stat) {
                (errStat === null).should.be.equal(true);
                stat.isFile().should.be.equal(true);
                mkdirp.mkdirp(file, _0755, function(err) {
                    err.should.be.instanceOf(Error);
                    //using mkdir(2) will throw an EEXIST even if there's a file in the way instead of throwing ENOTDIR
                    err.code.should.be.equalOneOf("ENOTDIR", "EEXIST");
                    done();
                });
            });
        });
    });

    it("should test permissions", function(done) {
        var file;
        file = nodePath.join(tmpPath, (Math.random() * (1 << 30)).toString(16));

        mkdirp.mkdirp(file, _0755, function(err) {
            (err === null).should.be.equal(true);
            enFs.stat(file, function(errStat, stat) {
                (err === null).should.be.equal(true);
                stat.isDirectory().should.be.equal(true);
                if (!isWindows) {
                    (stat.mode & _0777).should.be.equal(_0755);
                }
                done();
            });
        });
    });
    it("should test root permissions", function(done) {
        mkdirp.mkdirp(tmpPath, _0755, function(err) {
            (err === null).should.be.equal(true);
            done();
        });
    });
    it("should test race", function(done) {
        var testsNumber, ps, file, i;
        testsNumber = 10;
        ps = [tmpPath];

        for (i = 0; i < 25; i++) {
            ps.push(Math.floor(Math.random() * Math.pow(16, 4)).toString(16));
        }
        file = ps.join(nodePath.sep);

        function makeFile(file) {
            mkdirp.mkdirp(file, _0755, function(err) {
                (err === null).should.be.equal(true);
                enFs.stat(file, function(errStat, stat) {
                    (errStat === null).should.be.equal(true);
                    stat.isDirectory().should.be.equal(true);
                    if (!isWindows) {
                        (stat.mode & _0777).should.be.equal(_0755);
                    }
                    if (--testsNumber === 0) {
                        done();
                    }
                });
            });
        }

        for (i = 0; i < testsNumber; i++) {
            makeFile(file);
        }
    });
    it("should test relative path", function(done) {
        var file, x, y, z;

        x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        file = [x, y, z].join(nodePath.sep);

        mkdirp.mkdirp(file, _0755, function(err) {
            (err === null).should.be.equal(true);
            enFs.stat(file, function(errStat, stat) {
                (errStat === null).should.be.equal(true);
                stat.isDirectory().should.be.equal(true);
                if (!isWindows) {
                    (stat.mode & _0777).should.be.equal(_0755);
                }
                done();
            });
        });
    });
    it("should test relative path 2", function(done) {
        var file, x, y, z;

        x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        file = [x, y, z].join(nodePath.sep);
        file = nodePath.join("..", "tmp", file);

        mkdirp.mkdirp(file, _0755, function(err) {
            (err === null).should.be.equal(true);
            enFs.stat(file, function(errStat, stat) {
                (errStat === null).should.be.equal(true);
                stat.isDirectory().should.be.equal(true);
                if (!isWindows) {
                    (stat.mode & _0777).should.be.equal(_0755);
                }
                done();
            });
        });
    });
    it("should test relative path 3", function(done) {
        var file, x, y, z;


        x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        file = [x, y, z].join(nodePath.sep);
        file = nodePath.join(".", file);

        mkdirp.mkdirp(file, _0755, function(err) {
            (err === null).should.be.equal(true);
            enFs.stat(file, function(errStat, stat) {
                (errStat === null).should.be.equal(true);
                stat.isDirectory().should.be.equal(true);
                if (!isWindows) {
                    (stat.mode & _0777).should.be.equal(_0755);
                }
                done();
            });
        });
    });
    it("should test return value", function(done) {
        var file, x, y, z;

        x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        file = nodePath.join(tmpPath, [x, y, z].join(nodePath.sep));

        // should always return the full path created.
        //on second test it won't recreate the folder but will return the path
        mkdirp.mkdirp(file, function(err, made) {
            (err === null).should.be.equal(true);
            made.should.be.equal(nodePath.join(tmpPath, x, y, z));
            mkdirp.mkdirp(file, function(err, made2) {
                (err === null).should.be.equal(true);
                made2.should.be.equal(file);
                done();
            });
        });
    });
    it("should test root", function(done) {
        var file;
        file = nodePath.resolve(nodePath.sep);
        // '/' on unix, 'c:/' on windows.

        mkdirp.mkdirp(file, _0755, function(err) {
            (err === null).should.be.equal(true);
            enFs.stat(file, function(errStat, stat) {
                (err === null).should.be.equal(true);
                stat.isDirectory().should.be.equal(true);
                done();
            });
        });
    });
    it("should test implicit mode from umask", function(done) {
        var file, x, y, z;

        x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        file = nodePath.join(tmpPath, [x, y, z].join(nodePath.sep));

        mkdirp.mkdirp(file, function(err) {
            (err === null).should.be.equal(true);
            enFs.stat(file, function(errStat, stat) {
                (err === null).should.be.equal(true);
                stat.isDirectory().should.be.equal(true);
                if (!isWindows) {
                    (stat.mode & _0777).should.be.equal(_0777);
                }
                done();
            });
        });
    });
    it("should test null byte filename", function(done) {
        var file, x, y, z, nullChar = "\0";

        x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        file = nodePath.join(tmpPath, [x, y, z].join(nodePath.sep), nullChar);

        mkdirp.mkdirp(file, function(err) {
            (err === null).should.be.equal(false);
            err.should.instanceof(Error);
            if (err.code) {
                err.code.should.be.equal("ENOENT");
            }
            err.message.should.containEql("string without null bytes.");
            done();
        });
    });
    it("should test curly braces async", function(done) {
        var paths, size, file;
        file = nodePath.resolve(tmpPath);
        file = file + "/{production,dev}/{css,img,js}";
        paths = mkdirpUtil.inspectCurlyBraces(file);
        paths = paths.map(function(path) {
            return nodePath.resolve(path);
        });
        size = paths.length;
        mkdirp.mkdirp(file, function(err) {
            (err === null).should.be.equal(true);
            paths.forEach(function(path) {
                enFs.stat(path, function(errStat, stat) {
                    (errStat === null).should.be.equal(true);
                    stat.isDirectory().should.be.equal(true);
                    if (--size === 0) {
                        done();
                    }
                });
            });
        });
    });
    it("should test invalid path drive on windows", function(done) {
        var file;
        file = nodePath.join(invalidWindowsDrive, "fooAsync");
        if (!isWindows) {
            return done();
        }
        mkdirp.mkdirp(file, function(err) {
            if (isWindows) {
                (err === null).should.be.equal(false);
                err.code.should.be.equal("ENOENT");
                err.message.should.containEql("no such file or directory, mkdir");
            } else {
                (err === null).should.be.equal(true);
            }
            done();
        });
    });
    it("should test invalid filename with double quote async", function(done) {
        var file;
        file = nodePath.join(tmpPath, 'foo"bar');

        mkdirp.mkdirp(file, function(err) {
            if (isWindows) {
                (err === null).should.be.equal(false);
                //err.code.should.be.equal("ENOENT");
                err.message.should.containEql("Invalid character found in path");
            } else {
                (err === null).should.be.equal(true);
            }
            done();
        });
    });
    it("should test Date.toISOString", function(done) {
        var file;
        file = nodePath.join(tmpPath, (new Date()).toISOString(), "test");
        mkdirp.mkdirp(file, function(err) {
            if (!isWindows) {
                (err === null).should.be.equal(true);
                enFs.stat(file, function(errStat, stat) {
                    (errStat === null).should.be.equal(true);
                    stat.should.have.property("ctime");
                    //stat.should.be.instanceof(enFs.Stats);
                    stat.isDirectory().should.be.equal(true);
                    done();
                });
            } else {
                (err === null).should.be.equal(false);
                done();
            }
        });
    });
    it("should test mkdir with array of paths", function(done) {
        var size, file;
        file = [nodePath.join(tmpPath, "abc"), nodePath.join(tmpPath, "xyz")];

        size = file.length;
        mkdirp.mkdirp(file, function(err) {
            (err === null).should.be.equal(true);
            file.forEach(function(path) {
                enFs.stat(path, function(errStat, stat) {
                    (errStat === null).should.be.equal(true);
                    stat.isDirectory().should.be.equal(true);
                    if (--size === 0) {
                        done();
                    }
                });
            });
        });
    });
    it("should test mkdir with array of paths and curly braces", function(done) {
        var file, x, y, size, paths = [];
        x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        file = [nodePath.join(tmpPath, x) + "/{production,dev}/{css,img,js}", nodePath.join(tmpPath, y) + "/{production,dev}/{css,img,js}"];
        file.forEach(function(p) {
            paths = paths.concat(mkdirpUtil.inspectCurlyBraces(p));
        });
        size = file.length;
        mkdirp.mkdirp(file, function(err) {
            (err === null).should.be.equal(true);
            paths.forEach(function(path) {
                enFs.stat(path, function(errStat, stat) {
                    (errStat === null).should.be.equal(true);
                    stat.isDirectory().should.be.equal(true);
                    if (--size === 0) {
                        done();
                    }
                });
            });
        });
    });
    it("should test mkdir with a file of the same name", function(done) {
        var file, x;
        x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        file = nodePath.join(tmpPath, x, "file.json");
        enFs.mkdir(nodePath.dirname(file), function(errMkdir) {
            (errMkdir === null).should.be.equal(true);
            enFs.writeFile(file, "Data inside file", function(errWrite) {
                (errWrite === null).should.be.equal(true);
                mkdirp.mkdirp(file, function(err) {
                    err.should.be.instanceOf(Error);
                    err.code.should.be.equal("EEXIST");
                    done();
                });
            });
        });
    });
});
