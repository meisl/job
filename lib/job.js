/* Internal stuff ----------------------------------------------- */

function noop(done) {
    if (done) done();
}

/* Exported stuff ----------------------------------------------- */

function create(f) {
    return f ? f : noop;
}

/* Exports ------------------------------------------------------ */

module.exports = {
    create: create
};