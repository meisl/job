var buster = require("buster-node");
var assert = buster.assert;
var refute = buster.refute;

var job = require("../lib/job.js");

buster.testCase("job", {

    "create returns a function": {
    
        "!": function() {
            var j = job.create();
            assert.isFunction(j);
        },

        "that won't throw if given no argument": function(testDone) {
            var j = job.create();
            refute.exception(j, "should not have thrown");
        },

        "that will eventually call back its argument": function(testDone) {
            var j = job.create();
            j(function() {
                assert(true);
                testDone();
            });
        },

    },

});
