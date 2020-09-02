

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

stmt = new SQL.Builder()
    .update()
        .table('TABLE_ONE')
        .set()
            .column('A', query.a)
            .column('B', query.b)
            .column('C', query.c)
            .column('D', query.d)
    .where()
        .column('ID', '=', query.id)
    .limit(1)

console.log(stmt.sql())
console.log(stmt.params());
console.log('\n=========================================================================\n');

stmt = new SQL.Builder()
    .select('DISTINCT')
        .raw('(select id from some_table ) as ID')
        .column('A', 'A1')
        .column('B', 'B1')
        .column('C', 'C1')
        .column('D', 'D1')
    .from()
        .table('TABLE_ONE', 'T1')
    .join()
        .table('TABLE_JOIN', 'ID','TABLE_ONE', 'ID')
    .right()
        .table('TABLE_RIGHT', 'ID', '>', 'TABLE_ONE', 'ID')
    .left()
        .table('TABLE_LEFT', 'ID', '=', 'TABLE_ONE', 'ID')
    .where()
        .column('ID', '=', 123)
        .column('A', '=', query.a)
        .column('B', '=', query.b)
        .column('C', '=', query.c)
        .column('D', '=', query.d)
    .group()
        .column('A')
        .column('B')
    .order()
        .column('C', 'DESC')
        .column('D', 'DESC')
    .page(1, 10)


console.log(stmt.sql());
console.log(stmt.params(SQL.Builder.IBMMODEL));
console.log(stmt.params(SQL.Builder.IBMPARAMS));
console.log('\n=========================================================================\n');

stmt = new SQL.Builder()
    .insert()
        .table('TABLE_ONE')
    .values()
        .column('A', query.a)
        .column('B', query.b)
        .column('C', query.c)
        .column('D', query.d)

console.log(stmt.sql());
console.log(stmt.params());
console.log('\n=========================================================================\n');

stmt = new SQL.Builder()
    .delete()
        .table('TABLE_ONE')
    .where()
        .column('ID', '=', 1234)

console.log(stmt.sql())
console.log(stmt.params());
console.log('\n=========================================================================\n');

stmt = new SQL.Builder()
    .select(`
        id as chart_id,
        chart_week,
        chart_year,
        creation_date,
        close_date,
        freeze,
        migrated,
        freeze
    `)
    .from('( select * from chart_dates where freeze = 1 ) as frozen_chart_dates ')
    // to show what happens if both exist
    .order('chart_year DESC, chart_week DESC')
        .column('chart_year', 'desc')
        .column('chart_week', 'desc')
    .limit(1)
;

console.log(stmt.sql())
console.log(stmt.params());
console.log('\n=========================================================================\n');

stmt = new SQL.Builder()
    .select()
        .column('id', 'chart_id')
        .column('chart_week')
        .column('chart_year')
        .column('creation_date')
        .column('close_date')
        .column('freeze')
        .column('migrated')
        .column('freeze')
    .from()
        .table('chart_dates', 'chart_dates_alias')
    .join()
        .table('table_2', 'chart_id', '=', 'chart_dates', 'id')
    .right()
        .table('right_table', 'chart_id', '=', 'chart_dates', 'id')
    .left()
        .table('left_table', 'chart_id', '=', 'chart_dates', 'id')
    .where()
        .column('chart_id', '=', 'SomeID')
    .order()
        .column('chart_year', 'desc')
        .column('chart_week', 'desc')
    .page(1, 1)
;

console.log(stmt.sql())
console.log(stmt.params());
console.log('\n=========================================================================\n');

stmt = new SQL.Builder()
    .select('*')
    .from('DACCONF.ITEMMAST')
    .where()
        .column('ITEMNUM', '=', 108300)
        .column('ITEMNUM', 'IN', [ 108300, 108301, 108302, 108303 ])
        .column('ITEMNUM', 'BETWEEN', [ 108300, 108303 ])
    .limit(1)
    .offset(0)
;

console.log(stmt.sql());
console.log(stmt.params());
console.log('\n=========================================================================\n');

const ibm = new IBM({ eradaniConnect: {} });

var stmt = new SQL.Builder()
    .select('*')
    .from('DACCONF.ITEMMAST')
    .where()
        .column('ITEMNUM', '=', 108300)
    .limit(1)
    .offset(0);

// ibm.query(stmt.sql(), stmt.params('ibmModel'), stmt.params('ibmParams')).then(console.log).catch(console.log);

console.log(stmt.sql());
console.log('IBMMODEL  :', stmt.params(SQL.Builder.IBMMODEL));
console.log('IBMPARAMS :', stmt.params(SQL.Builder.IBMPARAMS));
console.log('ARRAY     :', stmt.params(SQL.Builder.ARRAY));
console.log('OBJECT    :', stmt.params(SQL.Builder.OBJECT));
console.log('\n=========================================================================\n');
console.log('DONE!');
console.log('\n=========================================================================\n');

