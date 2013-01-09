/* Internal stuff ----------------------------------------------- */

function noop(done) {
    if (done) done();
}

/* Exported stuff ----------------------------------------------- */

function create(f) {
    function j(g) {
        f ? f(g || noop) : noop(g);
    }
    j.then = function () {};
    return j;
}

/* Exports ------------------------------------------------------ */

module.exports = {
    create: create
};