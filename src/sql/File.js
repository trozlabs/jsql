const fs = require('fs');

class File {
    #db;
    #path;
    #sql = '';
    #params = [];
    #results = [];
    #paramsCount = 0;

    constructor(config = { db, path, params }) {
        if (typeof config === 'string') {
            this.#path = config;
        } else {
            this.#db     = config.db     || null;
            this.#path   = config.path   || null;
            this.#params = config.params || [];
        }
        return this;
    }

    async file(path) {
        if (this.#sql) return this.#sql;
        path = path || this.#path;
        
        this.#sql = await fs.readFileSync(path, 'utf8');
        const matches = this.#sql.match(/\?/g);
        console.log(matches)
        this.#paramsCount = matches && matches.length || 0;

        return this.#sql;
    }

    async run() {
        this.#sql = await this.file(this.#path);
        if (this.#params && this.#params.length !== this.#paramsCount) {
            throw new Error(`'${this.#path}' file contains ${this.#paramsCount} '?' placeholder(s) and only recieved ${params.length} parameter(s).`);
        }
        this.#results = await this.#db.query(this.#sql, this.#params);
        return this.#results;
    }

    params(params = []) {
        this.#params = params;
        return this;
    }

    getSql() {
        return this.#sql;
    }

    getParams() {
        return this.#params;
    }

    getResults() {
        return this.#results;
    }
}

module.exports = File;