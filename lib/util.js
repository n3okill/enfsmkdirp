/**
 * @project enfsmkdirp
 * @filename util.js
 * @description helper methods for enfsmkdirp module
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 18-02-2016.
 * @version 0.0.1
 */

var nodePath = require("path"),
    nodeUtil = require("util"),
    enFs = require("enfspatch"),
    braceExpansion = require("brace-expansion");


function inspectCurlyBraces(path) {
    return braceExpansion(path);
}


function getOptions(opt) {
    var options = {};

    if (opt) {
        if (!nodeUtil.isObject(opt)) {
            options = {mode: opt};
        } else {
            options = opt;
        }
    }
    options.fs = options.fs || enFs;
    options.mode = options.mode ? nodeUtil.isString(options.mode) ? parseInt(options.mode, 8) : options.mode : parseInt("0777", 8);

    return options;
}

function getPaths(originalPath) {
    var path, paths = [];

    path = nodeUtil.isArray(originalPath) ? originalPath : [originalPath];

    path.forEach(function(p) {
        var ps = [p];
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
    inspectCurlyBraces: inspectCurlyBraces,
    getOptions: getOptions,
    getPaths: getPaths
};
