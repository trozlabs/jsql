const util = require('util');
const { EventEmitter } = require('events');
const mysql = require('mysql');

class MySQL extends EventEmitter {
    
    static defaults = {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: '',
        connectionLimit : 10,
    }

    logging = true;
    
    host;
    port;
    user;
    password;
    database;

    #self;
    #config;
    
    #pool;
    #connection;

    #cache = {
        // client: null,
        // db: null,
        // db.table.name: null,
        // results: null,
    };

    constructor(config = {}) {
        super();
        
        this.#self = this.constructor;

        config = Object.assign({}, this.#self.defaults, config);
        
        this.#log(config);
        
        try {
            if (!mysql) mysql = require('mysql');
        } catch (e){
            console.error('mysql required. `npm i --save mysql`', e);
            throw e;
        }

        this.#config = config;
        this.#self = this.constructor;
        this.#cache = new Map();
        
        this.host = config.host;
        this.port = config.port;
        this.user = config.user;
        this.password = config.password;
        this.database = config.database;

        this.#pool = mysql.createPool(config);
        this.#connection = null;
    }

    #log = function() {
        const args = Array.from(arguments);
        if (this.logging) console.log('DATABASE:', this.database, ...args);
        return args;
    }

    error(error) {
        this.emit('error', this, this.#log(error));
        return error;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.#pool.getConnection((error, connection) => {
                if (error) return reject(error);
                this.emit('connection', this, connection);
                return resolve(connection);
            });
        })
    }

    async release() {
        try {
            const connection = this.cache('connection');
            if (!connection) return;
            connection.release();
            this.#log('connection released to pool');
            return true;
        } catch (e) {
            throw this.error(e)
        } finally {
            this.emit('close', this);
        }
    }

    async query(sql, params = []) {
        // this.#log(`${this.constructor.name}.query()`, sql, params);

        const connection = await this.connect();
        
        if (typeof sql !== 'string') {
            sql = await sql;
        }

        return new Promise((resolve, reject) => {
            connection.query(sql, params, (error, records, fields) => {
                if (error) {
                    this.#log(sql, ...params);
                    return reject(error);
                }
                return resolve({ records, fields });
            });
        });
    }
}

module.exports = MySQL;
