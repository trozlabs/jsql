const { SQL, IBM, MySQL } = require('../src');

var format = true;
var builder;

try {
    builder = new SQL.Builder()
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
        .order()
            .column('COL_A')
            .column('COL_B', 'DESC')
            .column('TABLE_1','COL_C', 'DESC')
            .column('DB', 'T1','COL_D', 'DESC')
        .limit(10)
        .offset(0)
        .with('NONE')
        .log(format)
    ;

    builder.build('totals').log(format).sql();
    builder.build().log(format);

} catch (e) {
    console.error(e);
}

try {
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
        .with('NONE')
        .log(format)
    ;
} catch (e) {
    console.error(e);
}

try {
    new SQL.Builder()
        .insert()
            .into()
                .table('db', 'table')
        .values()
            .column('a', 1)
            .column('b', 2)
            .column('c', 3)
            .column('d', null)
            .column('e', 5)
        .with('NONE')
        .log(format)
    ;
} catch (e) {
    console.error(e);
}

try {
    new SQL.Builder()
        .delete()
            .table('db', 'table')
        .where()
            .column('id', '=', 111)
        .with('NONE')
        .log(format)
    ;
} catch (e) {
    console.error(e);
}
