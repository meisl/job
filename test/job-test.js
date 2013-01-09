var buster = require("buster-node");
var assert = buster.assert;
var refute = buster.refute;

var job = require("../lib/job.js");

buster.testCase("job", {

    ".create()": {
    
        "returns a function that": {

            "won't throw if given no argument": function() {
                var j = job.create();
                refute.exception(j, "should not have thrown");
            },

            "will call its argument": function() {
                var f = this.spy();
                var j = job.create();
                j(f);
                assert.calledOnce(f);
            },

        },

        ".then() returns the job itself": function() {
            var j = job.create();
            assert.same(j.then(), j);
        },

        ".then(h) returns the job itself": function() {
            var j = job.create();
            var h = function () {}
            assert.same(j.then(h), j);
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
        
        ".then() returns the job itself": function() {
            var f = function() {};
            var j = job.create(f);
            assert.same(j.then(), j);
        },
        
        ".then(h) returns the job itself": function() {
            var f = function() {};
            var j = job.create(f);
            var h = function () {}
            assert.same(j.then(h), j);
        },

    },
    
});
