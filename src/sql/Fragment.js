class Fragment {
    index;

    clause;      // select insert update delete where from group by order by
    type; // column, table, 
    
    database;    // database_name
    table;       // table_name
    column;      // column_name
    direction;   // left right inner outer asc desc
    ontable;     // table to join on
    oncolumn;    // column to join on

    #id;
    #name;
    #operator;    // = > >= < <= <>
    #placeholder; // ? | ? .. ? | text
    #alias;       // as alias_name
    #values;      // 1 or more or values
    #schema;
    #sql;
    

    set id (string) {
        this.#id = string;
    }
    get id () {
        if (this.#id) return this.#id;
        return `${this.clause}-${this.column || this.table}-${this.index || 0}`;
    }

    set name (string) {
        this.#name = string;
    }
    get name () {
        if (this.#name) return this.#name;
        return `${this.column || this.table}`;
    }

    set alias (string) {
        this.#alias = string;
    }
    get alias () {
        var alias = this.#alias;
        if (!alias) {
            if (this.clause == 'from' || this.clause.endsWith('join')) {
                alias = this.table;
            } else if (this.clause == 'select') {
                alias = this.column;
            }
        }
        return alias;
    }

    set schema (string) {
        this.#schema = string;
    }
    get schema () {
        if (this.#schema) return this.#schema;
        return (this.table ? this.table + '.' : '') + this.column;
    }

    set values (obj) {
        if (obj == undefined || obj == null) return;
        this.#values = Array.isArray(obj) ? obj : [ obj ];
    }
    get values () {
        return this.#values;
    }

    set operator (string) {
        this.#operator = string;
    }
    get operator () {
        return (this.#operator || '').toUpperCase();
    }

    set placeholder (string) {
        this.#placeholder = string; 
    }
    get placeholder () {
        if (this.#placeholder) return this.#placeholder;

        var operator = (this.operator || '');
        switch (operator.toUpperCase()) {
            case 'LIKE':
                return `'%' || ? || '%'`;
            case 'STARTWITH':
                return `CONCAT(?, '%')`;
            case 'STARTWITH':
                return `CONCAT('%', ?)`;
            case 'BETWEEN':
                return `? AND ?`;
            case 'IN':
            case 'NOT IN':
                return `( ${new Array(this.values.length).fill('?').join(', ')} )`;
            case '=':
            case '>':
            case '<':
            case '>=':
            case '<=':
            case '<>':
            default:
                return `?`;
        }
    }

    set sql (string) {
        this.#sql = string;
    }
    get sql () {
        if (this.#sql) return this.#sql;

        var { table, column, schema, alias, operator, placeholder, direction, ontable, oncolumn } = this;

        switch (this.clause) {

            case 'select':
                alias = (alias || column);
                return `${schema} AS ${alias}`;
            case 'update':
            case 'set':
                return `${schema} = ${placeholder}`;
            case 'insert': 
            case 'into': 
            case 'delete':
                return `${schema}`;
            case 'where':
                return `${schema} ${operator} ${placeholder}`;
            case 'from':
                return `${table} AS ${alias}`;
            case 'values':
                return `${table}`;
            case 'join':
            case 'left_join':
            case 'left_inner_join':
            case 'left_outer_join':
            case 'right_join':
            case 'right_inner_join':
            case 'right_outer_join':
                direction = (direction == 'JOIN' ? '' : direction + ' ');
                placeholder = placeholder || (ontable + '.' + oncolumn);
                return `\b${direction}JOIN    \t ${table} ON ${table}.${column} ${operator} ${ontable + '.' + oncolumn}`;
            case 'group_by': 
                return `${schema}`;
            case 'order_by': 
                direction = (direction || 'ASC');
                return `${schema} ${direction}`;
            case 'limit' :
            case 'offset' :
                return `?`;
        }
    }
    
    constructor(config = {}) {
        config = Object.assign({}, 
            {
                type: 'sql'
            }, 
            config
        );
        var fields = Object.keys(config);
        fields.forEach(field => this[field] = config[field]);
    }
}

module.exports = Fragment;