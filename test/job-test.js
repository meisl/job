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

        setUp: function () {
            var self = this;
            
            this.callChain = "";
            this.spyX = function (name, maxCallcount, f) {
                var callCount = 0;
                var spy = self.spy( function () {
                    self.callChain += "->" + name;
                    if (++callCount > maxCallcount)
                        throw new Error(name + " called " + callCount + " times! (" + self.callChain+ ")");
                    try {
                        return f.apply(this, arguments);
                    } catch(excFromF) {
                        throw new Error("callChain: " + this.callChain + "; " + util.inspect(excFromF, true) + "\n" + excFromF.stack);
                    }
                });
                spy.displayName = name; // to get a reasonable msg from .callOrder(...)
                var origCalledOnce = spy.calledOnce;
                return spy;
            }
            this.f_callsIts1stArg = function (done) { done(); };
            this.f_doesNothing = function () {};
            assert.calledOnce = function(spy) {
                assert.equals(spy.callCount, 1, self.callChain + "; " + spy.displayName + ".callCount");
            };
        },
         
        "(..) throws TypeError when given a non-function arg": function() {
            var f = this.spy();
            var j = job.create(f);
            this.assertTypeErrorOnNonFunctionArg(j);
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
         
        "() calls f with a function arg": function() {
            var f = this.spyX("f", 1, this.f_doesNothing );
            var j = this.spyX("j", 1, job.create(f) );
            
            j();
            
            assert.calledOnce(f);
            assert.isFunction(f.args[0][0]); // first arg of first call to f
        },

         "(h), h a function, calls f with h": function() {
            var f = this.spyX("f", 1, this.f_doesNothing );
            var g = this.spyX("f", 1, this.f_doesNothing );
            var j = this.spyX("j", 1, job.create(f) );
            
            j(g);
            
            assert.calledOnce(f);
            assert.calledWithExactly(f, g);
        },

        ".then(g)": {

            ", g a function, returns the job itself": function() {
                var f = this.spyX("f", 1, this.f_doesNothing );
                var g = this.spyX("g", 1, this.f_doesNothing );
                var j = job.create(f);
                
                var j2 = j.then(g); // act
                
                assert.same(j2, j);
            },

            "(h), g & h functions, calls f, then g and finally h": function() {
                var f = this.spyX("f", 1, this.f_callsIts1stArg );
                var g = this.spyX("g", 1, this.f_doesNothing );
                var h = this.spyX("h", 1, this.f_doesNothing );
                var j = this.spyX("j", 1, job.create(f).then(g) );
                
                j(h);
                
                assert.calledOnce(f);
                assert.calledOnce(g);
                assert.calledOnce(h);
                assert.callOrder(f, g, h);
            },
            
            ".then(h)(i), g, h & i functions, calls f, then g then h and finally i": function() {
                var f = this.spyX("f", 1, this.f_callsIts1stArg);
                var g = this.spyX("g", 1, this.f_callsIts1stArg);
                var h = this.spyX("h", 1, this.f_doesNothing);
                var i = this.spyX("i", 1, this.f_doesNothing);
                var j = this.spyX("j", 1, job.create(f).then(g).then(h) );

                j(i);

                assert.calledOnce(f);
                assert.calledOnce(g);
                assert.calledOnce(h);
                assert.calledOnce(i);
                assert.callOrder(f, g, h, i);
            },
            
            ".then(h).then(i).(k), g, h, i, k functions, calls f, then g then h then i and finally k": function() {
                var f = this.spyX("f", 1, this.f_callsIts1stArg);
                var g = this.spyX("g", 1, this.f_callsIts1stArg);
                var h = this.spyX("h", 1, this.f_callsIts1stArg);
                var i = this.spyX("i", 1, this.f_doesNothing);
                var k = this.spyX("k", 1, this.f_doesNothing);
                var j = this.spyX("j", 1, job.create(f).then(g).then(h).then(i) );

                j(k);

                assert.calledOnce(f);
                assert.calledOnce(g);
                assert.calledOnce(h);
                assert.calledOnce(i);
                assert.calledOnce(k);
                assert.callOrder(f, g, h, i, k);
            },
        },
    },
});
