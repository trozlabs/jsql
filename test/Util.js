const Util = require('../src/Util');

// Util.parameters
// Util.strip
// Util.redact
// Util.check
// Util.contains
// Util.isSame
// Util.toBoolean
// Util.isFloat
// Util.isDate

/**
 * Value passed in must match one of the values 
 * passed into second param.
 */
console.log('\ncheck:     \n', Util.check('B', [ 'A', 'B', 'C' ]))

console.log('\ncontains:  \n', Util.contains('GrannyApple', 'Apple'))

console.log('\nisSame:    \n', Util.isSame('AAaaAa', 'aAAaaA'));

console.log('\ntoBoolean: \n', Util.toBoolean('Y'));

console.log('\ntoBoolean: \n', Util.toBoolean('n'));

console.log('\nnumberMask:\n', Util.isFloat(1));

console.log('\nnumberMask:\n', Util.isFloat(2.1));

console.log('\nnumberMask:\n', Util.isDate('2020-01-01'));

console.log('\nparameters:\n', Util.parameters({ one: '1', two: 2, three: 3 }, { ONE: '', TWO: '', Three: '' }));

console.log('\nparameters:\n', Util.parameters({ one: '1', two: 2, three: 3, four: undefined, five: 5 }, [ 'ONE', 'TWO', 'Three', 'four' ]));

console.log('\nredact:    \n', Util.redact({ password: 'Pa$$word', two: 2, three: 3 }));

console.log('\nredact:    \n', Util.redact({ password: 'Pa$$word', two: 2, three: 3 }, [ 'two', 'three' ]));

console.log('\nstrip:     \n', Util.strip(`
    SELECT 
        DB.T1.A AS A,
        DB.T1.A AS B
    FROM 
        DB.T1 AS T1
    WHERE
        DB.T1.A   = ?
    GROUP BY 
        A
    ORDER BY 
        A DESC
    LIMIT  ?
    OFFSET ?
`));
