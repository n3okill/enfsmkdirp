/**
 * @project enfsmkdirp
 * @filename mkdirpSync.js
 * @description sync methods for creating directories
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 18-02-2016.
 * @version 0.0.1
 */

"use strict";

var nodePath = require("path"),
    mkdirUtil = require("./util"),
    isWindows;


isWindows = /^win/.test(process.platform);

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
    var options, paths, umask, p;

    options = mkdirUtil.getOptions(opt);
    paths = mkdirUtil.getPaths(path);

    umask = process.umask();
    process.umask(0);

    try {
        for (var i = 0; i < paths.length; i++) {
            p = mkdirpSync_(paths[i], options);
        }
    } finally {
        process.umask(umask);
    }

    return p || null;
}

function mkdirpSync_(path, options) {
    var stat, stack = [], p, parent;

    stack.push(path);

    do {
        p = stack.pop();
        try {
            options.fs.mkdirSync(p, options.mode);
        } catch (err) {
            if (err.code !== "ENOENT" && err.code !== "EEXIST") {
                throw err;
            } else if (err.code === "ENOENT") {
                parent = nodePath.dirname(p);
                if (parent === p || /\0/.test(p)) {
                    throw err;
                }
                if ((/"/.test(p) || /\:\\.*\\.*:.*\\/.test(p)) && isWindows) {
                    throw new Error("Invalid character found in path.");
                }
                stack.push(p);
                stack.push(parent);
            } else if (err.code === "EEXIST") {
                try {
                    stat = options.fs.statSync(p);
                } catch (errStat) {
                    throw err;
                }
                if (stat) {
                    if (!stat.isDirectory()) {
                        throw err;
                    } else {
                        return null;
                    }
                }
            }
        }
    } while (stack.length);

    return path;
}


module.exports = mkdirpSync;
