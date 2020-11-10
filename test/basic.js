const { SQL, IBM, MySQL } = require('../src');
const { format } = require('mysql');
var stmt;
var query = {
    id: 123,
    a: 'a val',
    b: 'b val',
    c: undefined,
    d: 'd val',
    page: 1,
    limit: 25
}

console.log('\n=========================================================================\n');

// stmt = new SQL.Builder()
//     .select('DISTINCT')
//         .raw('(select id from some_table ) as ID')
//         .column('A', 'A1')
//         .column('B', 'B1')
//         .column('C', 'C1')
//         .column('D', 'D1')
//     .from()
//         .table('TABLE_ONE', 'T1')
//     .join()
//         .table('TABLE_JOIN', 'ID','TABLE_ONE', 'ID')
//     .right()
//         .table('TABLE_RIGHT', 'ID', '>', 'TABLE_ONE', 'ID')
//     .left()
//         .table('TABLE_LEFT', 'ID', '=', 'TABLE_ONE', 'ID')
//     .where()
//         .column('ID', '=', 123)
//         .column('A', '=', query.a)
//         .column('B', '=', query.b)
//         .column('C', '=', query.c)
//         .column('D', '=', query.d)
//     .group()
//         .column('A')
//         .column('B')
//     .order()
//         .column('C', 'DESC')
//         .column('D', 'DESC')
//     .page(1, 10)


// console.log(stmt.sql());
// console.log(stmt.params(SQL.Builder.IBMMODEL));
// console.log(stmt.params(SQL.Builder.IBMPARAMS));
// console.log('\n=========================================================================\n');

// stmt = new SQL.Builder()
//     .update()
//         .table('TABLE_ONE')
//         .set()
//             .column('A', query.a)
//             .column('B', query.b)
//             .column('C', query.c)
//             .column('D', query.d)
//     .where()
//         .column('ID', '=', query.id)
//     .limit(1)

// console.log(stmt.sql())
// console.log(stmt.params());
// console.log('\n=========================================================================\n');

// stmt = new SQL.Builder()
//     .insert()
//         .table('TABLE_ONE')
//     .values()
//         .column('A', query.a)
//         .column('B', query.b)
//         .column('C', query.c)
//         .column('D', query.d)

// console.log(stmt.sql());
// console.log(stmt.params());
// console.log('\n=========================================================================\n');

// stmt = new SQL.Builder()
//     .delete()
//         .table('TABLE_ONE')
//     .where()
//         .column('ID', '=', 1234)

// console.log(stmt.sql())
// console.log(stmt.params());
// console.log('\n=========================================================================\n');

// stmt = new SQL.Builder()
//     .select(`
//         id as chart_id,
//         chart_week,
//         chart_year,
//         creation_date,
//         close_date,
//         freeze,
//         migrated,
//         freeze
//     `)
//     .from('( select * from chart_dates where freeze = 1 ) as frozen_chart_dates ')
//     // to show what happens if both exist
//     .order('chart_year DESC, chart_week DESC')
//         .column('chart_year', 'desc')
//         .column('chart_week', 'desc')
//     .limit(1)
// ;

// console.log(stmt.sql())
// console.log(stmt.params());
// console.log('\n=========================================================================\n');

stmt = new SQL.Builder({ 
        pre: `---------------------------`,
        statementType: 'select',
        clause: 'select'
    })
    .select()
        .column('id', 'chart_id')
        .column('chart_week')
        // .raw('DO SOMETHING RIGHT HERE..............')
        // .column('chart_year')
        // .column('creation_date')
        // .column('close_date')
        // .column('freeze')
        // .column('migrated')
        // .column('freeze')
    .from()
        .table('chart_dates', 'chart_dates_alias')
        // .join()
        //     .table('table_2', 'chart_id', '=', 'chart_dates', 'id')
        // .where()
        //     .column('chart_id', '=', 'SomeID')
    .order()
        .column('chart_year', 'desc')
        .column('chart_week', 'desc')
    .page(1, 1)
    .build('totals')
    .log('format')
    .build()
    .log('format')
;

// console.log(stmt.build('totals').sql())
// console.log(stmt.params());
// console.log('\n=========================================================================\n');

// stmt = new SQL.Builder()
//     .select('*')
//     .from('DACCONF.ITEMMAST')
//     .where()
//         .column('ITEMNUM', '=', 108300)
//         .column('ITEMNUM', 'IN', [ 108300, 108301, 108302, 108303 ])
//         .column('ITEMNUM', 'BETWEEN', [ 108300, 108303 ])
//     .limit(1)
//     .offset(0)
// ;

// console.log(stmt.sql());
// console.log(stmt.params());
// console.log('\n=========================================================================\n');

// const ibm = new IBM({ eradaniConnect: {} });

// stmt = new SQL.Builder()
//     .select('*')
//     .from('DACCONF.ITEMMAST')
//     .where()
//         .column('ITEMNUM', '=', 108300)
//     .limit(1)
//     .offset(0);

// ibm.query(stmt.sql(), stmt.params('ibmModel'), stmt.params('ibmParams')).then(console.log).catch(console.log);

// console.log(stmt.sql());
// console.log('IBMMODEL  :', stmt.params(SQL.Builder.IBMMODEL));
// console.log('IBMPARAMS :', stmt.params(SQL.Builder.IBMPARAMS));
// console.log('ARRAY     :', stmt.params(SQL.Builder.ARRAY));
// console.log('OBJECT    :', stmt.params(SQL.Builder.OBJECT));
// console.log('\n=========================================================================\n');
// console.log('DONE!');
// console.log('\n=========================================================================\n');

new SQL.Builder()
    .select()
        .column('a')
        .column('b', 'b_alias')
        .column('table', 'c', 'c_alias')
        .column('db', 'table', 'd', 'd_alias')
        .column('db.table.e as e_alias')
    .from()
        .table('db', 'table', 'table_alias')
    .where()
        .column('d', null)
        .column('id', '=', 111)
    .log(true)
;

new SQL.Builder()
    .update()
        .table('db', 'table')
        .set()
            .column('a', 1)
            .column('b', 2)
            .column('c', 3)
            .column('d', null)
            .column('e', 5)
        .where()
            .column('id', '=', 111)
        .log(true)
;

new SQL.Builder()
    .insert().into()
        .table('db', 'table')
    .values()
        .column('a', 1)
        .column('b', 2)
        .column('c', 3)
        .column('d', null)
        .column('e', 5)
    .log()
;

new SQL.Builder()
    .delete()
        .table('db', 'table')
    .where()
        .column('id', '=', 111)
    .log(true)
;
