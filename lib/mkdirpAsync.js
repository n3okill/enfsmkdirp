/**
 * @project enfsmkdirp
 * @filename mkdirpAsync.js
 * @description async methods for creating directories
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 18-02-2016.
 * @version 0.0.2
 */

"use strict";


const nodePath = require("path");
const mkdirUtil = require("./util");
const isWindows = /^win/.test(process.platform);

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
    let options, paths, callbackCalled, size, umask, cwd, done = [];

    if (typeof opt === "function") {
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

    paths.some((p) => {
        p = nodePath.resolve(cwd, p);
        if (callbackCalled) {
            return true;
        }
        mkdirp_(p, options, (err, m) => {
            if (err) {
                callbackCalled = true;
                process.umask(umask);
                return callback(err);
            }
            done.push(m);
            if (!--size && !callbackCalled) {
                callbackCalled = true;
                process.umask(umask);
                return callback(null, done.length > 1 ? done : done[0]);
            }
        });
    });
}

function mkdirp_(path, options, callback) {
    options.fs.mkdir(path, options.mode, (err)=> {
        if (err) {
            if (err.code !== "ENOENT" && err.code !== "EEXIST") {
                return options.fs.stat(path, (errStat, stat) => {
                    return callback((errStat || !stat.isDirectory()) ? err : null, errStat ? null : path);
                });
            } else if (err.code === "EEXIST") {
                return options.fs.stat(path, (errStat, stat)=> {
                    return callback((errStat || !stat.isDirectory()) ? err : null, errStat ? null : path);
                });
            }
        } else {
            return callback(null, path);
        }

        //ENOENT
        const parent = nodePath.dirname(path);
        if (parent === path || /\0/.test(path)) {
            return callback(err);
        }
        if ((/"/.test(path) || /\:\\.*\\.*:.*\\/.test(path)) && isWindows) {
            let e = new Error("Invalid character found in path.");
            e.code = "EINVALID";
            return callback(e);
        }

        mkdirp_(parent, options, (errParent) => {
            if (errParent) {
                return callback(errParent);
            }
            options.fs.mkdir(path, options.mode, (errPath) => {
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
