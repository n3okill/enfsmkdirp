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


describe("enfsmkdirp sync", function() {
    var _0777, _0755, tmpPath, isWindows, invalidWindowsDrive = "AB:\\";
    tmpPath = nodePath.join(nodeOs.tmpdir(), "enfsmkdirpsync");
    _0777 = parseInt("0777", 8);
    _0755 = parseInt("0755", 8);
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

    it("should test mkdirp sync", function(done) {
        var file, x, y, z;
        x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        file = nodePath.join(tmpPath, [x, y, z].join(nodePath.sep));
        (function() {
            mkdirp.mkdirpSync(file, _0755);
            enFs.stat(file, function(errStat, stat) {
                (errStat == null).should.be.equal(true);
                stat.isDirectory().should.be.equal(true);
                if (!isWindows) {
                    (stat.mode & _0777).should.be.equal(_0755);
                }
                done();
            });
        }).should.not.throw();
    });
    it("should test permissions sync", function(done) {
        var file;
        file = nodePath.join(tmpPath, (Math.random() * (1 << 30)).toString(16) + '.json');
        (function() {
            mkdirp.mkdirpSync(file, _0755);
            enFs.stat(file, function(err, stat) {
                (err === null).should.be.equal(true);
                stat.isDirectory().should.be.equal(true);
                if (!isWindows) {
                    (stat.mode & _0777).should.be.equal(_0755);
                }
                done();
            });
        }).should.not.throw();
    });
    it("should test root permissions sync", function(done) {
        (function() {
            mkdirp.mkdirpSync(tmpPath, _0755);
            enFs.stat(tmpPath, function(err, stat) {
                (err === null).should.be.equal(true);
                stat.isDirectory().should.be.equal(true);
                done();
            });
        }).should.not.throw();
    });
    it("should test return value sync", function() {
        var file, x, y, z, made;

        x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        file = nodePath.join(tmpPath, [x, y, z].join(nodePath.sep));

        // should return the first dir created.
        // By this point, it would be profoundly surprising if /tmp didn't
        // already exist, since every other test makes things in there.
        // Note that this will throw on failure, which will fail the test.
        (function() {
            made = mkdirp.mkdirpSync(file);
            made.should.be.equal(nodePath.join(tmpPath, x, y, z));

            // making the same file again should have no effect.
            (function() {
                made = mkdirp.mkdirpSync(file);
                (made === null).should.be.equal(true);
            }).should.not.throw();
        }).should.not.throw();
    });
    it("should test sync", function(done) {
        var file, x, y, z;

        x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        file = nodePath.join(tmpPath, [x, y, z].join(nodePath.sep));

        (function() {
            mkdirp.mkdirpSync(file, _0755);
            enFs.stat(file, function(err, stat) {
                (err === null).should.be.equal(true);
                stat.isDirectory().should.be.equal(true);
                if (!isWindows) {
                    (stat.mode & _0777).should.be.equal(_0755);
                }
                done();
            });
        }).should.not.throw();
    });
    it("should test implicit mode from umask sync", function(done) {
        var file, x, y, z;

        x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        file = nodePath.join(tmpPath, [x, y, z].join(nodePath.sep));

        (function() {
            mkdirp.mkdirpSync(file);
            enFs.stat(file, function(err, stat) {
                (err === null).should.be.equal(true);
                stat.isDirectory().should.be.equal(true);
                if (!isWindows) {
                    (stat.mode & _0777).should.be.equal(_0777);
                }
                done();
            });
        }).should.not.throw();
    });
    it("should test null byte filename", function() {
        var file, x, y, z, nullChar = "\0";

        x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        file = nodePath.join(tmpPath, [x, y, z].join(nodePath.sep), nullChar);

        (function() {
            mkdirp.mkdirpSync(file);
        }).should.throw({message: /string without null bytes/});
    });
    it("should test curly braces sync", function(done) {
        var file, paths, size;

        file = nodePath.resolve(tmpPath);
        file = file + "/{production,dev}/{css,img,js}";
        paths = mkdirpUtil.inspectCurlyBraces(file);
        size = paths.length;

        (function() {
            mkdirp.mkdirpSync(file);
            paths.forEach(function(path) {
                enFs.stat(nodePath.resolve(path), function(errStat, stat) {
                    (errStat === null).should.be.equal(true);
                    stat.isDirectory().should.be.equal(true);
                    if (--size === 0) {
                        done();
                    }
                });
            });
        }).should.not.throw();
    });
    it("should test invalid path drive on windows sync", function() {
        var file;
        if (!isWindows) {
            return;
        }
        file = nodePath.join(invalidWindowsDrive, "fooSync");
        (function() {
            mkdirp.mkdirpSync(file)
        }).should.throw({code: "ENOENT", message: /no such file or directory, mkdir/});
    });
    it("should test invalid filename with double quote sync", function() {
        var file;
        file = tmpPath + nodePath.sep + 'foo"bar';
        if (!isWindows) {
            return;
        }
        (function() {
            mkdirp.mkdirpSync(file)
        }).should.throw({message: /Invalid character found/});
    });
});
