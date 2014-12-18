"use strict";

var q = require("q");
var _ = require("underscore");

var promise = function(func){
    var args = [undefined].concat(Array.prototype.splice.call(arguments, 1));
    func = func.bind.apply(func, args);
    return q.denodeify(func);
};

//example usage:
// var readFile = promiseFromMemberFunction(fs, fs.readFile, 'output.txt', 'utf-8');
// otherPromise.then(readFile)
var promiseFromMemberFunction = function(obj, func){
    func = func.bind(obj);
    //pass on all paramters but the first 2
    //var args = [func].concat(Array.prototype.splice.call(arguments, 2));
    var args = [func].concat(Array.prototype.splice.call(arguments, 2));
    return promise.apply(undefined, args);
};

module.exports.promiseFromMemberFunction = promiseFromMemberFunction;
module.exports.promise = promise;