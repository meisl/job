/* Internal stuff ----------------------------------------------- */

function noop(done) {
    if (done) done();
}

function assertIsFunction(f) {
    if (typeof f != 'function') // Note: also covers no arg case
            throw new TypeError("Expected function but got '" + f + "' of type " + (typeof f));
}

/* Exported stuff ----------------------------------------------- */

function create(f) {
    assertIsFunction(f);
    var next;
    function j(g) {
        if (arguments.length > 0) { // we'll accept no arg but if we get one...
            assertIsFunction(g); // ...it must be a function
        }
        f(g || noop); // we have made sure that f is a function
        if (next) {
            next();
        }
    }
    j.then = function (h) {
        assertIsFunction(h);
        if (next)
            throw new Error("dunno yet what to do if there is already a 'next'");
        next = h;
        return j;
    };
    return j;
}

/* Exports ------------------------------------------------------ */

module.exports = {
    create: create
};