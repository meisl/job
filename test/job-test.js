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
                        if (excFromF.name == "RangeError") {
                            throw new Error("callChain: " + self.callChain + "; [" + excFromF + ", stack: " + excFromF.stack + "]");
                        } else {
                            if (!excFromF.callChain) {
                                excFromF.callChain = true;
                                excFromF.message = "callChain: " + self.callChain + "; " + excFromF.message;
                            }
                            throw excFromF;
                        }
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
            
            assert.eachCalledOnceInOrderWithFnArg = function () {
                var i, f;
                for (i = 0; i < arguments.length; i++) {
                    f = arguments[i];
                    assert.calledOnce(f);
                    assert.isFunction(f.args[0][0]); // first arg of first call to f
                }
                assert.callOrder.apply(this, arguments);
            };
            
            this.f = this.spyX("f", 1, this.f_callsIts1stArg );
            this.g = this.spyX("g", 1, this.f_callsIts1stArg );
            this.j = job.create(this.f);
        },
         
        "(..) throws TypeError when given a non-function arg": function() {
            this.assertTypeErrorOnNonFunctionArg(this.j);
        },

        ".then() throws TypeError": function() {
            this.assertTypeErrorOnNoArg(this.j.then);
        },

        ".then(..) throws TypeError when given a non-function arg": function() {
            this.assertTypeErrorOnNonFunctionArg(this.j.then);
        },
         
        "() calls f with a function arg": function() {
            this.j(); // act
            assert.eachCalledOnceInOrderWithFnArg(this.f);
        },

         "(g), g a function, calls f then g, all with a function arg": function() {
            this.j(this.g); // act
            assert.eachCalledOnceInOrderWithFnArg(this.f, this.g);
        },

        ".then(g)": {
        
            setUp: function () {
                this.h = this.spyX("h", 1, this.f_callsIts1stArg );
                this.j = this.j.then(this.g);
            },

            ", g a function, returns the job itself": function() {
                var j = job.create(this.f); // let's not use this.j as this already got .then(this.g) added
                
                var j2 = j.then(this.g); // act
                
                assert.same(j2, j);
            },

             "(), g a function, calls f then g, all with a function arg": function() {
                this.j(); // act
                assert.eachCalledOnceInOrderWithFnArg(this.f, this.g);
            },

            "(h), g & h functions, calls f, then g then h, all with a function arg": function() {
                this.j(this.h); // act
                assert.eachCalledOnceInOrderWithFnArg(this.f, this.g, this.h);
            },
            
            ".then(h)": {
        
                setUp: function () {
                    this.i = this.spyX("i", 1, this.f_callsIts1stArg );
                    this.j = this.j.then(this.h);
                },

                "(), g & h functions, calls f, then g then h, all with a function arg": function() {
                    this.j(); // act
                    assert.eachCalledOnceInOrderWithFnArg(this.f, this.g, this.h);
                },
            
                "(i), g, h & i functions, calls f, then g then h then i, all with a function arg": function() {
                    this.j(this.i); // act
                    assert.eachCalledOnceInOrderWithFnArg(this.f, this.g, this.h, this.i);
                },
                
                ".then(i)": {
            
                    setUp: function () {
                        this.k = this.spyX("k", 1, this.f_callsIts1stArg );
                        this.j = this.j.then(this.i);
                    },
                
                    "(), g, h & i functions, calls f, then g then h then i, all with a function arg": function() {
                        this.j(); // act
                        assert.eachCalledOnceInOrderWithFnArg(this.f, this.g, this.h, this.i);
                    },
                
                    ".(k), g, h, i, k functions, calls f, then g then h then i then k, all with a function arg": function() {
                        this.j(this.k); // act
                        assert.eachCalledOnceInOrderWithFnArg(this.f, this.g, this.h, this.i, this.k);
                    },
                    
                    ".then(k)": {
                
                        setUp: function () {
                            this.l = this.spyX("l", 1, this.f_callsIts1stArg );
                            this.j = this.j.then(this.k);
                        },
                    
                        ".(), g, h, i, k functions, calls f, then g then h then i then k, all with a function arg": function() {
                            this.j(); // act
                            assert.eachCalledOnceInOrderWithFnArg(this.f, this.g, this.h, this.i, this.k);
                        },
                    
                        "(l), g, h, i, k, l functions, calls f, then g then h then i then k then l, all with a function arg": function() {
                            this.j(this.l); // act
                            assert.eachCalledOnceInOrderWithFnArg(this.f, this.g, this.h, this.i, this.k, this.l);
                        },
                    },
                },
            },
        },
    },
});
