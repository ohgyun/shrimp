/**
 * AOP Library
 */
Shrimp.library('aop', {
  
  $core: null,
  
  $advice: null,
  
  $pointcut: null,
  
  /**
   * set advisor to modules.
   * id will be created randomly.
   * @param {string} pointcut Pointcut expression
   * @param {function(function, ...*)} advice
   */
  set: function (pointcut, advice) {
    var id = this.$core.guid();  
    this.addAdvisor(id, pointcut, advice);
    this.applyAdvisorToModules(id);
  },
  
  /**
   * add advisor with specific id
   * @param {string} id Advisor id. same with pointcut and advice.
   * @param {string} pointcut Pointcut expression
   * @param {function(function, ...*)} advice
   */
  addAdvisor: function (id, pointcut, advice) {
    this.$pointcut.add(id, pointcut);
    this.$advice.add(id, advice);
  },
  
  /**
   * apply advice to module by with specific advisor id
   * @param {string} id Advisor id
   */
  applyAdvisorToModules: function (id) {
    var t = this;
    this.$core.eachModule(function (moduleName, module) {
      
      // each property
      t.$core.eachProperty(module, function (k, v) {
        t.$advice.set(id, module, k);
      }, function (k, v) {
        return typeof v === 'function' && t.$pointcut.match(id, moduleName, k); 
      });
      // each property
      
    });
  }
});