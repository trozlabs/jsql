  // .select()
    //     .column('ITEMNUM',    )
    //     .column('CATNUM',     )
    //     .column('UM1LENGTH',  )
    //     .column('UM2LENGTH',  )
    //     .column('UM3LENGTH',  )
    //     .column('UM4LENGTH',  )
    //     .column('UM1WIDTH',   )
    //     .column('UM2WIDTH',   )
    //     .column('UM3WIDTH',   )
    //     .column('UM4WIDTH',   )
    //     .column('UM1HEIGT',   )
    //     .column('UM2HEIGT',   )
    //     .column('UM3HEIGT',   )
    //     .column('UM4HEIGT',   )
    //     .column('SLSCLASS',   )
    //     .column('PRDCLASS',   )
    //     .column('TAXCLASS',   )
    //     .column('PRODHEAD',   )
    //     .column('VENDORID',   )
    //     .column('PRODSEQ',    )
    //     .column('ITEMDESC',   )
    //     .column('MFRPARTID',  )
    //     .column('UM1DESC',    )
    //     .column('UM2DESC',    )
    //     .column('UM3DESC',    )
    //     .column('UM4DESC',    )
    //     .column('UPC1',       )
    //     .column('UPC2',       )
    //     .column('UPC3',       )
    //     .column('UPC4',       )
    //     .column('QMULT1',     )
    //     .column('QMULT2',     )
    //     .column('QMULT3',     )
    //     .column('QMULT4',     )
    //     .column('RTLPACKDSC', )
    //     .column('CATCHWGT',   )
    //     .column('UM1WEIGHT',  )
    //     .column('UM2WEIGHT',  )
    //     .column('UM3WEIGHT',  )
    //     .column('UM4WEIGHT',  )
    //     .column('MFRSUGRETL', )
    //     .column('ITEMSTATUS', )
    //     .column('ORIGDATE',   )
    //     .column('CONSUMUNIT', )
    // .from('ItemMast')

// id: {
//     database    : 'dacconf',
//     table       : 'itemmast',
//     name        : 'id',
//     alias       : 'item_id',
//     operator    : '=',
//     placeholder : '?',
//     value       : '05'
// },
// desc: {
//     database    : 'dacconf',
//     table       : 'itemmast',
//     name        : 'desc',
//     alias       : 'item_desc',
//     operator    : '=',
//     placeholder : '?',
//     value       : 'This is an Item'
// }


#name    = null; // the last field name added.
    
#columns = {

};
#fields = {

};

#from    = '';
#limit   =  0;
#offset  =  0;

constructor(options) {
    this.#self = this.constructor;

    return this;
}


select(...columns) {
    // columns.forEach(column => {
    //     const { name, }
    //     this.#fields[column] = Object.assign({ 
    //         column.name, 
    //         alias 
    //     })
    // });
    return this;
}

column(name, props = {}) {
    return this.set(name, props);
}

from(name) {
    this.#from = name;
    return this;
}

where() {
    return this;
}

get(name) {
    return this.#fields[name];
}

set(name, props = {}) {
    
    var field = this.get(name);
    var type  = this.type((field && (field.value || field.default)));

    this.#name = name;
    this.#fields[name] = Object.assign({ name, type }, props);
    
    return this;
}

field(name, props) {
    this.#name = name;

    return this.set(name, props);
}

and(name) {
    if (name) this.#name = name;

    return this.field(this.#name);
}

is(value) {
    return this.set(this.#name, {
        operator: OPERATOR.EQ,
        placeholder: PLACEHOLDER.EQ,
        value: value
    });
}

isNot(value) {
    return this.set(this.#name, { 
        operator: OPERATOR.LTGT, 
        value: value
    });
}

like(value) {
    return this.set(this.#name, {
        operator: OPERATOR.LIKE,
        placeholder: PLACEHOLDER.LIKE,
        value: value
    });
}

startsWith(value) {
    return this.set(this.#name, {
        operator: OPERATOR.LIKE,
        placeholder: PLACEHOLDER.STARTSWITH,
        value: value,
    });
}

endsWith(value) {
    return this.set(this.#name, { 
        operator: OPERATOR.LIKE,
        placeholder: PLACEHOLDER.ENDSWITH,
        value: value,
    });
}

in(...values) {
    var placeholders = Array(values.length).fill('?').join(', ');
    return this.set(this.#name, {
        operator: OPERATOR.IN,
        placeholder: PLACEHOLDER.IN,
        value: values,
    });
}

gt(value) {
    return this.set(this.#name, {
        operator: OPERATOR.GT,
        placeholder: PLACEHOLDER.GT,
        value: value,
    });
}

