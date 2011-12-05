module('J.advisor', {
  setup: function () {  
    window.o = J.get('advisor');
    
    var mockPointcut = mock({
      add: mockFunction()
    });

    var mockAdvice = mock({
      add: mockFunction()
    });

    J.module('pointcut', mockPointcut);
    J.module('advice', mockAdvice);

    J.init();
  },
  teardown: function () {
  }
});

test('add pointcut', function () {
  o.addPointcut('getterMatch', 'get*()');
  verify(J.get('pointcut').add)('getterMatch', 'get*()');
});

test('add advice', function () {
  var advice = mockFunction();
  o.addAdvice('upperCaseAdvice', advice);
  verify(J.get('advice').add)('upperCaseAdvice', advice);
});

test('add advisor', function () {
  o.addAdvisor('makeGetterUpperCase', 'getterMatch', 'upperCaseAdvice');
  same(o._advisors['makeGetterUpperCase'], {
    pointcut: 'getterMatch',
    advice: 'upperCaseAdvice'
  });
});

test('set', function () {

});
