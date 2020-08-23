
class Clause {

    database = '';
    table    = '';
    alias    = '';
    
    #name;
    
    get name () {
        return this.#name;
    }
    set name (val) {
        this.#name = val;
    }

    constructor(name, options = {}) {
        const opts = (this.type(name) === 'Object') 
            ? name 
            : Object.assign({ name }, options);

        Object.assign(this, opts);
    }

    type(obj) {
        return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
    }
}

module.exports = Clause;