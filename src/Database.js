const { EventEmitter } = require('events');

class Database extends EventEmitter {
    
    constructor (config = {}) {
        super();
    }
}