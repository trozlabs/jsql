exports.PLACEHOLDER = {
    EQ          : `?`,
    LT          : `?`,
    LTEQ        : `?`,
    GT          : '?',
    GTEQ        : '?',
    NOT         : '?',
    LIKE        : `'%' || ? || '%'`,
    STARTS_WITH : `'%' || ?`,
    ENDS_WITH   : `? || '%'`,
    BETWEEN     : `? AND ?`,
    IN          : ``,
    NOT_IN      : ``
};

exports.OPERATOR = {
    EQ          : '=',
    GT          : '>', 
    GTEQ        : '>=', 
    LT          : '<',
    LTEQ        : '<=',
    LTGT        : '<>',
    LIKE        : 'LIKE',
    IN          : 'IN',
    BETWEEN     : 'BETWEEN',
    NOT         : 'NOT'
};

