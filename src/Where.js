const { PLACEHOLDER, OPERATOR } = require('./constants');
const Clause = require('./Clause');
const Column = require('./Column');

// console.log(Clause);

class Where extends Clause {
    // format the sql output for easier viewing or debugging. Should work find without disabling.
    format = true;
    //TODO: add subquery row number work around as an option for certain versions of DB2 
    enablePaging = true; 

    #allowedColumns = [];

    clause = '';
    params = [];
    
    currentColumn = null;
    columns = new Map();
    
    #limit = 10;
    #offset = 0;

    constructor(options = {}) {
        super();
        this.format = options.format;
        this.enablePaging = true;
    }
    
    isAllowed(name) {
        // if (this.#allowedColumns.length === 0) return true;
        // console.log('is ' + name + ' allowed ', this.#allowedColumns.includes(name));
        // return this.#allowedColumns.includes(name);
        return true;
    }

    setAllowed(...names) {
        this.#allowedColumns.push(...names);
        console.log(this.#allowedColumns)
        return this;
    }

    where({ name, operator, placeholder, value, sql }) {
        const column = this.columns.get(name);
        if (!this.isAllowed(name)) {
            console.error(`${name} is not allowed.`);
            return this;
        }
        column.add({ 
            column: name,
            operator: OPERATOR[operator],
            placeholder: PLACEHOLDER[placeholder],
            value: value
        });
    }

    column(name, opts = {}) {
        const options = (this.type(name) === 'Object') ? name : Object.assign({ name }, opts);        
        if (!this.isAllowed(options.name)) {
            throw new Error(`The column name '${name}' is not allowed. Allowed Columns are:`, this.#allowedColumns);
        }
        this.currentColumn = this.columns.has(options.name) ? this.columns.get(options.name) : new Column(options);
        this.columns.set(name, this.currentColumn);
        return this;
    }

    and() {
        // this.currentColumn.filters.push('AND');
        // console.log('AND is not fully supported');
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

    group() {
        console.warn('TODO: group by')
        return this;
    }

    sort(...values) {
        console.warn('TODO: order by')
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
        const values  = {};

        var RET = this.format ? `\n` : ' ';
        var ADD = ' AND ';
        
        this.columns.forEach(column => {
            const filters = [];

            column.filters.forEach(filter => {
                // Skip if the value isn't passed in. Kinda the whole point of this.
                if (this.type(filter.value) === 'Undefined') return;
                if (this.type(filter.value) === 'Array' && filter.value.length) return;
                
                // Add to the params array to make sure we have the 
                // param values in the correct order of each expression 
                // and placeholder
                const param = filter.getParam();
                values[param.name] = param.value;
                params.push(param);
                filters.push(filter.sql());
            });

            if (filters.length) {
                columns.push(`( ${filters.join(ADD)} )`);
            }
        });
        
        var clause = [
            `${params.length > 0 ? 'WHERE' : ''} `,
            `    ${columns.join(`${RET}AND `)}`,
            `LIMIT  ?`,
            `OFFSET ?`
        ].join(RET);

        params.push({ 
            name: 'LIMIT',
            LIMIT: this.#limit
        }, { 
            name: 'OFFSET',
            OFFSET: this.#offset
        });
        values.LIMIT = this.#limit;
        values.OFFSET = this.#offset;

        this.clause = clause;
        this.params = params;
        this.values = values;

        return this;
    }

    getParams() {
        return this.params;
    }

    getValues() {
        return this.values;
    }

    sql() {
        if (!this.clause) this.build();
        return this.clause;
    }
}

module.exports = Where;