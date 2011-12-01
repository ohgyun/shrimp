J.module('pointcut', {
  
  $core: null,
  
  /**
   * pointcut expressions
   * {
   *   { id(string), expression(string) }, { ... }, ...
   * }
   */
  _exprs: {},
  
  _rExpr: /^([\w\*])+\s$/,
  
  _rValidExpr: /^[\w\*]*$/,
  
  _rValidType: /^(\*|object|undefined|null|string|number|Object|Array|Function|Number|String)$/,
  
  msg: {
    INVALID_EXPR: 'J.pointcut: invalid expression',
    INVALID_TYPE: 'J.pointcut: invalid return type'
  },
  
  match: function (moduleName, methodName, method) {
    
  },
  
  /**
   * Test if module name matches
   * @param expr (string) expression
   * @param name (string) module name
   * @return (boolean) matched result
   */
  matchName: function (expr, name) {
    if (!this._rValidExpr.test(expr)) {
      throw this.msg.INVALID_EXPR;
    }
     
    if (expr === '*') {
      return true; 
    }
    
    var nameExpr = '^' + expr.replace(/\*/g, '\\w+') + '$';
    return new RegExp(nameExpr).test(name);
  },
  
  /**
   * Test if type matches
   * @param type (string)
   * @param value (mixed)
   * @return (boolean)
   */
  matchType: function (type, value) {
    if (type === '*') {
      return true; 
    }
    
    var valueType = typeof value;
    
    if (type === valueType) {
      return true; 
    }
    
    if (type === 'null' && value === null) {
      return true; 
    }
    
    if ((type === 'string' || type === 'String')
        && (valueType === 'string' || value instanceof String)) {
      return true; 
    }
    
    if ((type === 'number' || type === 'Number')
        && (valueType === 'number' || value instanceof Number)) {
      return true;     
    }    

    if (type === 'Array' && value instanceof Array) {
      return true; 
    }
    
    if (type === 'Function' && value instanceof Function) {
      return true; 
    }
    
    if (type === 'Object' && value instanceof Object) {
      return true; 
    }
    
    return false;
  },
  
  /**
   * Test if method matches
   * @param nameExpr (string) method name expression
   * @param agrsExpr (string) arguments expression
   * @param funcName (string) function name
   * @param func (function) target function
   */
  matchMethod: function (nameExpr, argsExpr, funcName, func) {
    if (this.matchName(nameExpr, funcName)
        && this.matchArgs(argsExpr, func)) {
      return true;     
    }
    return false;
  },
  
  /**
   * Test if arguments numbers matches
   * @param argsExpr (string) * or number or 1..5
   * @param func (function)
   */
  matchArgs: function (argsExpr, func) {
    // TODO really need arguments count?
    return true;
  }
});