gte(value) {
    return this.set(this.#name, {
        operator: OPERATOR.GTEQ,
        placeholder: PLACEHOLDER.GTEQ,
        value: value,
    });
}

lt(value) {
    return this.set(this.#name, {
        operator: OPERATOR.LT,
        placeholder: PLACEHOLDER.LT,
        value: value,
    });
}

lte(value) {
    return this.set(this.#name, {
        operator: OPERATOR.LTEQ,
        placeholder: PLACEHOLDER.LTEQ,
        value: value,
    });
}

between(start, end) {
    return this.set(this.#name, {
        operator: OPERATOR.BETWEEN,
        placeholder: PLACEHOLDER.BETWEEN,
        value: [ start, end ],
    });
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
    this.#limit = limit;
    this.#offset = limit * page;
    return this;
}

type(value) {
    return Object.prototype.toString.call(value).match(/^\[object\s(.*)\]$/)[1];
}

build(pretty = false) {
    this.params.splice();

    const br         = pretty ? '\n\t' : ' ';
    const conditions = [];
    const params     = [];
    
    Object.values(this.#fields).forEach(field => {
        params.push({ name: field.name });
        conditions.push(`${field.name} ${field.operator} ${field.placeholder}`);
    });

    const where  = '\t' + conditions.join(`\n\tAND `)
    const limit  = this.#limit;
    const offset = this.#offset;

    this.query  = `WHERE\n${where}\nLIMIT\t${limit}\nOFFSET\t${offset}`;
    this.params = params;

    return this;
}

getParams() {
    return this.params;
}
}

function eradaniConnect(sql, options) {
const params = Array.isArray(options) ? options : (options && options.params || []);

console.log(sql, params);

const eradaniConnect = require('@eradani-inc/eradani-connect');
const transport = new eradaniConnect.transports.Xml('*LOCAL', 'TEST', 'eradani', {
    host: 'localhost',
    port: 57700,
    path: '/cgi-bin/xmlcgi.pgm',
    debug: false,
    usePOST: true
});
const sqlModel = new eradaniConnect.run.Sql(sql, { params });
}

sql = new SQL()
.field('ITEM_ID').is(12345)
.field('ITEM_DESC').like('snickers')
.field('PRDCLASS').lt(10).and().gt(20)
.page(1, 10)

sql.build(true);
var { query, params } = sql;
//.field('vendor_name').startsWith('s').and().endsWith('e')
console.log('\n')
console.log('PARAMS:', params);
console.log('\n')
console.log(`SELECT\t*\nFROM\tDACCONF.ITEMMAST\n${query}`);
console.log('\n')

// .select()
//     .column('ITEMNUM',    )
//     .column('CATNUM',     )
//     .column('UM1LENGTH',  )
//     .column('UM2LENGTH',  )
//     .column('UM3LENGTH',  )
//     .column('UM4LENGTH',  )
//     .column('UM1WIDTH',   )
//     .column('UM2WIDTH',   )
//     .column('UM3WIDTH',   )
//     .column('UM4WIDTH',   )
//     .column('UM1HEIGT',   )
//     .column('UM2HEIGT',   )
//     .column('UM3HEIGT',   )
//     .column('UM4HEIGT',   )
//     .column('SLSCLASS',   )
//     .column('PRDCLASS',   )
//     .column('TAXCLASS',   )
//     .column('PRODHEAD',   )
//     .column('VENDORID',   )
//     .column('PRODSEQ',    )
//     .column('ITEMDESC',   )
//     .column('MFRPARTID',  )
//     .column('UM1DESC',    )
//     .column('UM2DESC',    )
//     .column('UM3DESC',    )
//     .column('UM4DESC',    )
//     .column('UPC1',       )
//     .column('UPC2',       )
//     .column('UPC3',       )
//     .column('UPC4',       )
//     .column('QMULT1',     )
//     .column('QMULT2',     )
//     .column('QMULT3',     )
//     .column('QMULT4',     )
//     .column('RTLPACKDSC', )
//     .column('CATCHWGT',   )
//     .column('UM1WEIGHT',  )
//     .column('UM2WEIGHT',  )
//     .column('UM3WEIGHT',  )
//     .column('UM4WEIGHT',  )
//     .column('MFRSUGRETL', )
//     .column('ITEMSTATUS', )
//     .column('ORIGDATE',   )
//     .column('CONSUMUNIT', )
// .from('ItemMast')

// id: {
//     database    : 'dacconf',
//     table       : 'itemmast',
//     name        : 'id',
//     alias       : 'item_id',
//     operator    : '=',
//     placeholder : '?',
//     value       : '05'
// },
// desc: {
//     database    : 'dacconf',
//     table       : 'itemmast',
//     name        : 'desc',
//     alias       : 'item_desc',
//     operator    : '=',
//     placeholder : '?',
//     value       : 'This is an Item'
// }







