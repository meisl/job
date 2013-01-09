/* Internal stuff ----------------------------------------------- */

function noop() {
}

/* Exported stuff ----------------------------------------------- */

function create() {
    return noop;
}

/* Exports ------------------------------------------------------ */

module.exports = {
    create: create
};