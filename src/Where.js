const { PLACEHOLDER, OPERATOR } = require('./constants');
const Clause = require('./Clause');
const Column = require('./Column');

console.log(Clause);

class Where extends Clause {
    
    statement = '';
    params = [];
    
    currentColumn = null;
    columns = new Map();
    
    #limit = 10;
    #offset = 0;

    column(name, opts = {}) {
        const options = (this.type(name) === 'Object') ? name : Object.assign({ name }, opts);        
        this.currentColumn = this.columns.has(options.name) ? this.columns.get(options.name) : new Column(options);
        this.columns.set(name, this.currentColumn);
        return this;
    }

    and() {
        // this.currentColumn.filters.push('AND');
        console.log('AND is not fully supported');
        return this;
    }

    or() {
        // this.currentColumn.filters.push('OR');
        console.log('OR is not yet supported')
        return this;
    }

    is(value) {
        this.currentColumn.add({
            operator: OPERATOR.EQ,
            placeholder: PLACEHOLDER.EQ,
            value: value,
        });
        return this;
    }

    not(value) {
        this.currentColumn.add({ 
            operator: OPERATOR.LTGT,
            placeholder: '?',
            value: value
        });
        return this;
    }

    like(value) {
        this.currentColumn.add({
            operator: OPERATOR.LIKE,
            placeholder: PLACEHOLDER.LIKE,
            value: value
        });
        return this;
    }

    startsWith(value) {
        this.currentColumn.add({
            operator: OPERATOR.LIKE,
            placeholder: PLACEHOLDER.STARTS_WITH,
            value: value,
        });
        return this;
    }

    endsWith(value) {
        this.currentColumn.add({ 
            operator: OPERATOR.LIKE,
            placeholder: PLACEHOLDER.ENDS_WITH,
            value: value,
        });
        return this;
    }

    in(...values) {
        var placeholders = Array(values.length).fill('?').join(', ');
        this.currentColumn.add({
            operator: OPERATOR.IN,
            placeholder: `(${placeholders})`,
            value: values,
        });
        return this;
    }

    gt(value) {
        this.currentColumn.add({
            operator: OPERATOR.GT,
            placeholder: PLACEHOLDER.GT,
            value: value,
        });
        return this;
    }

    gte(value) {
        this.currentColumn.add({
            operator: OPERATOR.GTEQ,
            placeholder: PLACEHOLDER.GTEQ,
            value: value,
        });
        return this;
    }

    lt(value) {
        this.currentColumn.add({
            operator: OPERATOR.LT,
            placeholder: PLACEHOLDER.LT,
            value: value,
        });
        return this;
    }

    lte(value) {
        this.currentColumn.add({
            operator: OPERATOR.LTEQ,
            placeholder: PLACEHOLDER.LTEQ,
            value: value,
        });
        return this;
    }
    
    between(start, end) {
        this.currentColumn.add({
            operator: OPERATOR.BETWEEN,
            placeholder: PLACEHOLDER.BETWEEN,
            value: [ start, end ],
        });
        return this;
    }

    limit(value = 25) {
        this.#limit = value;
        return this;
    }
    
    offset(value = 0) {
        this.#offset = value;
        return this;
    }
    
    page(page = 1, limit = 25) {
        this.limit(limit);
        this.offset(limit * page);
        return this;
    }
    
    build() {
        const params  = [];
        const columns = [];
        
        var RET = `\n`;
        var ADD = ' AND ';
        
        this.columns.forEach(column => {
            // console.log(column)
            const filters = []; 
            column.filters.forEach(filter => {
                // Skip if the value isn't passed in. Kinda the whole point of this.
                if (this.type(filter.value) === 'Undefined') return;
                if (this.type(filter.value) === 'Array' && filter.value.length) return;
                // Add to the params array to make sure we have the 
                // param values in the correct order of each expression 
                // and placeholder
                params.push(filter.getParam());
                filters.push(filter.sql());
                // filters.push(`${filter.column} ${filter.operator} ${filter.placeholder}`);
            });

            if (filters.length) {
                columns.push(`( ${filters.join(ADD)} )`);
            }
        });

        this.params     = params;
        this.statement  = [
            `WHERE `, 
            `    ${columns.join(`${RET}AND `)}`,
            `LIMIT  ${this.#limit}`,
            `OFFSET ${this.#offset}`
        ].join(RET);
        return this;
    }

    getParams() {
        return this.params;
    }

    toString() {
        return this.statement;
    }
}

module.exports = Where;