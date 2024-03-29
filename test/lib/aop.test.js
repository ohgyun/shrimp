module('Shrimp.aop', {
  setup: function () {
    aop().$core = Shrimp;
    
    // set mock
    createMockPointcut();
    createMockAdvice();
       
    // set test object
    Shrimp.module('mock.mockA', {
      doSomething: mockFunction()
    });
    Shrimp.module('mock.mockB', {
      doSomething: mockFunction()
    });
    Shrimp.module('mock.mockC', {
      doSomething: mockFunction()
    });
  },
  teardown: function () {
    Shrimp._modules = {};
  }
});

function aop() {
  return Shrimp._libraries['aop']; 
}

function createMockPointcut() {
  var mockPointcut = mock({
    add: mockFunction(),
    match: mockFunction()
  });
  
  // if module name starts with 'mock' then return true;
  when(mockPointcut.match)(anything(), containsString('mock'), anything()).thenReturn(true);
  
  aop().$pointcut = mockPointcut;
}

function createMockAdvice() {
  var mockAdvice = mock({
    add: mockFunction(),
    set: mockFunction()
  });
  
  aop().$advice = mockAdvice;
}

test('add advisor with pointcut and advice', function () {
  var id = 'testId';
  var pointcut = 'testPointcut';
  var advice = function (method) {};
  
  aop().addAdvisor(id, pointcut, advice);
  
  verify(aop().$pointcut.add, times(1))(id, pointcut);
  verify(aop().$advice.add, times(1))(id, advice);
});

test('apply advisor to modules', function () {
  var id = 'testId';
  
  aop().applyAdvisorToModules(id);
  
  verify(aop().$advice.set, times(3))(id, anything(), anything()); 
  // because mock pointcut.match returns true if module name starts with 'mock'
});


