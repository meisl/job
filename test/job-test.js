var buster = require("buster-node");
var assert = buster.assert;
var refute = buster.refute;

var util = require("util");

var job = require("../lib/job.js");

buster.testCase("job", {

    setUp: function () {
        this.typeErrorMatcher = { name: "TypeError", message: "Expected function" };
        this.assertTypeError = function (fnUnderTest, argsArray, msg) {
            var thisArg = null; // well, dunno what else to pass as "this"
            assert.exception( function () { fnUnderTest.apply(thisArg, argsArray) }, this.typeErrorMatcher, msg);
        };
        this.assertTypeErrorOnNoArg = function (fnUnderTest) {
            this.assertTypeError(fnUnderTest, [], "no arg at all");
        };
        this.assertTypeErrorOnNonFunctionArg = function (fnUnderTest) {
            this.assertTypeError(fnUnderTest, [null], "null");
            this.assertTypeError(fnUnderTest, [undefined], "undefined");
            this.assertTypeError(fnUnderTest, [0], "0");
            this.assertTypeError(fnUnderTest, [''], "empty string");
            this.assertTypeError(fnUnderTest, [{}], "empty object");
        }
    },

    ".create() throws TypeError": function() {
        this.assertTypeErrorOnNoArg(job.create);
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
         
        "(..) throws TypeError when given a non-function arg": function() {
            var f = this.spy();
            var j = job.create(f);
            this.assertTypeErrorOnNonFunctionArg(j);
        },

         "(h), h a function, calls f with h": function() {
            var f = this.spy();
            var j = job.create(f);
            var h = function() {};
            j(h);
            assert.calledOnce(f);
            assert.calledWithExactly(f, h);
        },

        ".then() throws TypeError": function() {
            var f = function () {};
            var j = job.create(f);
            this.assertTypeErrorOnNoArg(j.then);
        },

        ".then(..) throws TypeError when given a non-function arg": function() {
            var f = function () {};
            var j = job.create(f);
            this.assertTypeErrorOnNonFunctionArg(j.then);
        },

        ".then(g), g a function, returns the job itself": function() {
            var f = function () {};
            var j = job.create(f);
            var g = function () {};
            var j2 = j.then(g); // act
            assert.same(j2, j);
        },

        ".then(g)(h), g & h functions, calls f, then g and finally h": function() {
            var f = this.spy( function (done) { done(); } );
            var g = this.spy();
            var h = this.spy();
            var j = job.create(f).then(g);
            j(h); // act
            assert.calledOnce(f);
            assert.calledOnce(g);
            assert.calledOnce(h);
            assert.callOrder(f, g, h);
        },

        ".then(g).then(h)(i), g, h & i functions, calls f, then g then h and finally i": function() {
            var callChain = "";
            var self = this;
            function makeTestFn(name, maxCallcount, f) {
                var callCount = 0;
                return self.spy( function () {
                    callChain += "->" + name;
                    if (++callCount > maxCallcount)
                        throw new Error(name + " called " + callCount + " times! (" + callChain+ ")");
                    return f.apply(this, arguments);
                });
            }
            var a = function (done) { done(); }
            var b = function () {};
            
            var f = makeTestFn("f", 1, a);
            var g = makeTestFn("g", 1, a);
            var h = makeTestFn("h", 1, b);
            var i = makeTestFn("i", 1, b);
            var j = makeTestFn("j", 1, job.create(f).then(g).then(h) );

            try {
                j(i);
            } catch(e) {
                throw new Error("callChain: " + callChain + "; " + util.inspect(e, true));
            }

            assert.equals(f.callCount, 1, callChain + "; f.callCount");
            assert.equals(g.callCount, 1, callChain + "; g.callCount");
            assert.equals(h.callCount, 1, callChain + "; h.callCount");
            assert.equals(i.callCount, 1, callChain + "; i.callCount");
            assert.callOrder(f, g, h, i);
        },

    },
    
});
