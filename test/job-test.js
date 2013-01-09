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
        this.assertTypeErrorOnNonFunctionArg = function (fnUnderTest) {
            this.assertTypeError(fnUnderTest, [], "no arg at all");
            this.assertTypeError(fnUnderTest, [null], "null");
            this.assertTypeError(fnUnderTest, [undefined], "undefined");
            this.assertTypeError(fnUnderTest, [0], "0");
            this.assertTypeError(fnUnderTest, [''], "empty string");
            this.assertTypeError(fnUnderTest, [{}], "empty object");
        }
    },

    ".create(..) throws TypeError when given a non-function arg": function() {
        this.assertTypeErrorOnNonFunctionArg(job.create);
    },

    ".create(f)": {
         
        "() calls f with a function arg": function() {
            var f = this.spy();
            var j = job.create(f);
            j();
            assert.calledOnce(f);
            assert.isFunction(f.args[0][0]); // first arg of first call to f
        },

         "(g), g a function arg, calls f with g": function() {
            var f = this.spy();
            var j = job.create(f);
            var g = function() {};
            j(g);
            assert.calledOnce(f);
            assert.calledWithExactly(f, g);
        },

        ".then(..) throws TypeError when given a non-function arg": function() {
            var f = function () {};
            var j = job.create(f);
            this.assertTypeErrorOnNonFunctionArg(j.then);
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