// console.log(new Query().build());

























const PLACEHOLDER = {
    EQ          : `?`,
    LT          : `?`,
    LTEQ        : `?`,
    GT          : '?',
    GTEQ        : '?',
    NOT         : '?',
    LIKE        : `'%' || ? || '%'`,
    STARTS_WITH : `'%' || ?`,
    ENDS_WITH   : `? || '%'`,
    BETWEEN     : `? AND ?`,
};

const OPERATOR = {
    EQ          : '=',
    GT          : '>', 
    GTEQ        : '>=', 
    LT          : '<',
    LTEQ        : '<=',
    LTGT        : '<>',
    LIKE        : 'LIKE',
    IN          : 'IN',
    BETWEEN     : 'BETWEEN',
    NOT         : 'NOT'
};

class SQL {
    #self;

    params = [];
    query  = '';

    #name = null; // the last field name added.

    // #columns = {};
    #fields  = {};
    #from    = '';
    #limit   =  0;
    #offset  =  0;

    filters  = new Map();


    constructor(options) {
        this.#self = this.constructor;
        
        return this;
    }

    from(name) {
        this.#from = name;
        return this;
    }

    where() {
        return this;
    }

    get(name) {
        return this.#fields[name];
    }

    set(name, props = {}) {
        console.log(name,':', props)

        var exists = this.filters.has(name);
        var column = exists ? this.filters.get(name) : new Filter(name, props);

        Object.assign(column, props)
        console.log(column)
        this.filters.set(name, column);
        
        return this;
    }
    
    field(name, props) {
        this.#name = name;
        return this.set(name, props);
    }

    and(name, props) {
        if (name !== this.#name) {
            return this.field(this.#name);
        }
        return this;
    }

    is(value) {
        return this.set(this.#name, {
            operator: OPERATOR.EQ,
            placeholder: PLACEHOLDER.EQ,
            value: value
        });
    }

    isNot(value) {
        return this.set(this.#name, { 
            operator: OPERATOR.LTGT, 
            value: value
        });
    }

    like(value) {
        return this.set(this.#name, {
            operator: OPERATOR.LIKE,
            placeholder: PLACEHOLDER.LIKE,
            value: value
        });
    }

    startsWith(value) {
        return this.set(this.#name, {
            operator: OPERATOR.LIKE,
            placeholder: PLACEHOLDER.STARTSWITH,
            value: value,
        });
    }

    endsWith(value) {
        return this.set(this.#name, { 
            operator: OPERATOR.LIKE,
            placeholder: PLACEHOLDER.ENDSWITH,
            value: value,
        });
    }

    in(...values) {
        var placeholders = Array(values.length).fill('?').join(', ');
        return this.set(this.#name, {
            operator: OPERATOR.IN,
            placeholder: `(${placeholders})`,
            value: values,
        });
    }

    gt(value) {
        return this.set(this.#name, {
            operator: OPERATOR.GT,
            placeholder: PLACEHOLDER.GT,
            value: value,
        });
    }

    gte(value) {
        return this.set(this.#name, {
            operator: OPERATOR.GTEQ,
            placeholder: PLACEHOLDER.GTEQ,
            value: value,
        });
    }

    lt(value) {
        return this.set(this.#name, {
            operator: OPERATOR.LT,
            placeholder: PLACEHOLDER.LT,
            value: value,
        });
    }

    lte(value) {
        return this.set(this.#name, {
            operator: OPERATOR.LTEQ,
            placeholder: PLACEHOLDER.LTEQ,
            value: value,
        });
    }

    between(start, end) {
        return this.set(this.#name, {
            operator: OPERATOR.BETWEEN,
            placeholder: PLACEHOLDER.BETWEEN,
            value: [ start, end ],
        });
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
        this.#limit = limit;
        this.#offset = limit * page;
        return this;
    }

    type(value) {
        return Object.prototype.toString.call(value).match(/^\[object\s(.*)\]$/)[1];
    }

    build(pretty = false) {
        this.params.splice();

        const br         = pretty ? '\n\t' : ' ';
        const conditions = [];
        const params     = [];
        
        // Object.values(this.filters).forEach(field => {
        this.filters.forEach(field => {
            params.push({ name: field.name });
            conditions.push(`${field.name} ${field.operator} ${field.placeholder}`);
        });

        const where  = '\t' + conditions.join(`\n\tAND `)
        const limit  = this.#limit;
        const offset = this.#offset;

        this.query  = `WHERE\n${where}\nLIMIT\t${limit}\nOFFSET\t${offset}`;
        this.params = params;

        return this;
    }

    getParams() {
        return this.params;
    }
}



