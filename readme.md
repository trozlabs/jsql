#

**This is a rough draft.**

SQL Helper Utility to handle IBM related syntax differences. 


```javascript
const { Where } = require('jsql');

new Where()
    .column('T1.ID').gt(1234)
    .column('T1.COLUMN_A').like('something')
    .column('T2.COLUMN_B').endsWith('ing')
    .column('T2.COLUMN_C').between(1, 20)
    .page(1, 200)
    .build()

```