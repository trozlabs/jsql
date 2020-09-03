const { PLACEHOLDER, OPERATOR } = require('../constants');
const Fragment = require('./Fragment');

class Builder {
    static PLACEHOLDER = PLACEHOLDER;
    static OPERATOR    = OPERATOR;

    static IBMMODEL  = 'IBMMODEL';
    static IBMPARAMS = 'IBMPARAMS';
    static ARRAY     = 'ARRAY';
    static OBJECT    = 'OBJECT';
    
    static CLAUSE    = 'cluase';
    static TABLE     = 'table';
    static COLUMN    = 'column';

    #statementType = 'none';
    #index = 0;
    #currentClause = '';
    #fragments = [];
    #statement = [];
    #params = [];
    #fragmentType = {
        CLAUSE: 'clause',
        TABLE: 'table',
        COLUMN: 'column',
    };
    #delimeter = {
        select           : ',\n\t' ,
        insert           : '\t' ,
        update           : '\t' ,
        delete           : ''      ,
        set              : ',\t' ,
        into             : ' ' ,
        values           : ', ' ,
        from             : ',\n',
        join             : ' \n',
        right_join       : ' \n',
        right_outer_join : ' \n',
        right_inner_join : ' \n',
        left_join        : ' \n',
        left_outer_join  : ' \n',
        left_inner_join  : ' \n',
        where            : ' AND ',
        group_by         : ', ',
        order_by         : ', ',
        limit            : ' ',
        offset           : ' ',
    };
    #clause = {
        select           : 'SELECT     \n\t',
        insert           : 'INSERT INTO\t',
        into             : 'INSERT INTO\t',
        values           : '           \t',
        update           : 'UPDATE     \t',
        set              : 'SET        \t',
        delete           : 'DELETE FROM\t',
        from             : 'FROM       \t',
        join             : '',
        right_join       : '',
        right_outer_join : '',
        right_inner_join : '',
        left_join        : '',
        left_outer_join  : '',
        left_inner_join  : '',
        where            : 'WHERE   \n\t',
        group_by         : 'GROUP BY\t',
        order_by         : 'ORDER BY\t',
        limit            : 'LIMIT   \t',
        offset           : 'OFFSET  \t',
    };
    #steps = {
        none  : ['update','set','values','select','from','join','where','group_by','order_by','limit','offset'],
        select: ['select','from','join','where','group_by','order_by','limit','offset'],
        update: ['update','set','where','limit'],
        insert: ['insert','into','values'],
        delete: ['delete','from','where','limit']
    };

    select() {
        this.#statementType = 'select';
        this.#currentClause = 'select';
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    update() {
        this.#statementType = 'update';
        this.#currentClause = 'update';
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    insert() {
        this.#statementType = 'insert';
        this.#currentClause = 'insert';
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    delete() {
        this.#statementType = 'delete';
        this.#currentClause = 'delete';
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    from() {
        this.#currentClause = 'from';
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    into() {
        this.#currentClause = 'into';
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    set() {
        this.#currentClause = 'set';
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    values() {
        this.#currentClause = 'values';
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    join() {
        this.#currentClause = 'join';
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    left() {
        this.#currentClause = 'left_join';
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    right() {
        this.#currentClause = 'right_join';
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    where() {
        this.#currentClause = 'where';
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    group() {
        this.#currentClause = 'group_by';
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    order() {
        this.#currentClause = 'order_by';
        if (this.type(arguments[0], 'string')) this.raw(arguments[0]);
        return this;
    }
    limit(limit) {
        this.#currentClause = 'limit';
        return this.add({ column: 'limit', column: 'LIMIT', values: limit });
    }
    offset(offset) {
        this.#currentClause = 'offset';
        return this.add({ type: 'clause', column: 'OFFSET', values: offset });
    }
    page(page, limit) {
        this.limit(limit);
        this.offset(limit * (page - 1));
        return this;
    }

    table() {
        var options = this.options(arguments, this.#fragmentType.TABLE);
        var clause = options.clause;
        
        // FROM:
        if (clause === 'from') {

            if (arguments.length == 1) {
                options.table = arguments[0];
            }

            if (arguments.length == 2) {
                options.table = arguments[0];
                options.alias = arguments[1];
            }

            if (arguments.length > 2) {
                console.warn('too many arguments for from().table')
            }
        }
        
        // JOINS:
        if (clause.endsWith('join')) {
            var direction = clause.toUpperCase().split('_')[0];
        
            if (arguments.length == 1) {
                options.table = arguments[0];
            }

            if (arguments.length == 4) {
                options.direction = direction;
                options.table     = arguments[0];
                options.column    = arguments[1];
                options.operator  = '=';
                options.ontable   = arguments[2];
                options.oncolumn  = arguments[3];
            }

            if (arguments.length == 5) {
                options.direction = direction;
                options.table     = arguments[0];
                options.column    = arguments[1];
                options.operator  = arguments[2];
                options.ontable   = arguments[3];
                options.oncolumn  = arguments[4];
            }

            if (arguments.length > 5) {
                console.warn('too many arguments for join().table')
            }
        }
        
        // UPDATE:
        if (clause.endsWith('update')) {
            
            if (arguments.length == 1) {
                options.table = arguments[0];
            }
            
            if (arguments.length == 2) {
                options.table    = arguments[0];
                options.operator = '=';
                options.alias    = arguments[1];
            }
            
            if (arguments.length == 3) {
                options.table  = arguments[0];
                options.column = arguments[1];
                options.operator = '=';
                options.values = arguments[2];
            }

            if (arguments.length > 3) {
                console.warn('too many arguments for update.table')
            }
        }
        
        // INSERT:
        if (clause.endsWith('into')) {
            
            if (arguments.length == 1) {
                options.table = arguments[0];
            }

            if (arguments.length > 1) {
                console.warn('too many arguments for update.table')
            }
        }

        // console.log(options)
        return this.add(options);
    }
    
    column() {
        var options = this.options(arguments, this.#fragmentType.COLUMN);
        var clause = options.clause;

        // SELECT
        if (clause === 'select') {
            
            if (arguments.length == 1) {
                options.column = arguments[0];
            }

            if (arguments.length == 2) {
                options.column = arguments[0];
                options.alias  = arguments[1];
            }

            if (arguments.length == 3) {
                options.table  = arguments[0];
                options.column = arguments[1];
                options.alias  = arguments[2];
            }

            if (arguments.length > 3) {
                console.warn('too many arguments for select.column')
            }
        }

        // WHERE
        if (clause === 'where') {

            if (arguments.length == 1) {
                options.column = arguments[0];
            }

            if (arguments.length == 2) {
                options.column = arguments[0];
                options.values = arguments[1];
            }

            if (arguments.length == 3) {
                options.column   = arguments[0];
                options.operator = arguments[1];
                options.values   = arguments[2];
            }

            if (arguments.length == 4) {
                options.table    = arguments[0];
                options.column   = arguments[1];
                options.operator = arguments[2];
                options.values   = arguments[3];
            }

            if (arguments.length > 4) {
                console.warn('too many arguments for where.column')
            }
        }
        
        // INSERT
        if (clause === 'values') {
            if (arguments.length == 1) {
                options.sql    = arguments[0];
            }
            if (arguments.length == 2) {
                options.column = arguments[0];
                options.values = arguments[1];
            }
            if (arguments.length > 2) {
                console.warn('too many arguments for values().column()');
            }
        }

        // UPDATE
        if (clause === 'set') {
            
            if (arguments.length == 1) {
                options.sql = arguments[0];
            }

            if (arguments.length == 2) {
                options.column   = arguments[0];
                options.operator = '=';
                options.values   = arguments[1];
            }
            
            if (arguments.length == 3) {
                options.table    = arguments[0];
                options.column   = arguments[1];
                options.operator = '=';
                options.values   = arguments[2];
            }

            if (arguments.length > 3) {
                console.warn('too many arguments for order.column')
            }
        }

        // GROUP BY
        if (clause === 'group_by') {
            
            if (arguments.length == 1) {
                options.column = arguments[0];
            }

            if (arguments.length > 1) {
                console.warn('too many arguments for group.column')
            }
        }

        // ORDER BY
        if (clause === 'order_by') {
            
            if (arguments.length == 1) {
                options.column = arguments[0];
            }

            if (arguments.length == 2) {
                options.column    = arguments[0];
                options.direction = arguments[1];
            }

            if (arguments.length > 2) {
                console.warn('too many arguments for order.column')
            }
        }
        
        return this.add(options);
    }
    
    options(args, type) {
        var args = Array.from(args);
        var length = args.length;
        var isOptions = (this.type(args[0], 'object') && length == 1);
        var isSql = (this.type(args[0], 'string') && length == 1);
        var sql = isSql ? args[0] : undefined;
        var options = isOptions ? args[0] : { };

        options = Object.assign({
            statement: type,
            clause: this.#currentClause,
            sql: sql
        }, options);
        // console.log(options);
        return options;
    }

    raw(sql) {
        return this.add({ sql });
    }

    add(options) {
        
        if (!this.type(options, 'object')) {
            console.log('Error: invalid options:', options);
            throw new Error('add only accepts an options object but received: ', options);
        }

        var {
            clause, // the part of the query this belongs to
            type, // the type
            sql,                                                    // string
            table, column, alias, operator, placeholder,            // strings
            values,                                                 // object
            ontable, oncolumn, direction,                           // string
            columns, tables                                         // arrays
        } = options;
        
        // when options contains a columns array recursively call add.
        if (columns) {
            (Array.isArray(columns) ? columns : [ columns ]).forEach(options => this.add(options));
            return this;
        }
        // when options contains a tables array recursively call add.
        if (tables) {
            (Array.isArray(tables) ? tables : [ tables ]).forEach(options => this.add(options));
            return this;
        }

        clause = clause || this.#currentClause;

        var index = this.#index++;

        options = {
            type, clause,
            index,
            sql, table, column, alias, operator, direction, placeholder, 
            ontable, oncolumn, 
            values 
        };

        var fragment = new Fragment(options);

        this.#fragments.push(fragment);

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
            case 'order_by':
                return true;
            case 'order_by':
            case 'select':
            case 'update':
            case 'insert':
            case 'into':
            default:
                return false;
        }
    }

    build() {
        const delimeter     = this.#delimeter;
        const statementType = this.#statementType || 'none';
        const steps         = this.#steps[statementType];
        const statement     = [];
        const parameters    = [];
        
        for (let step of steps) {
        
            const fragments = this.#fragments.filter(fragment => (fragment.clause.endsWith(step)));
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
                
            } else {

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
                    statementClause.push(fragment.sql);
                });

                if (!statementClause.length) continue;
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
                console.log(this.#params[param].values);
                params.push(this.#params[param].values);
            }
            return params;
        }
        
        else if (returnType == Builder.OBJECT) {
            return this.#params;
        }

        return this.#params;
    }
    
    sql() {
        if (!this.#statement.length) this.build();
        return this.#statement.join('\n');
    }
}

module.exports = Builder;


