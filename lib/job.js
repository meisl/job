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
    function j(g) {
        if (g) { // we'll accept no arg but if we get one...
            assertIsFunction(g); // ...it must be a function
        }
        f(g || noop); // we have made sure that f is a function
    }
    j.then = function (h) {
        assertIsFunction(h);
        return j;
    };
    return j;
}

/* Exports ------------------------------------------------------ */

module.exports = {
    create: create
};