const { EventEmitter } = require('events');

class IBM extends EventEmitter {
    
    static defaults = {
        connection: null,
        eradaniConnect: {},
        machineName: '*LOCAL',
        username: 'TEST', 
        password: 'eradani', 
        options: {
            host: 'localhost',
            port: 57700,
            path: '/cgi-bin/xmlcgi.pgm', 
            debug: true,
            usePOST: true
        }
    }

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

        // this.#log(config);
        
        // try {
        //     if (!config.eradaniConnect) config.eradaniConnect = require('@eradani-inc/eradani-connect');
        // } catch (e){
        //     console.error('mysql required. `npm i eradani-connect`', e);
        //     throw e;
        // }

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
            const { eradaniConnect, machineName, username, password, options, odbc } = this.#config;
            const connection = new eradaniConnect.transports.Odbc(odbc, options);
            const request = new eradaniConnect.run.Sql(sql, { params: model });
            const results = await connection.execute(request, params);
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
