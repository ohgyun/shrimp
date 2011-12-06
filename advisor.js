J.module('advisor', {
  
  $pointcut: null,
  
  $advice: null,
  
  _advisors: {},
  
  addPointcut: function (pointcutId, expr) {
    this.$pointcut.add(pointcutId, expr); 
  },
  
  addAdvice: function (adviceId, advice) {
    this.$advice.add(adviceId, advice); 
  },
  
  addAdvisor: function (id, pointcutId, adviceId) {
    this._advisors[id] = {
      pointcut: pointcutId,
      advice: adviceId
    };
  },
  
  getAdvisor: function () {
    return this._advisors; 
  }
  

});




