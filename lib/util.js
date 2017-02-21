/**
 * @project enfsmkdirp
 * @filename util.js
 * @description helper methods for enfsmkdirp module
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 18-02-2016.
 * @version 0.0.2
 */

"use strict";

const nodePath = require("path");
const enFs = require("enfspatch");
const braceExpansion = require("brace-expansion");



const kindOf = (arg) => arg === null ? "null" : typeof arg === "undefined" ? "undefined" : /^\[object (.*)\]$/.exec(Object.prototype.toString.call(arg))[1].toLowerCase();
const isObject = (arg) => arg !== null && typeof arg !== "undefined" && "object" === kindOf(arg);
const isString = (arg) => "string" === kindOf(arg);
const inspectCurlyBraces = (path) => braceExpansion(path);



function getOptions(opt) {
    let options = {};

    if (opt) {
        if (!isObject(opt)) {
            options = {mode: opt};
        } else {
            options = opt;
        }
    }
    options.fs = options.fs || enFs;
    options.mode = options.mode ? isString(options.mode) ? parseInt(options.mode, 8) : options.mode : parseInt("0777", 8);

    return options;
}

function getPaths(originalPath) {
    let paths = [];

    const path = Array.isArray(originalPath) ? originalPath : [originalPath];

    path.forEach(function(p) {
        let ps = [p];
        if (p.indexOf("{")) {
            ps = inspectCurlyBraces(p);
        }
        ps = Array.isArray(ps) ? ps : [ps];
        paths = paths.concat(ps);
    });

    paths = paths.map(function(p) {
        return nodePath.resolve(p);
    });

    return paths;
}


module.exports = {
    inspectCurlyBraces,
    getOptions,
    getPaths
};

