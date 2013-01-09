/* Internal stuff ----------------------------------------------- */

function noop(done) {
    if (done) done();
}

/* Exported stuff ----------------------------------------------- */

function create(f) {
    return function(g) {
        f ? f(g || noop) : noop(g);
    }
}

/* Exports ------------------------------------------------------ */

module.exports = {
    create: create
};