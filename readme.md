#

**This is a rough draft.**

SQL Helper Utility to handle IBM related syntax differences. 

## Features

- Params that are undefined will be excluded from query.
- Append to it at any point and get updated sql.
- Pagination.


## Example:

### Select

```js
const { SQL, IBM, MySQL } = require('jsql');
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
```

    SELECT     	 DISTINCT, (select id from some_table ) as ID, A AS A1, B AS B1, C AS C1, D AS D1
    FROM       	 TABLE_ONE AS T1
    JOIN    	 TABLE_JOIN ON TABLE_JOIN.ID = TABLE_ONE.ID 
    RIGHT JOIN    	 TABLE_RIGHT ON TABLE_RIGHT.ID > TABLE_ONE.ID 
    LEFT JOIN    	 TABLE_LEFT ON TABLE_LEFT.ID = TABLE_ONE.ID
    WHERE   	 ID = ? AND A = ? AND B = ? AND D = ?
    GROUP BY	 A, B
    ORDER BY	 C DESC, D DESC
    LIMIT   	 ?
    OFFSET  	 ?

    [
        { name: '0' },
        { name: '1' },
        { name: '2' },
        { name: '3' },
        { name: '4' },
        { name: '5' }
    ]
    { '0': 123, '1': 'a val', '2': 'b val', '3': 'd val', '4': 10, '5': 0 }

### Update

```js
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
```

    UPDATE     	 TABLE_ONE
    SET        	 A = ?,	B = ?,	D = ?
    WHERE   	 ID = ?
    LIMIT   	 ?


    [
        { id: 'set-A-1', name: 'A', index: 0, values: 'a val' },
        { id: 'set-B-2', name: 'B', index: 1, values: 'b val' },
        { id: 'set-D-4', name: 'D', index: 2, values: 'd val' },
        { id: 'where-ID-5', name: 'ID', index: 3, values: 123 },
        { id: 'limit-LIMIT-6', name: 'LIMIT', index: 4, values: 1 }
    ]

### Insert

```js
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
```

    INSERT INTO	 TABLE_ONE
                ( A, B, D ) VALUES ( ?, ?, ? )
    [
        { id: 'values-A-1', name: 'A', index: 0, values: 'a val' },
        { id: 'values-B-2', name: 'B', index: 1, values: 'b val' },
        { id: 'values-D-4', name: 'D', index: 2, values: 'd val' }
    ]


### Delete

```js
stmt = new SQL.Builder()
    .delete()
        .table('TABLE_ONE')
    .where()
        .column('ID', '=', 1234)

console.log(stmt.sql())
console.log(stmt.params(
```

    DELETE FROM	 TABLE_ONE
    WHERE   	 ID = ?
    
    [ 
        { id: 'where-ID-1', name: 'ID', index: 0, values: 1234 } 
    ]

