#

**This is a rough draft.**

NodeJS Dynamica SQL Utility to work with IBM DB2, but should work with most out of the box. Support for more DB Server support on it's way.

__FYI: This ReadMe is a work in progress__

## Features

- Select, Insert, Update, Delete.
- Partial query generation. Only want a dynamica WHERE clause? That's cool. 
- Params that are undefined/null will be excluded from query. 
- No counting `?`s. These will be handled for you. 
- Append to it at any point and get updated sql.
- Limit, Offset and Pagination using the `page(page, limit)` method.

## Examples:

### Quick Start 

```bash
npm i https://github.com/trozlabs/jsql
```

```js
const { SQL } = require('jsql');

var builder = new SQL.Builder()
    .select()
        .column('id')
        .column('name')
        .column('desc')
    .from()
        .table('table')
    .where()
        .column('name', 'like', 'something')
        .column('desc', 'like', null)
    .page(1, 25)
    .log('format');

var sql = builder.sql();

var params = builder.params(SQL.Builder.ARRAY); // or
var params = builder.params(SQL.Builder.OBJECT); // or
var model = builder.params(SQL.Builder.IBMMODEL); // or/and
var params = builder.params(SQL.Builder.IBMPARAMS);
```

```sql
SELECT
    id,
    name,
    desc
FROM
    table AS table
WHERE 
    name LIKE CONCAT('%' || ? || '%')
LIMIT ?
OFFSET ?
```
```
DEFAULT   : [
  { id: 'WHERE-NAME-4', name: 'name', index: 0, values: 'something' },
  { id: 'LIMIT-LIMIT-6', name: 'LIMIT', index: 1, values: 25 },
  { id: 'OFFSET-OFFSET-7', name: 'OFFSET', index: 2, values: 0 }
]

ARRAY     : [ 'something', 25, 0 ]

IBMPARAMS : { '0': 'something', '1': 25, '2': 0 }

IBMMODEL  : [ { name: '0' }, { name: '1' }, { name: '2' } ]
```

```js
const { SQL, IBM, MySQL } = require('jsql');
const { format } = require('mysql');
const query = {
    id: 123,
    a: 'a val',
    b: 'b val',
    c: undefined,
    d: 'd val',
    page: 1,
    limit: 25
};
```

### Select

```js
new SQL.Builder()
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
    .log('format')
```
### Update

```js
new SQL.Builder()
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
    .log('format')
```

### Insert

```js
new SQL.Builder()
    .insert()
        .table('TABLE_ONE')
    .values()
        .column('A', query.a)
        .column('B', query.b)
        .column('C', query.c)
        .column('D', query.d)
    .log('format')
```

### Delete

```js
new SQL.Builder()
    .delete()
        .table('TABLE_ONE')
    .where()
        .column('ID', '=', 1234)
    .log('format')
```

## Verbose Options:

```js
new SQL.Builder()
    .select()
        .column({
            database: 'DB1',
            table: 'T1',
            column: 'A',
            alias: 'T1_A'
        })
    .from()
        .table('T1', 'T1_ALIAS')
    .where()
        .column({
            database: 'DB1',
            table: 'T1',
            column: 'A',
            operator: '=',
            placeholder: '?',
            values: 'Value 1'
        })
```

## File

```js
var params = [];

new SQL.File({ path: './some.sql' }).params(params).run().then(res => {
    console.log(res);
}).catch(err => {
    console.error(err);
});
```





