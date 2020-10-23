
class Util {

    // White Space
    static EMPTY  = '';
    static SPACE  = ' ';
    static TAB    = '    ';
    static EOL    = '\n';
    static BREAK  = '\n';
    static RETURN = '\r';
    // JS Primitives
    static UNDEFINED = 'Undefined';
    static NULL      = 'Null';
    static DATE      = 'Date';
    static STRING    = 'String';
    static NUMBER    = 'Number';
    static BOOLEAN   = 'Boolean';
    static FUNCTION  = 'Function';
    static OBJECT    = 'Object';
    // JS Extended Types
    static ARRAY     = 'Array';
    static MAP       = 'Map';
    static SET       = 'Set';
    static INTERGER  = 'Integer';
    static FLOAT     = 'Float';
    static BIGINT    = 'BigInt';
    // SQL Types
    static CHAR      = 'CHAR';
    static VARCHAR   = 'VARCHAR';
    static TEXT      = 'TEXT';
    static CLOB      = 'CLOB';
    static BLOB      = 'BLOB';
    static INT       = 'INT';
    static TINYINT   = 'TINYINT';
    static DECIMAL   = 'DECIMAL';
    static LONG      = 'LONG';
    static TIME      = 'TIME';
    static TIMESTAMP = 'TIMESTAMP';
    static DATETIME  = 'DATETIME';
    
    static DEFAULT_PAGE   = 1;
    static DEFAULT_LIMIT  = 25;
    static PAGING_PARAMS = [ 'sort', 'dir', 'limit', 'page' ];

    static forbidden = [ 'not-even-in-code' ];
    static redacted = [ 'password' ];
    static lastfour = [ 'ssn', 'cc', ];

    /**
     * Literal Type Check
     */
    static isBoolean(obj) {
        return obj === true || obj === false;
    }

    static isDate(obj) {
        return obj && obj.constructor && obj.constructor.name === 'Date'; //|| new Date.parse(obj);
    }

    static isNumber(obj) {
        // return !Number.isNaN(Number.parseFloat(obj)) && !Number.isNaN(obj - 0);
    }

    static isInteger(obj) {
        return Number(obj) === obj && obj % 1 === 0;
    }
    
    static isFloat(obj) {
        return Number(obj) === obj && obj % 1 !== 0;
    }

    static isString(obj) {
        return obj && obj.constructor && obj.constructor.name === 'String';
    }

    static isArray(obj) {
        return Array.isArray(obj);
    }

    static isMap(obj) {
        return (this.getType(obj) === 'Map');
    }
    
    static isSet(obj) {
        return (this.getType(obj) === 'Set');
    }

    static isObject(obj) {
        return !this.isDate(obj) 
            && !this.isNumber(obj) 
            && !this.isString(obj) 
            && !this.isArray(obj)
            && !this.isBoolean(obj)
            && !this.isNull(obj)
            && !this.isUndefined(obj)
        ;
    }

    static isFunction(obj) {
        return typeof obj === 'function';
    }

    static isNull(obj) {
        return obj === null;
    }

    static isUndefined(obj) {
        return typeof obj === 'undefined';
    }

    static toBoolean(obj) {
        const truthy = [ 1, '1', 'Y', 'T', 'YES', 'TRUE' ];
        const falsey = [ 0, '0', 'N', 'F', 'NO',  'FALSE', 'NULL', 'UNDEFINED', ''];
        
        let result = true;
        
        if (this.isEmpty(obj)) {
            result = false;
        } 
        // only if it can't be cast as a number and is not an object...
        else if (!this.isNumber(obj) && !this.isObject(obj)) {
            let str = this.upper(obj).trim();
            if (truthy.includes(str)) {
                result = true;
            } else if (falsey.includes(str)) {
                result = false;
            }
        }
        // if it can be treated as a number...
        if (this.isNumber(obj)) {
            let num = parseInt(obj);

            if (num > 0) {
                result = true;
            } else {
                result = false;
            }
        }
        return result;
    }

    static getType(obj) {
        if (this.isNull(obj)) return 'Null';
        if (this.isUndefined(obj)) return 'Undefined';
        if (this.isArray(obj)) return 'Array';
        if (this.isNumber(obj)) {
            if (this.isFloat(obj)) return 'Float';
            if (this.isInteger(obj)) return 'Integer';
            return 'Number';
        }
        return obj.constructor.name;
    }

    static isEmpty(obj) {
        // console.log(obj)

        if (this.isNull(obj) || this.isUndefined(obj)) {
            return true;
        } 
        else if (this.isArray(obj)) {
            return obj.length === 0;
        }
        else if (this.isObject(obj)) {
            return JSON.stringify(obj) === JSON.stringify({});
        } 
        else {
            return false;
        }
    }

    static ifEmpty(obj, defaults) {
        if (this.isEmpty(obj)) return defaults;
        return obj;
    }

    static ifThenElse(ifVal, thenVal, elseVal) {
        if (this.toBoolean(ifVal)) {
            return thenVal;
        } else {
            return elseVal;
        }
    }

