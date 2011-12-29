J.module('aop', {
  
  $core: null,
  
  $advice: null,
  
  $pointcut: null,
  
  /**
   * set advisor to modules.
   * id will be created randomly.
   * @param pointcut (string) pointcut expression
   * @param advice (function) advice
   */
  set: function (pointcut, advice) {
    var id = this.$core.guid();  
    this.addAdvisor(id, pointcut, advice);
    this.applyAdvisorToModules(id);
  },
  
  /**
   * add advisor with specific id
   * @param id (string) advisor id. same with pointcut and advice.
   * @param pointcut (string) pointcut expression
   * @param advice (function) advice
   */
  addAdvisor: function (id, pointcut, advice) {
    this.$pointcut.add(id, pointcut);
    this.$advice.add(id, advice);
  },
  
  /**
   * apply advice to module by with specific advisor id
   * @param id (string) advisor id
   */
  applyAdvisorToModules: function (id) {
    var t = this;
    this.$core.eachModule(function (name, obj) {
      t.$core.eachProperty(obj, function (k, v) {
        if (t.$pointcut.match(id, name, k)) {
          t.$advice.set(id, obj, k);
        }
      });
    });
  }
});