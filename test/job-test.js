var buster = require("buster-node");
var assert = buster.assert;
var refute = buster.refute;

var job = require("../lib/job.js");

buster.testCase("job", {

    "exports function create": function() {
        assert.isFunction(job.create);
    }

});
