const config = require('./config');
const { SQL, MySQL } = require('../src');
const db = new MySQL(config.mysql);
var params = [];

// const sqlfile = new SQL.File(__dirname + '/some.sql').file();
// console.log(sqlfile.getSql());

// .params(params).run().then(res => {
//     console.log(res);
// }).catch(err => {
//     console.error(err);
// });

// new SQL.Builder()
//     .select()
//         .column('id')
//         .column('name')
//         .column('desc')
//     .from()
//         .table('table')
//     .where()
//         .column('name', 'like', 'something')
//         .column('desc', 'like', null)
//     .page(1, 25)
//     .log('format')
// ;

// new SQL.Builder({
//         defaults: {
//             database: 'DACCONF',
//             table: 'ITEMMAST'
//         }
//     })
//     .select()
//         .column('column_a')
//         .column('column_b')
//         .column('column_c')
//         .column('itembal',    'column_d')
//         .column('itemextend', 'column_e')
//         .column('column_f')
//         .column('column_g')
//         .column('column_h')
//         .column('itemextend', 'column_i', 'ext_i')
//         .column('itemextend', 'column_j', 'ext_j')
//         .column('column_k')
//     .from()
//         .table('itemmast')
//     .join()
//         .table({
//             table: 'table', 
//             column: 'column', 
//             placeholder: '(select max(id) from table)'
//         })
//     .join()
//         .table({
//             table: 'table', 
//             column: 'column',
//             ondatabase: 'alt_db',
//             ontable: 'table',
//             oncolumn: 'column' 
//         })
//     .join('right')
//         .table('db','table','column','=','db','table','column')
//     .join('left')
//         .table('db','table','column','=','db','table','column')
//     .where()
//         .column('column_a', '=', 'a')
//         .column('column_b', '=', 'b')
//         .column('column_c', '=', 'c')
//         .column('itembal','column_d', '=', null)
//         .column('itemextend','column_e', '=', 'e')
//     .log('format')
// ;


// new SQL.Builder()
//     .select()
//         .column('a')
//         .column('table', 'b')
//         .column('table', 'c', 'c_alias')
//         .column('db', 'table', 'd', 'd_alias')
//         .column('(select max(some_col) from some_table) as e_alias')
//     .from()
//         .table('db', 'table', 'table_alias')
//     .where()
//         .column('d', null)
//         .column('id', '=', 111)
//     .log('format')
// ;

// new SQL.Builder()
//     .update()
//         .table('db', 'table')
//     .set()
//         .column('a', 1)
//         .column('b', 2)
//         .column('c', 3)
//         .column('d', null)
//         .column('e', 5)
//     .where()
//         .column('id', '=', 111)
//     .limit(1)
//     .log('format')
// ;

// new SQL.Builder()
//     .insert().into()
//         .table('db', 'table')
//     .values()
//         .column('a', 1)
//         .column('b', 2)
//         .column('c', 3)
//         .column('d', null)
//         .column('e', 5)
//     .log()
// ;

// new SQL.Builder()
//     .delete()
//         .table('db', 'table')
//     .where()
//         .column('id', '=', 1)
//     .limit(1)
//     .log('format')
// ;

// // db.query(stmt.sql(), stmt.params(SQL.Builder.ARRAY)).then((res) => {
// //     console.log(res.records)
// // }).catch(console.error);

