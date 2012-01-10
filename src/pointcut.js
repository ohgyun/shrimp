/**
 * Pointcut Library
 */
J.library('pointcut', {
  
  /**
   * pointcut expressions
   * @type {Object.<string, {module: string, method: string}>}
   */
  _exprs: {},
  
  /**
   * @type {RegExp} Expression likes '[moduleName.]methodName()'.
   *     Group1 is moduleName and group2 is methodName.
   */
  _rExpr: /^(?:([\w\*]+)\.)?([\w\*]+)\(\)$/,
  
  MSG: {
    INVALID_EXPR: 'J.pointcut: invalid expression',
    ID_REQUIRED: 'J.pointcut: id required'
  },
  
  /**
   * add pointcut and store to _exprs
   * @param {string} id Pointcut id.
   * @param {string} expr Pointcut expression likes [moduleName.]methodName()
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
   * @param {string} id Pointcut id
   * @param {string} moduleName
   * @param {string} methodName
   * @return {boolean}
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
   * @param {string} expr Name expression
   * @param {string} name Target name
   * @return {boolean} Matched result
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