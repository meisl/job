/* Internal stuff ----------------------------------------------- */

function noop(done) {
    if (done) done();
}

/* Exported stuff ----------------------------------------------- */

function create(f) {
    if (typeof f != 'function') // Note: also covers no arg case
            throw new Error();
    function j(g) {
        f ? f(g || noop) : noop(g);
    }
    j.then = function (h) {
        if (typeof h != 'function') // Note: also covers no arg case
            throw new Error();
        return j;
    };
    return j;
}

/* Exports ------------------------------------------------------ */

module.exports = {
    create: create
};