var should = require('chai').should(),
    utils = require('../index');

var promise = utils.promise;
var promiseFromMemberFunction = utils.promiseFromMemberFunction;

//Test object with an add function
var Seed = function (init) {
    this.init = init;
};

Seed.prototype.add = function (x, callback) {
    for (var i = 0; i < arguments.length - 1; i++) {
        var next = arguments[i];
        if (next) {
            this.init += next;
        }
    }
    arguments[arguments.length - 1](undefined, this.init);
    return this.init;
};

//Test standalone function
function add() {
    var sum = 0;
    for (var i = 0; i < arguments.length - 1; i++) {
        var next = arguments[i];
        if (next) {
            sum += next;
        }
    }
    arguments[arguments.length - 1](undefined, sum);
    return sum;
}
var ensureMatches = function (value, done) {
    return function (result) {
        value.should.equal(result);
        done();
        return result;
    };
};

describe("promiseFromMemberFunction", function () {

    it("should appropriately bind to this", function (done) {
        var seed = new Seed(10);
        promiseFromMemberFunction(seed, seed.add, 1, 2, 3)().then(ensureMatches(16, done));
    });
    it("should use additional arguments passed in after construction", function (done) {
        var seed = new Seed(10);
        var promise = promiseFromMemberFunction(seed, seed.add, 1, 2, 3);
        promise(10).then(ensureMatches(26, done));
    });
    it("should be ok with no additional parameters (edge case)", function (done) {
        var seed = new Seed(10);
        var promise = promiseFromMemberFunction(seed, seed.add);
        promise().then(ensureMatches(10, done));
    })
});

describe("promise", function () {
    it("should read all the parameters", function (done) {
        promise(add, 1, 2, 3, 4, 5)().then(ensureMatches(15, done));
    });
    it("should read additional parameters", function (done) {
        promise(add, 1, 2, 3, 4, 5)(5, 5, 5).then(ensureMatches(30, done));
    })
});
