/* Internal stuff ----------------------------------------------- */

function noop(done) {
    if (done) done();
}

/* Exported stuff ----------------------------------------------- */

function create() {
    return noop;
}

/* Exports ------------------------------------------------------ */

module.exports = {
    create: create
};