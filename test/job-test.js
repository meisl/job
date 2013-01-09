var buster = require("buster-node");
var assert = buster.assert;
var refute = buster.refute;

var job = require("../lib/job.js");

buster.testCase("job", {

    ".create(..) throws when given": {

        "no arg at all": function() {
            assert.exception(function () { job.create(); }, "no arg");
        },

        "a non-function arg": function() {
            assert.exception(function () { job.create(null); }, "null");
            assert.exception(function () { job.create(undefined); }, "undefined");
            assert.exception(function () { job.create(0); }, "0");
            assert.exception(function () { job.create(''); }, "empty string");
            assert.exception(function () { job.create({}); }, "empty object");
        },
        
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

        ".then(..) throws when not given any arg": function() {
            var f = function () {};
            var j = job.create(f);
            assert.exception(function () { j.then(); }, "no arg");
        },

        ".then(..) throws when given a non-function arg": function() {
            var f = function () {};
            var j = job.create(f);
            assert.exception(function () { j.then(null); }, "null");
            assert.exception(function () { j.then(undefined); }, "undefined");
            assert.exception(function () { j.then(0); }, "0");
            assert.exception(function () { j.then(''); }, "empty string");
            assert.exception(function () { j.then({}); }, "empty object");
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
