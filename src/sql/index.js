const Builder  = require('./Builder');
const Fragment = require('./Fragment');
const File     = require('./File');

class SQL {
    static Builder  = Builder;
    static Fragment = Fragment;
    static File     = File;
}

module.exports = SQL;