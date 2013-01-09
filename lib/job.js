/* Internal stuff ----------------------------------------------- */

function noop(done) {
    if (done) done();
}

/* Exported stuff ----------------------------------------------- */

function create(f) {
    if (typeof f != 'function') // Note: also covers no arg case
            throw new Error();
    function j(g) {
        f(g || noop); // we have made sure that f is a function
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