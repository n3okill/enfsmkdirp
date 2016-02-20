var nodePath = require("path"),
    nodeOs = require("os"),
    rimraf = require("rimraf"),
    enFs = require("enfspatch"),
    mkdirp = require("../"),
    Mock = require("mock-fs"),
    cwd = process.cwd();


describe("esnofsmkdirp mockfs", function() {
    var _0777, _0755, tmpPath, isWindows;
    tmpPath = nodePath.join(nodeOs.tmpdir(), "enfsmkdirpsync");
    _0777 = parseInt("0777", 8);
    _0755 = parseInt("0755", 8);
    isWindows = /^win/.test(process.platform);
    before(function() {
        if (!enFs.existStatSync(tmpPath)) {
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
    describe("> async", function() {
        it("should test options fs", function(done) {
            var tmpFs, file, x, y, z;
            tmpFs = Mock.fs({});

            x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
            y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
            z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

            tmpFs.isTmpFs = true;
            enFs.hasOwnProperty("isTmpFs").should.be.equal(false);
            tmpFs.hasOwnProperty("isTmpFs").should.be.equal(true);

            file = nodePath.join(tmpPath, "beep", "boop", [x, y, z].join(nodePath.sep));

            mkdirp.mkdirp(file, {fs: tmpFs, mode: _0755}, function(err) {
                (err === null).should.be.equal(true);
                tmpFs.stat(file, function(errStats, stat) {
                    (errStats === null).should.be.equal(true);
                    stat.isDirectory().should.be.equal(true);
                    if (!isWindows) {
                        (stat.mode & _0777).should.be.equal(_0755);
                    }
                    done();
                });
            });
        });
    });
    describe("> sync", function() {
        it("should test options fs sync", function(done) {
            var tmpFs, file, x, y, z;
            tmpFs = Mock.fs({});

            x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
            y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
            z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

            tmpFs.isTmpFs = true;
            enFs.hasOwnProperty("isTmpFs").should.be.equal(false);
            tmpFs.hasOwnProperty("isTmpFs").should.be.equal(true);

            file = nodePath.join(tmpPath, "beep", "boop", [x, y, z].join(nodePath.sep));

            mkdirp.mkdirpSync(file, {fs: tmpFs, mode: _0755});
            tmpFs.stat(file, function(err, stat) {
                (err === null).should.be.equal(true);
                stat.isDirectory().should.be.equal(true);
                if (!isWindows) {
                    (stat.mode & _0777).should.be.equal(_0755);
                }
                done();
            });
        });
    });
});
