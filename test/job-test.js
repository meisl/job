var buster = require("buster-node");
var assert = buster.assert;
var refute = buster.refute;

var job = require("../lib/job.js");

buster.testCase("job", {

    ".create() returns a function that": {

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

        "has a property 'then'": function() {
            var j = job.create();
            assert.defined(j.then);
        },

    },

    ".create(f) returns a function that": {

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

        "has a property 'then'": function() {
            var f = function() {};
            var j = job.create(f);
            assert.defined(j.then);
        },

    },
    
});
