var buster = require("buster-node");
var assert = buster.assert;
var refute = buster.refute;

var job = require("../lib/job.js");

buster.testCase("job", {

    setUp: function () {
        this.typeErrorMatcher = { name: "TypeError", message: "Expected function" };
    },

    ".create(..) throws TypeError when given a non-function arg": function() {
        assert.exception(function () { job.create(); }, this.typeErrorMatcher, "no arg at all");
        assert.exception(function () { job.create(null); }, this.typeErrorMatcher, "null");
        assert.exception(function () { job.create(undefined); }, this.typeErrorMatcher, "undefined");
        assert.exception(function () { job.create(0); }, this.typeErrorMatcher, "0");
        assert.exception(function () { job.create(''); }, this.typeErrorMatcher, "empty string");
        assert.exception(function () { job.create({}); }, this.typeErrorMatcher, "empty object");
    },

    ".create(f)": {
    
        "returns a function that": {

             "will, when called with": {
             
                "no arg, call f with a function arg": function() {
                    var f = this.spy();
                    var j = job.create(f);
                    j();
                    assert.calledOnce(f);
                    assert.isFunction(f.args[0][0]); // first arg of first call to f
                },

                 "a function arg, call f with that arg": function() {
                    var f = this.spy();
                    var j = job.create(f);
                    var g = function() {};
                    j(g);
                    assert.calledOnce(f);
                    assert.calledWithExactly(f, g);
                },

            },

        },

        ".then(..) throws TypeError when given a non-function arg": function() {
            var f = function () {};
            var j = job.create(f);
            assert.exception(function () { j.then(); }, this.typeErrorMatcher, "no arg at all");
            assert.exception(function () { j.then(null); }, this.typeErrorMatcher, "null");
            assert.exception(function () { j.then(undefined); }, this.typeErrorMatcher, "undefined");
            assert.exception(function () { j.then(0); }, this.typeErrorMatcher, "0");
            assert.exception(function () { j.then(''); }, this.typeErrorMatcher, "empty string");
            assert.exception(function () { j.then({}); }, this.typeErrorMatcher, "empty object");
        },

        ".then(h) returns the job itself": function() {
            var f = function () {};
            var j = job.create(f);
            var h = function () {};
            var j2 = j.then(h); // act
            assert.same(j2, j);
        },

        "//.then(h)() calls h": function() {
            var f = function () {};
            var h = this.spy();
            var j = job.create(f).then(h);
            j(); // act
            assert.calledOnce(h);
        },

    },
    
});
