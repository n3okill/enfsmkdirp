/**
 * @project enfsmkdirp
 * @filename mkdirpSync.js
 * @description sync methods for creating directories
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


function mkdirpSync_(path, options) {
    const stack = [];

    stack.push(path);

    do {
        const p = stack.pop();
        try {
            options.fs.mkdirSync(p, options.mode);
        } catch (err) {
            if (err.code !== "ENOENT" && err.code !== "EEXIST") {
                throw err;
            } else if (err.code === "ENOENT") {
                const parent = nodePath.dirname(p);
                if (parent === p || /\0/.test(p)) {
                    throw err;
                }
                if ((/"/.test(p) || /\:\\.*\\.*:.*\\/.test(p)) && isWindows) {
                    let e = new Error("Invalid character found in path.");
                    e.code = "EINVALID";
                    throw e;
                }
                stack.push(p);
                stack.push(parent);
            } else if (err.code === "EEXIST") {
                let stat;
                try {
                    stat = options.fs.statSync(p);
                } catch (errStat) {
                    throw err;
                }
                if (stat) {
                    if (!stat.isDirectory()) {
                        throw err;
                    } else {
                        return p;
                    }
                }
            }
        }
    } while (stack.length);

    return path;
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
 * @return {Error|string} Error | the last created path
 */
function mkdirpSync(path, opt) {
    let done = [];
    const options = mkdirUtil.getOptions(opt);
    const paths = mkdirUtil.getPaths(path);

    const umask = process.umask();
    process.umask(0);

    try {
        while (paths.length) {
            done.push(mkdirpSync_(paths.shift(), options));
        }
    } finally {
        process.umask(umask);
    }
    done = done.filter((d) => !!d);
    return done.length > 1 ? done : done[0];
}


module.exports = mkdirpSync;
