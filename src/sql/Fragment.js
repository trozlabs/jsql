class Fragment {
    index;

    statementType;
    clause;      // select insert update delete where from group by order by
    type;       // column, table,

    database;    // database_name
    table;       // table_name
    column;      // column_name
    direction;   // left right inner outer asc desc
    
    ondatabase;
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
        return (`${this.clause}-${this.column || this.table}-${this.index || 0}`).toUpperCase();
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
        // if (!alias) {
        //     if (this.clause == 'from' || this.clause.endsWith('join')) {
        //         alias = this.table;
        //     } else if (this.clause == 'select') {
        //         alias = this.#alias;
        //     }
        // }
        return alias;
    }

    set schema (string) {
        this.#schema = string;
    }
    get schema () {
        if (this.#schema) return this.#schema;

        var database = (this.database ? this.database : '');
        var table    = (this.table    ? this.table    : '');
        var column   = (this.column   ? this.column   : '');
        var parts    = [database, table, column];
        var schema   = parts.filter(part => (part && part.length)).join('.');
        // console.log(schema);
        return schema;
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
                return `CONCAT('%' || ? || '%')`;
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
        if (this.#sql) {
            return this.#sql;
        }
        var dir;
        var {
            statementType,
            clause,
            type,
            database,
            table,
            column, 
            schema,
            alias,
            operator,
            placeholder,
            direction,
            ondatabase,
            ontable,
            oncolumn
        } = this;
        
        // console.log(
        //     '\nSTMT TYPE :', statementType, 
        //     '\nCLAUSE    :', clause, 
        //     '\nTYPE      :', type,
        //     '\nDATABASE  :', database,
        //     '\nTABLE     :', table,
        //     '\nCOLUMN    :', column,
        //     '\nSCHEMA    :', schema,
        //     '\n'
        // );

        switch (clause) {
            case 'select':
                return `${schema}${alias ? ' AS ' + alias : ''}`;
            case 'update':
            case 'set':
                if (type == 'column') {
                    this.#sql = `${schema} = ${placeholder}`;
                } else {
                    this.#sql = `${schema}`;
                }
                break;
            case 'insert':
            case 'into':
                this.#sql = `${schema}`;
                break;
            case 'on':
                this.#sql = `${schema} ${operator} ${ontable}.${oncolumn}`;
                break;
            case 'where':
                this.#sql = `${schema} ${operator} ${placeholder}`;
                break;
            case 'delete':
                this.#sql = `${schema}`;
                break;
            case 'from':
                if (statementType == 'delete') {
                    this.#sql = `${schema}`;
                } else {
                    this.#sql = `${schema}${alias ? ' AS' + alias: ''}`;
                }
                break;
            case 'values':
                this.#sql = `${table}`;
                break;
            case 'join':
                var dir          = (!direction ? '  join' : direction + ' join').toUpperCase();
                var db           = database ? database + '.' : '';
                var joinSchema   = `${db}${table}.${column}`;
                var onDb         = ondatabase ? ondatabase + '.' : '';
                var joinOnSchema = placeholder.length > 1 && placeholder || `${onDb}${ontable}.${oncolumn}`;
                
                this.#sql = `${dir} ${db}${table} ON ${joinSchema} ${operator || '='} ${joinOnSchema}`;
                break;
            case 'group_by': 
                this.#sql = `${schema}`;
                break;
            case 'order_by': 
                dir = (direction || 'ASC');
                this.#sql = `${schema} ${dir}`;
                break;
            case 'limit' :
            case 'offset' :
                this.#sql = `?`;
                break;
        }
        return this.#sql;
    }
    
    constructor(config = {}) {
        config = Object.assign(
            {

            }, // config
            {
                type: 'sql'
            },
            config // passed in config
        );
        
        var fields = Object.keys(config);
        fields.forEach(field => this[field] = config[field]);
    }
}

module.exports = Fragment;