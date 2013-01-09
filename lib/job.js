/* Internal stuff ----------------------------------------------- */

function noop(done) {
    if (done) done();
}

/* Exported stuff ----------------------------------------------- */

function create(f) {
    function j(g) {
        f ? f(g || noop) : noop(g);
    }
    j.then = function (h) {
        if (!h) throw new Error();
        return j;
    };
    return j;
}

/* Exports ------------------------------------------------------ */

module.exports = {
    create: create
};