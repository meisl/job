var buster = require("buster-node");
var assert = buster.assert;
var refute = buster.refute;

var job = require("../lib/job.js");

buster.testCase("job", {

    ".create() returns a function": {

        "that won't throw if given no argument": function() {
            var j = job.create();
            refute.exception(j, "should not have thrown");
        },

        "that will call its argument": function() {
            var j = job.create();
            var f = this.spy();
            j(f);
            assert.calledOnce(f);
        },

    },

    ".create(f) returns a function": {

         "that will, when called with no arg, eventually call back f with a function arg": function(testDone) {
            var f = function(done) {
                assert.isFunction(done);
                testDone();
            };
            var j = job.create(f);
            j();
        },
    },
    
});
