J.module('aop', {
  $core: null,
  
  $advice: null,
  
  $pointcut: null,
  
  set: function (pointcut, advice) {
    var id = this.$core.guid();  
    this.addAdvisor(id, pointcut, advice);
    this.applyAdvisorToModules(id);
  },
  
  addAdvisor: function (id, pointcut, advice) {
    this.$pointcut.add(id, pointcut);
    this.$advice.add(id, advice);
  },
  
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