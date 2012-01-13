module('J.aop', {
  setup: function () {
    aop().$core = J;
    
    // set mock
    createMockPointcut();
    createMockAdvice();
       
    // set test object
    J.module('mock.mockA', {});
    J.module('mock.mockB', {});
    J.module('mock.mockC', {});
  },
  teardown: function () {
    J._modules = {};
  }
});

function aop() {
  return J._libraries['aop']; 
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
  
  // TODO modify pointcut
  aop().applyAdvisorToModules(id);
  
  verify(aop().$advice.set, times(3))(id, anything(), anything()); 
  // because mock pointcut.match returns true if module name starts with 'mock'
});


