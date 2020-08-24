const Clause = require('./Clause'); 

class Filter extends Clause {
    column = '';
    operator = '=';
    placeholder = '?';
    value = null;
    type = 'string'

    getParam() {
        const type = this.type;
        return {
            type,
            name: this.column,
            value: this.value,
            [this.column]: this.value
        };
    }

    sql() {
        return `${this.column} ${this.operator} ${this.placeholder}`;
    }
}
module.exports = Filter;