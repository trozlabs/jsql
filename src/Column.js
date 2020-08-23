const Clause = require('./Clause');
const Filter = require('./Filter');

class Column extends Clause {

    filters = [];

    add(opts) {
        const options = Object.assign({ column: this.name }, opts);
        const filter = Object.assign(new Filter(), options);
        this.filters.push(filter);
        return this;
    }
}


module.exports = Column;

