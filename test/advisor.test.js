module('J.advisor', {
  setup: function () {  
    window.o = J.get('advisor');
    J.init();
  },
  teardown: function () {
  }
});

test('add pointcut', function () {
  o.addPointcut('getterMatch', 'get*()');
  o.addPointcut('setterMatch', 'set*()');

});