    static isSame(a = '', b = '') {
        return a.toLowerCase() === b.toLowerCase();
    }

    static required(obj, error) {
        if (this.isEmpty(obj)) throw new Error(error || 'Value Required');
        return obj;
    }

    static check(obj, options = []) {
        if (!options.includes(obj)) throw new Error(`value must be one of ${options.join()} but received ${obj}`);
        return obj;
    }

    static upper(obj) {
        return obj.toUpperCase();
    }

    static lower(obj) {
        return obj.toLowerCase();
    }

    static numberMask(mask, number) {
        var s = '' + number;
        var r = '';
        for (var im = 0, is = 0; im < mask.length && is < s.length; im++) {
            r += mask.charAt(im)=='X' ? s.charAt(is++) : mask.charAt(im);
        }
        return r;
    }

    static token() {
        if (!require) throw Error('This method doesn\'t work in the browser');
        return require('crypto').randomBytes(16).toString('hex');
    }

    static uuid(placeholder) {
        return placeholder ? (0|Math.random()*16).toString(16) : ( ""+1e7+-1e3+-4e3+-8e3+-1e11).replace(/1|0/g, this.uuid);
    }

    static contains(a, b, caseSensitive) {
        a = (caseSensitive) ? a : a.toLowerCase();
        b = (caseSensitive) ? b : b.toLowerCase();
        return a.includes(b);
    }

    static merge(defaults, ...objects) {
        return Object.assign({}, defaults, ...objects);
    }

    static copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    static construct(instance, defaults, config) {
        const props = Object.keys(instance);
        const values = Object.assign({}, defaults, config);
    
        for (let prop of props) {
            const value = values[prop];
            instance[prop] = value;
        }

        return instance;
    }

    // static construct(instance, ...objects) {
    //     const props = Object.keys(instance);
    //     const values = Object.assign({}, ...objects);
    //     for (let prop of props) {
    //         const value = values[prop];
    //         // console.log(prop, this.getType(instance[prop]))
    //         if (this.isEmpty(value)) continue;
    //         instance[prop] = value;
    //     }
    //     return instance;
    // }

    /**
     * Paging, Sorting and Query parameter cleanup to match a provided object or array.
     * @param {Object} params any of key:val object to be checked against a Model class.
     * @param {Object/Array} model a model class to be used to verify sort columns or params.
     * @returns {Object} 
     */
    static parameters(params, model, caseSensitive) {
        var fieldList = (this.isArray(model) ? model : Object.keys(model));
        var allowed = fieldList.concat(this.PAGING_PARAMS).join(' ');

        console.log('model:', fieldList);
        console.log('allowed:', allowed);

        params.sort  = model.hasOwnProperty(params.sort) ? params.sort : undefined;
        params.dir   = params.sort ? ((params.dir.toUpperCase() === 'ASC' || params.dir.toUpperCase() === 'DESC') ? params.dir : 'ASC') : undefined;
        params.page  = params.page && parseInt(params.page)   || this.DEFAULT_PAGE;
        params.limit = params.limit && parseInt(params.limit) || this.DEFAULT_LIMIT;

        for (let param in params) {
            if (this.isUndefined(params[param])) {
                delete params[param];
            } else if (this.contains(allowed, param, caseSensitive)) {
                continue;
            } else {
                delete params[param];
                console.warn(`Removing '${param}' from parameters as it does not match list of allowed field names. (Parameter names ${caseSensitive ? 'ARE' : 'are NOT'} case sensitive)`);
            }
        }

        return params;
    }

    /**
     * Removes any properties from an object with matching property names.
     * @param {Object} object the object to remove matching fields
     * @param {Array} redacted the property names to remove from an object.
     * @return {Object}
     */
    static redact(object, redacted = ['password']) {
        redacted.forEach((field) => {
            delete object[field];
        });
        return object;
    }

    /**
     * Remove extra whitespace including line breaks and tabs.
     * @param {String} text
     * @return {String}
     */
    static strip(string) {
        var words = string.match(/(\w+)/gmi);
        return words.join(' ');
    }

    /**
     * The default replacer function used by the this.json() method.
     * @param {String} key 
     * @param {Object} value
     */
    static replacer(key, value) {
        if (this.forbidden.includes(key.toLowerCase())) {
            return undefined;
        }
        if (this.lastfour.includes(key.toLowerCase())) {
            value = value.replace(/\d(?=\S{4})/g, "*");
        }
        if (this.redacted.includes(key.toLowerCase())) {
            value = value.replace(/\S/g, "*");
        }
        return value;
    }

    /**
     * @param {Object} obj to be converted to json.
     * @param {Array} exclude optional list of names to excluded from json output.
     * @returns {String}
     */
    static json(obj, exclude) {
        // const replacer = this.replacer.bind(this);
        // const excludes = (k, v) => ( exclude.includes(k) ? undefined : v);
        // return JSON.stringify(obj, (exclude ? excludes : replacer), 4);
        return global.JSON.stringify(obj);
    }
}

module.exports = Util;
