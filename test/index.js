const { Where } = require('../src/index');


const select = `
SELECT * 
FROM TABLE_1 T1 
LEFT JOIN TABLE_2 T2 ON 1 = 1 
`;

where = new Where()
    .column('ID').is(100)
    .column('NAME').is('Snickers').or().is('Mars')
    .column('DESC').is('Candy Bar').and().not('')
    .column('CREATED_AT').gte('1993-01-01')
    .column('UPDATED_AT').lte('2019-11-10')
    .column('TEST_MISSING_VAL').is().and().not('not-this-value')
    .column('TEST_MISSING_VAL').between()
    .column('TEST_MISSING_VAL').lte()
    .page(3)
    .build()

console.log('\n--------------------\n');
console.log(where.statement);
console.log('\n--------------------\n');
console.log('params:', where.params);
console.log('\n--------------------\n');




where = new Where()
    .column('T1.COLUMN_A').like('something')
    .column('T2.COLUMN_B').endsWith('ing')
    .page(1, 200)
    .build();

console.log('\n--------------------\n');
console.log(where.statement);
console.log('\n--------------------\n');
console.log('params:', where.params);
console.log('\n--------------------\n');

    



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
