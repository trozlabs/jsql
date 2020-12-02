const { PLACEHOLDER, OPERATOR } = require('../constants');
const Fragment = require('./Fragment');
const Util = require('../Util');
const EOL = '\n';
const SPACE = ' ';
const TAB = SPACE + SPACE + SPACE + SPACE; // fancy code
const COMMA = ',';

class Builder {
    static PLACEHOLDER = PLACEHOLDER;
    static OPERATOR    = OPERATOR;

    static IBMMODEL  = 'IBMMODEL';
    static IBMPARAMS = 'IBMPARAMS';
    static ARRAY     = 'ARRAY';
    static OBJECT    = 'OBJECT';

    static SQL       = 'sql';
    static CLAUSE    = 'cluase';
    static TABLE     = 'table';
    static COLUMN    = 'column';

    static ASC  = 'ASC';
    static DESC = 'DESC';
    
    config = {
        defaults: {
            database: undefined,
            table: undefined
        }
    };

    // wip
    last = {
        statement: undefined,
        clause: undefined
    };

    #statementType = 'custom';
    #index = 0;
    #currentClause = '';
    #fragments = [];
    #statement = [];
    #params = [];
    #delimeter = {
        custom           : SPACE,
        select           : COMMA + SPACE,
        insert           : SPACE,
        update           : SPACE,
        delete           : SPACE,
        set              : COMMA,
        into             : SPACE,
        values           : COMMA + SPACE,
        from             : COMMA + SPACE,
        join             : SPACE,
        right_join       : SPACE,
        right_outer_join : SPACE,
        right_inner_join : SPACE,
        left_join        : SPACE,
        left_outer_join  : SPACE,
        left_inner_join  : SPACE,
        on               : SPACE + 'AND' + SPACE,
        where            : SPACE + 'AND' + SPACE,
        group_by         : COMMA + SPACE,
        order_by         : COMMA + SPACE,
        limit            : SPACE,
        offset           : SPACE,
        with             : SPACE
    };
    #clause = {
        none             : '',
        pre              : '',
        select           : 'SELECT',
        insert           : 'INSERT INTO',
        into             : 'INSERT INTO',
        values           : '',
        update           : 'UPDATE',
        set              : 'SET',
        delete           : 'DELETE FROM',
        from             : 'FROM',
        join             : '',
        right_join       : '',
        right_outer_join : '',
        right_inner_join : '',
        left_join        : '',
        left_outer_join  : '',
        left_inner_join  : '',
        on               : 'ON',
        and              : 'AND',
        where            : 'WHERE',
        group_by         : 'GROUP BY',
        order_by         : 'ORDER BY',
        limit            : 'LIMIT',
        offset           : 'OFFSET',
        with             : 'WITH'
    };
    #steps = {
        // new solution. just add each clause to know the build steps.
        custom: [],
        // keeping these for now but deprecated.
        select: ['select','from','join','where','group_by','order_by','limit','offset','with'],
        totals: ['select','from','join','where','group_by','order_by','with'],
        update: ['update','set','where','limit','with'],
        insert: ['insert','into','values','with'],
        delete: ['delete','from','where','limit']
    };

    constructor(config = {}) {
        this.config = Object.assign(this.config, config);
        this.#statementType = this.config.statementType || 'custom';

        if (this.config.pre) {
            // this.track({ statement: 'select', clause: 'pre' });
            this.add({
                type: 'sql',
                clause: 'pre',
                sql: this.config.pre
            });
        }
    }

    track({ clause, statement, fragment } = {}) {
        
        if (clause) {
            this.#currentClause = clause;
            this.last.clause = clause;
            if (this.#steps.custom[this.#steps.custom.length-1] != clause) {
                this.#steps.custom.push(clause);
            }
        }
        if (statement) {
            this.last.statement = statement;
        }
        if (fragment) {
            this.last.fragment = fragment;
        }
        
        return this.last;
    }

    select() {
        this.track({ statement: 'select', clause: 'select' });

        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    update() {
        this.track({ statement: 'update', clause: 'update' });

        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    insert() {
        this.track({ statement: 'insert', clause: 'insert' });

        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    delete() {
        this.track({ statement: 'delete', clause: 'delete' });

        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }

    from() {
        this.track({ clause: 'from' });
        
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    into() {
        this.track({ clause: 'into' });

        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    set() {
        this.track({ clause: 'set' });

        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    on() {
        this.track({ clause: 'on' });
    
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }

    values() {
        this.track({ clause: 'values' });

        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    /**
     * @param {string} [direction] LEFT, RIGHT, undefined
     * @returns {Builder} this
     */    
    join(direction = '') {
        this.direction = Util.upper(direction);
        this.track({ clause: 'join' });
        return this;
    }

    where() {
        this.track({ clause: 'where' });
        
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);

        return this;
    }

    group() {
        this.track({ clause: 'group_by' });

        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        
        return this;
    }

    /**
     * @param {string} schema
     * @param {string} direction 
     */
    order() {
        this.track({ clause: 'order_by' });

        if (arguments.length) {
            var options = {};
            if (arguments.length === 1) {
                if (this.type(arguments[0], 'object')) {
                    return this.add(arguments[0]);
                } else {
                    return this.add({ column: arguments[0] });
                }
            } else if (arguments.length === 2) {
                options.column = arguments[0],
                options.direction = arguments[1]
            } else if (arguments.length === 3) {
                options.table = arguments[0],
                options.column = arguments[1],
                options.direction = arguments[2]
            } else if (arguments.length === 4) {
                options.database = arguments[0],
                options.table = arguments[1],
                options.column = arguments[2],
                options.direction = arguments[3]
            }
            this.add(options);
        }

        return this;
    }

    /**
     * @param {number} limit
     */
    limit(limit) {
        this.track({ clause: 'limit' });
        
        return this.add({ column: 'limit', column: 'LIMIT', values: limit });
    }

    /**
     * @param {number} offset
     */
    offset(offset) {
        this.track({ clause: 'offset' });
        return this.add({ type: 'clause', column: 'OFFSET', values: offset });
    }

    /**
     * @param {number} page
     * @param {number} limit
     */
    page(page, limit) {
        this.limit(limit);
        this.offset(limit * (page - 1));
        
        return this;
    }

    /**
     * RR - Repeatable Read
     * RS - Read Stability
     * CS - Cursor Stability
     * UR - Uncommitted Read
     * NONE - Uncommitted Read
     */
    with(level) {
        this.track({ clause: 'with' });
        Util.check(level, ['RR', 'RS','CS','UR','NONE']);
        return this.add({ type: 'clause', sql: level });
    }

    and() {
        var { clause } = this.track();
        this.raw({ clause, type: Builder.SQL, sql: 'AND' });
        return this;
    }

    /**
     * ```
     * .from()
     *  .table(sql)
     *  .table(table)
     *  .table(table, alias)
     *  .table(database, table, alias)
     *  .table({ 
     *      database, 
     *      table, 
     *      alias 
     *  })
     * 
     * .join()
     *  .table(table, column, ontable, oncolumn)
     *  .table(table, column, operator, ontable, oncolumn)
     *  .table(database, table, column, operator, ondatabase, ontable, oncolumn)
     *  .table({
     *      direction,
     *      database,
     *      table,
     *      column,
     *      operator,
     *      ondatabase,
     *      ontable,
     *      oncolumn
     *  })
     * 
     * .update()
     *  .table(sql)
     *  .table(table, values)
     *  .table(table, values)
     * ```
     */
    table() {
        var length = arguments.length;
        var { clause } = this.track();
        var fragmentType = Builder.TABLE;
        var statementType = this.#statementType;
        var options = {
            statementType,
            clause,
            type: fragmentType,
            database: this.config.defaults.database,
            table: this.config.defaults.table
        };

        if (this.type(arguments[0], 'object')) {
            options = Object.assign(options, arguments[0]);
            
            return this.add(options);
        }

        // FROM:
        if (clause.endsWith('from')) {
            let argIdx = 0;
            
            if (length == argIdx++) {
                console.warn('SQL.Builder [WARNING]: no arguments for from().table()');
            }

            if (length == argIdx++) {
                let idx = 0;
                options.table    = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.database = arguments[idx++];
                options.table    = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.database = arguments[idx++];
                options.table    = arguments[idx++];
                options.alias    = arguments[idx++];
            }

            if (length > argIdx) {
                console.warn('SQL.Builder [WARNING]: too many arguments for from().table');
            }
        }
        
        // JOINS:
        if (clause.endsWith('join')) {
            let argIdx = 0;
            options.direction = this.direction;
            if (length == argIdx++) {
                console.warn('SQL.Builder [WARNING]: missing arguments');
            }

            // 1
            if (length == argIdx++) {
                let idx = 0;
                options.sql = arguments[idx++];
            }
            // 2
            if (length == argIdx++) {
                console.warn('SQL.Builder [WARNING]: missing arguments');
            }
            // 3
            if (length == argIdx++) {
                console.warn('SQL.Builder [WARNING]: missing arguments');
            }
            // 4
            if (length == argIdx++) {
                let idx = 0;
                options.direction  = this.direction;
                
                options.table      = arguments[idx++];
                options.column     = arguments[idx++];
                
                options.operator   = '=';

                options.ontable    = arguments[idx++];
                options.oncolumn   = arguments[idx++];
            }
            // 5
            if (length == argIdx++) {
                let idx = 0;
                options.direction  = this.direction;
                
                options.table      = arguments[idx++];
                options.column     = arguments[idx++];
                
                options.operator   = arguments[idx++];
                
                options.ontable    = arguments[idx++];
                options.oncolumn   = arguments[idx++];
            }
            // 6
            if (length == argIdx++) {
                let idx = 0;
                options.direction  = this.direction;

                options.database   = arguments[idx++];
                options.table      = arguments[idx++];
                options.column     = arguments[idx++];
                
                options.operator   = '=';

                options.ondatabase = arguments[idx++];
                options.ontable    = arguments[idx++];
                options.oncolumn   = arguments[idx++];
            }
            // 7
            if (length == argIdx++) {
                let idx = 0;
                options.direction  = this.direction;
                
                options.database   = arguments[idx++];
                options.table      = arguments[idx++];
                options.column     = arguments[idx++];
                
                options.operator   = arguments[idx++];
                
                options.ondatabase = arguments[idx++];
                options.ontable    = arguments[idx++];
                options.oncolumn   = arguments[idx++];
            }

            if (length > argIdx) {
                console.warn('SQL.Builder [WARNING]: too many arguments for join().table');
            }
        }
        
        // UPDATE:
        if (statementType.endsWith('update') || clause.endsWith('update') || clause.endsWith('set')) {
            let argIdx = 0;
            
            if (length == argIdx++) {
                console.warn('SQL.Builder [WARNING]: missing arguments');        
            }
            // 1
            if (length == argIdx++) {
                let idx = 0;
                options.table = arguments[idx++];
            }
            // 2
            if (length == argIdx++) {
                let idx = 0;
                options.database = arguments[idx++];
                options.table    = arguments[idx++];
            }

            if (length > argIdx) {
                console.warn('SQL.Builder [WARNING]: too many arguments for update().table()');
            }
        }
        
        // INSERT:
        if (statementType.endsWith('insert') || clause.endsWith('into')) {
            let argIdx = 0;
            
            if (length == argIdx++) {
                console.warn('SQL.Builder [WARNING]: missing arguments');        
            }
            // 1
            if (length == argIdx++) {
                let idx = 0;
                options.table = arguments[idx++];
            }
            // 2
            if (length == argIdx++) {
                let idx = 0;
                options.database = arguments[idx++];
                options.table = arguments[idx++];
            }
            
            if (length > argIdx) {
                console.warn('SQL.Builder [WARNING]: too many arguments for update.table')
            }
        }
        
        // DELETE:
        if (statementType.endsWith('delete') || clause.endsWith('delete')) {
            let argIdx = 0;
            
            if (length == argIdx++) {
                console.warn('SQL.Builder [WARNING]: missing arguments');        
            }
            // 1
            if (length == argIdx++) {
                let idx = 0;
                options.table    = arguments[idx++];
            }
            // 2
            if (length == argIdx++) {
                let idx = 0;
                options.database = arguments[idx++];
                options.table    = arguments[idx++];
            }

            if (length > argIdx) {
                console.warn('SQL.Builder [WARNING]: too many arguments for update.table')
            }
        }

        return this.add(options);
    }
    
    column() {
        var length = arguments.length;
        var clause = this.#currentClause;
        if (!clause || clause == 'pre') this.select();

        var fragmentType = Builder.COLUMN;
        var statementType = this.#statementType;
        var argsIsOptions = length === 1 && this.type(arguments[0], 'object');
        var options = {
            statementType,
            clause,
            type: fragmentType,
            database: this.config.defaults.database,
            table: this.config.defaults.table
        };

        if (argsIsOptions) {
            options = Object.assign(options, arguments[0]);
            return this.add(arguments[0]);
        }

        // SELECT
        if (clause === 'select') {
            let argIdx = 0;

            if (length == argIdx++) {
                console.warn('SQL.Builder [WARNING]: No arguments');
            }
            if (length == argIdx++) {
                let idx = 0;
                options.column = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.database = this.config.defaults.database;
                options.table   = arguments[idx++];
                options.column  = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.database = this.config.defaults.database;
                options.table    = arguments[idx++];
                options.column   = arguments[idx++];
                options.alias    = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.database  = arguments[idx++];
                options.table     = arguments[idx++];
                options.column    = arguments[idx++];
                options.alias     = arguments[idx++];
            }
            if (length > argIdx) {
                console.warn('SQL.Builder [WARNING]: too many arguments for select.column');
            }
        }

        // WHERE
        if (clause === 'where') {
            let argIdx = 0;
            
            if (length == argIdx++) {
                console.warn('SQL.Builder [WARNING]: No arguments');
            }
            if (length == argIdx++) {
                let idx = 0;
                options.sql = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.column   = arguments[idx++];
                options.operator = '=';
                options.values   = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.column   = arguments[idx++];
                options.operator = arguments[idx++];
                options.values   = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.table    = arguments[idx++];
                options.column   = arguments[idx++];
                options.operator = arguments[idx++];
                options.values   = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.database = arguments[idx++];
                options.table    = arguments[idx++];
                options.column   = arguments[idx++];
                options.operator = arguments[idx++];
                options.values   = arguments[idx++];
            }
            if (length > argIdx) {
                console.warn('SQL.Builder [WARNING]: too many arguments for where.column');
            }
        }
        
        // JOIN TABLE ON COLUMN
        if (clause === 'join' || clause === 'on') {
            let argIdx = 0;

            if (length == argIdx++) {
                console.warn('SQL.Builder [WARNING]: No arguments');
            }
            if (length == argIdx++) {
                let idx = 0;
                options.sql = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.table    = arguments[idx++];
                options.column   = arguments[idx++];   
            }
            if (length == argIdx++) {
                let idx = 0;
                options.table       = arguments[idx++];
                options.column      = arguments[idx++];
                options.operator    = '=';
                options.placeholder = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.table    = arguments[idx++];
                options.column   = arguments[idx++];
                options.operator = '=';
                options.ontable  = arguments[idx++];
                options.oncolumn = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.table    = arguments[idx++];
                options.column   = arguments[idx++];
                options.operator = arguments[idx++];
                options.ontable  = arguments[idx++];
                options.oncolumn = arguments[idx++];
            }
            if (length > argIdx) {
                console.warn('SQL.Builder [WARNING]: too many arguments for on.column');
            }
        }

        // INSERT
        if (clause === 'insert' || clause === 'into' || clause === 'values') {
            let argIdx = 0;
            
            if (length == argIdx++) {
                console.warn('SQL.Builder [WARNING]: No arguments');
            }
            if (length == argIdx++) {
                let idx = 0;
                options.sql     = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.column  = arguments[idx++];
                options.values  = arguments[idx++];
            }

            if (length > argIdx) console.warn('SQL.Builder [WARNING]: too many arguments for values().column()');
        }

        // UPDATE
        if (clause === 'update' || clause === 'set') {
            let argIdx = 0;
            
            if (length == argIdx++) {
                console.warn('SQL.Builder [WARNING]: No arguments');
            }
            if (length == argIdx++) {
                let idx = 0;
                options.sql = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.column   = arguments[idx++];
                options.values   = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.column   = arguments[idx++];
                options.values   = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.database = arguments[idx++];
                options.table    = arguments[idx++];
                options.column   = arguments[idx++];
                options.values   = arguments[idx++];
            }

            if (length > argIdx) console.warn('SQL.Builder [WARNING]: too many arguments for order.column');
        }

        // GROUP BY
        if (clause === 'group_by') {
            let argIdx = 0;
            
            if (length == argIdx++) {
                console.warn('SQL.Builder [WARNING]: No arguments');
            }
            if (length == argIdx++) {
                let idx = 0;
                options.column = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.table  = arguments[idx++];
                options.column = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.database = arguments[idx++];
                options.table    = arguments[idx++];
                options.column   = arguments[idx++];
            }

            if (length > argIdx) console.warn('SQL.Builder [WARNING]: too many arguments for group.column');
        }

        // ORDER BY
        if (clause === 'order_by') {
            let argIdx = 0;
            
            if (length == argIdx++) {
                console.warn('SQL.Builder [WARNING]: need a column and direction');
            }
            if (length == argIdx++) {
                let idx = 0;
                options.column      = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.column      = arguments[idx++];
                options.direction   = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.table       = arguments[idx++];
                options.column      = arguments[idx++];
                options.direction   = arguments[idx++];
            }
            if (length == argIdx++) {
                let idx = 0;
                options.database    = arguments[idx++];
                options.table       = arguments[idx++];
                options.column      = arguments[idx++];
                options.direction   = arguments[idx++];
            }

            if (length > argIdx) console.warn('SQL.Builder [WARNING]: too many arguments for order.column')
        }

        return this.add(options);
    }

    raw(sql) {
        var length = arguments.length;
        var clause = this.#currentClause;
        var fragmentType = Builder.SQL;
        var statementType = this.#statementType;

        if (!clause) this.track({ clause: 'pre', fragment: fragmentType });
        
        var options = {
            statementType,
            clause,
            sql,
        };
        return this.add(options);
    }
    
    add(options) {
        if (!this.type(options, 'object')) {
            console.warn('Error: invalid options:', options);
            throw new Error('add only accepts an options object but received: ', options);
        }

        var {
            clause,
            statementType,
            type,
            sql,
            database,
            table,
            column,
            alias,
            operator,
            placeholder,
            values,
            direction,
            onsql,
            ondatabase,
            ontable,
            oncolumn,
            
            items,
            columns,
            tables
        } = options;
        
        if (columns) {
            (Array.isArray(columns) ? columns : [ columns ]).forEach(options => this.add(options));
            return this;
        }
        if (tables) {
            (Array.isArray(tables) ? tables : [ tables ]).forEach(options => this.add(options));
            return this;
        }
        if (items) {
            (Array.isArray(items) ? items : [ items ]).forEach(options => this.add(options));
            return this;
        }
        type = type || 'sql';
        clause = clause || this.#currentClause;

        var index = this.#index++;
        var direction = direction || this.direction;

        options = {
            index,
            statementType,
            clause,
            type, 
            sql,
            database, 
            table, 
            column, 
            alias,
            operator, 
            placeholder, 
            direction,
            onsql, 
            ondatabase, 
            ontable,
            oncolumn,
            values
        };

        var fragment = new Fragment(options);

        this.#fragments.push(fragment);
        this.direction = undefined;

        return this;
    }
    
    type(obj, type) {
        var result;

        if (type !== undefined) {
            if (Array.isArray(obj)) {
                result = obj.filter(item => typeof(item) === type).length === obj.length;
            } else {
                result = (typeof(obj) === type);
            }
        } else {
            result = (typeof obj);
        }

        return result;
    }
    
    paramsAllowed(clause) {
        
        switch (clause) {
            case 'set':
            case 'where':
            case 'values':
            case 'limit':
            case 'offset':
                return true;
            default:
                return false;
        }
    }

    build(type) {

        const delimeter     = this.#delimeter;
        const statementType = this.#statementType;
        const steps         = ['pre', ...this.#steps[type || statementType]];
        const statement     = [];
        const parameters    = [];
        
        for (let step of steps) {
            const fragments = this.#fragments.filter(fragment => fragment.clause.endsWith(step));
            const statementClause = [];
            var sql;

            /**
             * Special handling of insert statements due to ...( A, B, C ) VALUES ( ?, ?, ? )
             */
            if (step === 'values') {
                const columns = [];
                const placeholders = [];

                fragments.forEach((fragment, index, fragments) => {

                    if (this.paramsAllowed(fragment.clause)) {

                        if (!fragment.values || !fragment.values.length) return;

                        fragment.values.forEach((value) => {
    
                            parameters.push({
                                id: fragment.id,
                                name: fragment.name,
                                index: parameters.length,
                                values: value
                            });
                        });
                    }

                    columns.push(fragment.column);
                    placeholders.push('?');
                });

                if (!columns.length) continue;

                sql = `( ${columns.join(delimeter[step])} ) VALUES ( ${placeholders.join(delimeter[step])} )`;
                
                statementClause.push(sql);
            } 
            else {
                if ((type && type.startsWith('total')) && step === 'select') {
                
                    statementClause.push('COUNT(*) AS TOTALS');
                
                } else {
                    fragments.forEach((fragment, index, fragments) => {
                    
                        if (this.paramsAllowed(fragment.clause)) {
    
                            if (fragment.values === undefined || !fragment.values.length) return;
    
                            fragment.values.forEach((value) => {
        
                                parameters.push({
                                    id: fragment.id,
                                    name: fragment.name,
                                    index: parameters.length,
                                    values: value
                                });
                            });
                        }
                        statementClause.push(fragment.sql);
                    });
                }
                if (!statementClause.length) {
                    continue;
                }
            }

            if (type && type.startsWith('total')) {
                switch (step) {
                    case 'group_by': continue;
                    default: break;
                }
            }

            statement.push(`${this.#clause[step]} ${statementClause.join(delimeter[step])}`);
        }

        this.#statement = statement;
        this.#params = parameters;

        return this;
    }
    
    params(returnType) {
        
        if (returnType == Builder.IBMMODEL) {
            let params = [];
            for (let param in this.#params) {
                params.push({ name: param });
            }
            return params;
        }
        
        else if (returnType == Builder.IBMPARAMS) {
            let params = {};
            for (let param in this.#params) {
                params[param] = this.#params[param].values;
            }
            return params;
        }
        
        else if (returnType == Builder.ARRAY) {
            let params = [];
            for (let param in this.#params) {
                // console.log(this.#params[param].values);
                params.push(this.#params[param].values);
            }
            return params;
        }
        
        else if (returnType == Builder.OBJECT) {
            return this.#params;
        }

        return this.#params;
    }

    sql(format) {
        
        if (!this.#statement.length) this.build();
        var statement = this.#statement.join(SPACE);
        if (format) {
            statement = statement.replace('SELECT',      EOL + 'SELECT' + EOL + TAB);
            statement = statement.replace(' UPDATE ',    EOL + 'UPDATE' + EOL + TAB);
            statement = statement.replace(' SET ',       EOL + 'SET' + EOL + TAB);
            statement = statement.replace('INSERT INTO', EOL + 'INSERT INTO' + EOL + TAB);
            statement = statement.replace(' DELETE ',    EOL + 'DELETE');
            statement = statement.replace(' FROM ',      EOL + 'FROM ');
            statement = statement.replace(' WHERE ',     EOL + 'WHERE ' + EOL + TAB);
            statement = statement.replace(' ORDER BY ',  EOL + 'ORDER BY' + EOL + TAB);
            statement = statement.replace(' GROUP BY ',  EOL + 'GROUP BY' + EOL + TAB);
            statement = statement.replace(' LIMIT ',     EOL + 'LIMIT ');
            statement = statement.replace(' OFFSET ',    EOL + 'OFFSET ');
            statement = statement.split(' LEFT JOIN ')  .join(EOL + 'LEFT JOIN ');
            statement = statement.split(' RIGHT JOIN ') .join(EOL + 'RIGHT JOIN ');
            statement = statement.split('  JOIN ')      .join(EOL + 'JOIN ');
            statement = statement.split('FROM ')        .join('FROM' + EOL + TAB);
            statement = statement.split(' ON ')         .join(EOL + TAB + 'ON ');
            statement = statement.split(') VALUES (')   .join(EOL + ') VALUES (' + EOL + TAB);
            statement = statement.split(',')            .join(',' + EOL + TAB);
            statement = statement.split(' AND ')        .join(EOL + TAB + 'AND ');
            statement = statement.split(' WITH ')       .join(EOL + 'WITH ');
        }
        return statement;
    }

    /**
     * @param {Boolean} format output formatted sql statement.
     * @returns {void}
     */
    log(format, paramsStyle) {
        if (process.env.NODE_ENV === 'production') return;

        const sqlStmt = this.sql(format);
        const sqlParams = this.params(paramsStyle);

        console.log('\nSQL    :==========================================================\n');
        console.log(sqlStmt);
        
        console.log('\nPARAMS :==========================================================\n');
        console.log('\nDEFAULT   :', this.params('OBJECT'));
        console.log('\nARRAY     :', this.params('ARRAY'));
        console.log('\nIBMPARAMS :', this.params('IBMPARAMS'));
        console.log('\nIBMMODEL  :', this.params('IBMMODEL'));
        console.log('\n==================================================================\n');
        
        return this;
    }
}

module.exports = Builder;


