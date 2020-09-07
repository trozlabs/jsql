

/**
 * @param {Object} object any of key:val object to be checked against a Model class.
 * @param {Model} model a model class to be used to verify sort columns or params.
 * @returns {Object} 
 */
exports.validateFields = (object, model) => {
    var instance = Model.isPrototypeOf(model) ? new model() : model;
    
    for (prop in object) {
        
        if (['sort', 'dir', 'limit', 'page'].includes(prop)) continue;

        if (!instance.hasOwnProperty(prop)) {
            console.warn(`The '${prop}' field is not a valid for ${model.name || 'the provided object'}. Deleting from params.`);
            delete object[prop];
        }
        if (object[prop] === undefined) {
            delete object[prop];
        }
    }

    object.sort  = instance.hasOwnProperty(object.sort) ? object.sort : undefined;
    object.dir   = object.sort ? ((object.dir.toUpperCase() === 'ASC' || object.dir.toUpperCase() === 'DESC') ? object.dir : 'ASC') : undefined;
    object.page  = object.page && parseInt(object.page)   || 1;
    object.limit = object.limit && parseInt(object.limit) || 25;
    return object;
}
