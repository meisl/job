/* Internal stuff ----------------------------------------------- */

function noop(done) {
    if (done) done();
}

/* Exported stuff ----------------------------------------------- */

function create(f) {
    return function() {
        f ? f(noop) : noop();
    }
}

/* Exports ------------------------------------------------------ */

module.exports = {
    create: create
};