class Clause {

    database = '';
    table    = '';
    alias    = '';
    
    #name;
    
    get name () {
        return this.#name;
    }
    set name (val) {
        this.#name = val;
    }

    constructor(name, options = {}) {
        const opts = (this.type(name) === 'Object') ? name : Object.assign({ name }, options);
        Object.assign(this, opts);
        // console.log(this);
    }

    type(obj) {
        return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
    }
}

class Filter extends Clause {
    column = null;
    operator = '=';
    placeholder = '?';
    value = null;
}

class Column extends Clause {

    filters = [];

    add(filter) {
        filter = Object.assign({ column: this.name }, filter);
        this.filters.push(filter);
        return this;
    }
}

class Where extends Clause {
    statement = '';
    params = [];
    
    currentColumn = null;
    columns = new Map();
    
    #limit = 10;
    #offset = 0;

    column(name, opts = {}) {
        const options = (this.type(name) === 'Object') ? name : Object.assign({ name }, opts);
        
        console.log(options)
        
        this.currentColumn = this.columns.has(options.name) ? this.columns.get(options.name) : new Column(options);
        // this.currentColumn = Object.assign(this.currentColumn, options, { name });
        this.columns.set(name, this.currentColumn);
        return this;
    }

    and() {
        this.currentColumn.filters.push('AND');
        return this;
    }

    or() {
        this.currentColumn.filters.push('OR');
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
            placeholder: PLACEHOLDER.STARTSWITH,
            value: value,
        });
        return this;
    }

    endsWith(value) {
        this.currentColumn.add({ 
            operator: OPERATOR.LIKE,
            placeholder: PLACEHOLDER.ENDSWITH,
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
        var EOL = `/*EOL*/`;
        var TAB = `\t`;
        
        this.columns.forEach(column => {
            // console.log(column)
            const filters = []; 
            column.filters.forEach(filter => {
                // if (this.type(filter) === 'String') return EOL = filter;
                if (this.type(filter.value) === 'Undefined') return;
                params.push({ [filter.column]: filter.value });
                filters.push(`${filter.column} ${filter.operator} ${filter.placeholder}`);
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
}

// const string = clause.join(` AND `);
// sql = new SQL()
//     .field('ITEMNUM').gte(12345)
//     // .field('ITEM_DESC').in('snickers', 'hershey')
//     .field('PRDCLASS').gt(20)
//     .and('PRDCLASS').lt(20)
//     // .field('PRDCLASS')
//     //     .between(10, 20)
    
//     .page(1, 10)

// sql.build(true);

// var { query, params } = sql;

// console.log('\n')
// console.log(sql)
// console.log('\n')
// console.log('PARAMS:', params);
// console.log('\n')
// console.log(`SELECT\t*\nFROM\tDACCONF.ITEMMAST\n${query}`);
// console.log('\n')

class Column {
    database; table; column; alias;
    name;
    operator = OPERATOR.EQ;
    placeholder = PLACEHOLDER.EQ;
    defaultValue = '';
    value;
    type;

    constructor (config) {
        Object.assign(this, {
            database: config.database || '',
            table: config.table,
            column: config.name,
            alias: config.name,
        }, config);
        console.log(this);
    }
    
    param(mode) {
        return {
            name       : this.name,
            [this.name]: this.value
        }
    }

    toString(mode) {
        if (mode == 'SELECT') return `${this.table}.${this.column} as ${this.alias}`;
        if (mode == 'SET') return `${this.table}.${this.column} = ?`;
        if (mode == 'WHERE') return `${this.table}.${this.column} ${this.operator} ${this.value}`;
    }
};


class Query {
    mode = 'SELECT';
    
    columns = [
        new Column({ database: 'DACCONF', table: 'ItemMast', name: 'ITEM_NUM', alias: 'ID', value: '10001' }),
        new Column({ database: 'DACCONF', table: 'ItemMast', name: 'ITEM_DESC', alias: 'DESCRIPTION', value: 'The Description' })
    ];
    selects = [];
    from    = [];
    where   = [];
    params  = [];

    build() {

        this.columns.forEach(column => {
            this.selects.push(column.toString(this.mode));
            this.where  .push(column.toString('WHERE'));
            this.params .push(column.param(this.mode));
        });

        console.log('SELECT\n\t' + this.selects.join(',\n\t'));
        console.log('WHERE\n\t' + this.where.join('\nAND '));
        console.log(this.params);

        // {
        //     const { database, table, name, alias, value };
        //     return `${table}.${column} as ${alias}`;
        // })
    }
}

