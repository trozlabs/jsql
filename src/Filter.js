const Clause = require('./Clause'); 

class Filter extends Clause {
    column = '';
    operator = '=';
    placeholder = '?';
    value = null;

    getParam() {
        return { [this.column]: this.value };
    }

    sql() {
        return `${this.column} ${this.operator} ${this.placeholder}`;
    }
}
module.exports = Filter;