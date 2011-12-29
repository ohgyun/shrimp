J.module('pointcut', {
  
  /**
   * pointcut expressions
   * {
   *   { id(string), expression(string) }, { ... }, ...
   * }
   */
  _exprs: {},
  
  /**
   * expression: [moduleName.]methodName()
   * - group1 : moduleName
   * - group2 : methodName
   */
  _rExpr: /^(?:([\w\*]+)\.)?([\w\*]+)\(\)$/,
  
  MSG: {
    INVALID_EXPR: 'J.pointcut: invalid expression',
    ID_REQUIRED: 'J.pointcut: id required'
  },
  
  /**
   * add pointcut and store to _exprs
   * {
   *   id: {
   *     module: 'module expression',
   *     method: 'method expression'
   *   }, ...
   * }
   * @param id (string) pointcut id
   * @param expr (string) expression
   *      expression: [moduleName.]methodName()
   */
  add: function (id, expr) {
    if (!id) {
      throw this.MSG.ID_REQUIRED; 
    }
    
    var parsed = this._rExpr.exec(expr);
    
    if (!parsed) {
      throw this.MSG.INVALID_EXPR; 
    }
    
    this._exprs[id] = {
      module: parsed[1] || '*',
      method: parsed[2]
    };
  },
  
  /**
   * Test if module & method name matches
   * @param id (string) pointcut id
   * @param moduleName (string)
   * @param methodName (string)
   */
  match: function(id, moduleName, methodName) {
    var expr = this._exprs[id];
    if (expr
        && this.matchName(expr.module, moduleName)
        && this.matchName(expr.method, methodName)) {
      return true;     
    }
    return false;
  },

  /**
   * Test if name matches
   * @param expr (string) expression
   * @param name (string) module name
   * @return (boolean) matched result
   */
  matchName: function (expr, name) {
    if (expr === '*') {
      return true; 
    }
    
    // abc* --> /^abc\w+$/
    var nameExpr = '^' + expr.replace(/\*/g, '\\w*') + '$';
    return new RegExp(nameExpr).test(name);
  }
});