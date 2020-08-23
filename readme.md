#

**This is a rough draft.**

SQL Helper Utility to handle IBM related syntax differences. 

## Features

- Params that are undefined will be excluded from query.
- Append to it at any point and get updated sql.
- Pagination.


### Example:

```javascript

    const { Where } = require('jsql');

    const where = new Where({ format: true })
        .column('ID')
            .is(100)
        .column('NAME')
            .is('Thing').is('Mars')
        .column('DESC')
            .is('Product Desc').and().not('')
        .column('CREATED_AT')
            .gte('1993-01-01')
        .column('UPDATED_AT')
            .lte('2019-11-10')
        .column('TEST_MISSING_VAL')
            .is().and().not('not-this-value')
        .column('TEST_MISSING_VAL')
            .between()
        .column('TEST_MISSING_VAL')
            .lte()
        .page(3) // .page(page, limit)
        .build() // .sql() // will run the build if it has not been built yet and return the SQL string. 
        

    // for now it's byo-select
    const sql = `
        SELECT *
        FROM SOME_TABLE 
        ${where.sql()}`;

```

Output: 

```sql 
    WHERE 
        ( ID = ? )
    AND ( NAME = ? AND NAME = ? )
    AND ( DESC = ? AND DESC <> ? )
    AND ( CREATED_AT >= ? )
    AND ( UPDATED_AT <= ? )
    AND ( TEST_MISSING_VAL <> ? )
    LIMIT  25
    OFFSET 75 
```


## TODO:

- add subquery row number work around as an option for certain versions of DB2 
- full query generation with joins 