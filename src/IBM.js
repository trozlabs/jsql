const { EventEmitter } = require('events');

class IBM extends EventEmitter {
    
    static defaults = {
        connection: null
    };

    logging = true;

    #self;
    #config;
    #cache = {
        // results: null,
    };

    constructor(config = {}) {
        super();
        
        this.#self = this.constructor;
        config = Object.assign({}, this.config, config, {
            options: Object.assign({}, this.#self.defaults.options, (config.options || {}))
        });

        this.#log(config);
        this.#config = config;
        this.#self = this.constructor;
        this.#cache = new Map();
    }

    #log = function() {
        const args = Array.from(arguments);
        if (this.logging) console.log('JSQL: IBM:', this.database, ...args);
        return args;
    }

    error(error) {
        this.emit('error', this, this.#log(error));
        return error;
    }

    async query(sql, model = [], params = [], useCache = true) {

        try {
            if (useCache && this.#cache.has('results')) {
                return this.#cache.get('results', results);
            }
            // const { eradaniConnect, machineName, username, password, options, odbc } = this.#config;
            const connection = new eradaniConnect.transports.Odbc(odbc, options);
            const request = new this.#config.connection.run.Sql(sql, { params: model });
            if (!this.#config.connection) throw new Error('Connection not defined');
            // const request = new this.#config.connection.run.Sql(sql, { params: model });
            const results = await this.#config.connection.execute(request, params);
            
            if (useCache) {
                this.#cache.set('results', results);
            }
            return results;
        } catch (e) {
            this.#log(e, sql, model, params);
            throw e;
        }
    }
}

module.exports = IBM;
