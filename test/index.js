const { Where } = require('../src/index');

// const where = new Where({ format: false })
//     .column('ID').is(100)
//     .column('NAME').is('Snickers').is('Mars')
//     .column('DESC').is('Candy Bar').and().not('')
//     .column('CREATED_AT').gte('1993-01-01')
//     .column('UPDATED_AT').lte('2019-11-10')
//     .column('TEST_MISSING_VAL').is().and().not('not-this-value')
//     .column('TEST_MISSING_VAL').between()
//     .column('TEST_MISSING_VAL').lte()
//     .page(3)
// .build()

where = new Where({ format: true })
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
    .build() // .sql() // will run the bu

console.log(`
-------------------------------------

SELECT 
    ID,
    NAME,
    DESC
FROM 
    TABLE_1 
${where.sql()}

-------------------------------------
params: ${JSON.stringify(where.params, null, 4)}

`);


where = new Where({ format: true })
    .column('ID').is()
    .column('NAME').between()
    .column('DESC').like()

console.log(`
-------------------------------------

SELECT 
    ID,
    NAME,
    DESC
FROM 
    TABLE_1 
${where.sql()}

-------------------------------------
params: ${JSON.stringify(where.params)}

`);

