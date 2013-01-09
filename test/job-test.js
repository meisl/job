var buster = require("buster-node");
var assert = buster.assert;
var refute = buster.refute;

var job = require("../lib/job.js");

buster.testCase("job", {

    setUp: function () {
        this.typeErrorMatcher = { name: "TypeError", message: "Expected function" };
        this.assertTypeError = function (fnUnderTest, argsArray, msg) {
            var thisArg = null; // well, dunno what else to pass as "this"
            assert.exception( function () { fnUnderTest.apply(thisArg, argsArray) }, this.typeErrorMatcher, msg);
        };
    },

    ".create(..) throws TypeError when given a non-function arg": function() {
        this.assertTypeError(job.create, [], "no arg at all");
        this.assertTypeError(job.create, [null], "null");
        this.assertTypeError(job.create, [undefined], "undefined");
        this.assertTypeError(job.create, [0], "0");
        this.assertTypeError(job.create, [''], "empty string");
        this.assertTypeError(job.create, [{}], "empty object");
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
            this.assertTypeError(j.then, [], "no arg at all");
            this.assertTypeError(j.then, [null], "null");
            this.assertTypeError(j.then, [undefined], "undefined");
            this.assertTypeError(j.then, [0], "0");
            this.assertTypeError(j.then, [''], "empty string");
            this.assertTypeError(j.then, [{}], "empty object");
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
