/**
 * Advice Library
 */
J.library('advice', {
  
  /**
   * @type {Object.<string, function>}
   */
  _advices: {},
  
  msg: {
    ADVICE_SHOULD_BE_FUNCTION: 'J.advice: advice should be function'
  },
  
  /**
   * add advice
   * @param {string} id Advice id
   * @param {function(function, ...*)} advice Advice.
   *          function (method[, param, ...])
   *              method (function) original method binded by original object.
   *              param (mixed) original method parameters
   *
   * 'this' of advice function is original object
   */           
  add: function (id, advice) {
    if (typeof advice !== 'function') {
      throw this.msg.ADVICE_SHOULD_BE_FUNCTION;  
    }
    this._advices[id] = advice;
  },
  
  /**
   * Set advice to method in object
   * @param {string} id Advice id
   * @param {!Object} obj Target object
   * @param {string} methodName Method name applied to advice
   */
  set: function (id, obj, methodName) {
    var advice = this._advices[id],
      oldMethod = this.bind(obj[methodName], obj);
    
    obj[methodName] = function () {
      var args = Array.prototype.slice.call(arguments);
      args.splice(0, 0, oldMethod);
      return advice.apply(obj, args.concat());
    };
  },
  
  /**
   * Bind function to context object
   * @param {function()} fn
   * @param {!Object} context Context to bind
   * @param {...*} var_args Parameters
   */
  bind: function (fn, context, var_args) {
    var slice = Array.prototype.slice,
      args = slice.call(arguments, 2);

    return function () {
      return fn.apply(context, args.concat(slice.call(arguments))); 
    };
  }  
});