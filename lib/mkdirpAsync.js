/**
 * @project enfsmkdirp
 * @filename mkdirpAsync.js
 * @description async methods for creating directories
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 18-02-2016.
 * @version 0.0.1
 */

"use strict";


var nodePath = require("path"),
    nodeUtil = require("util"),
    mkdirUtil = require("./util"),
    isWindows;

isWindows = /^win/.test(process.platform);

function noop() {
}


/**
 * Automatically create directories and sub-directories (mkdir -p)
 * @param {string|Array} path - the path to the directory
 * can be   . "/path/to/directory"
 *          . "/path/{to1,to2}/{dir1,dir2}"
 *          , ["/path/to/dir1","path/to/dir2"]
 * @param {object} opt - various options for list module
 *              {string|Number} options.mode - the mode to be affected to the directory
 *              {object} options.fs - the fs module to be used
 * @param {function} callback - the callback function that will be called after the list is done
 * @return {Error|string} Error | the last created path
 */
function mkdirp(path, opt, callback) {
    var options, paths, callbackCalled, size, umask, cwd;

    if (nodeUtil.isFunction(opt)) {
        callback = opt;
        opt = {};
    }
    callback = callback || noop;

    options = mkdirUtil.getOptions(opt);
    paths = mkdirUtil.getPaths(path);

    umask = process.umask();
    process.umask(0);
    cwd = process.cwd();

    size = paths.length;

    paths.some(function(p) {
        p = nodePath.resolve(cwd, p);
        if (callbackCalled) {
            return true;
        }
        mkdirp_(p, options, function(err, m) {
            if (err) {
                callbackCalled = true;
                process.umask(umask);
                return callback(err);
            }
            if (!--size && !callbackCalled) {
                callbackCalled = true;
                process.umask(umask);
                return callback(null, m);
            }
        });
    });
}

function mkdirp_(path, options, callback) {
    options.fs.mkdir(path, options.mode, function(err) {
        var parent;
        if (err) {
            if (err.code !== "ENOENT" && err.code !== "EEXIST") {
                return options.fs.stat(path, function(errStat, stat) {
                    return callback((errStat || !stat.isDirectory()) ? err : null, errStat ? null : path);
                });
            } else if (err.code === "EEXIST") {
                return options.fs.stat(path, function(errStat, stat) {
                    return callback((errStat || !stat.isDirectory()) ? err : null, errStat ? null : path);
                });
            }
        } else {
            return callback(null, path);
        }

        //ENOENT
        parent = nodePath.dirname(path);
        if (parent === path || /\0/.test(path)) {
            return callback(err);
        }
        if ((/"/.test(path) || /\:\\.*\\.*:.*\\/.test(path)) && isWindows) {
            var e = new Error("Invalid character found in path.");
            e.code = "EINVALID";
            return callback(e);
        }

        mkdirp_(parent, options, function(errParent) {
            if (errParent) {
                return callback(errParent);
            }
            options.fs.mkdir(path, options.mode, function(errPath) {
                //Ignore EEXIST error in asynchronous calls to mkdirp
                if (errPath && errPath.code !== "EEXIST") {
                    return callback(err);
                }
                callback(null, path);
            });
        });
    });
}


module.exports = mkdirp;
