module('J.aop', {
  setup: function () {  
    window.o = J.get('aop');
    
    // set mock
    createMockPointcut();
    createMockAdvice();
       
    // set test object
    J.module('mockA', {});
    J.module('mockB', {});
    J.module('mockC', {});
    
    J.init();
  },
  teardown: function () {
    J.destroy('mockA', 'mockB', 'mockC');
  }
});

function createMockPointcut() {
  var mockPointcut = mock({
    add: mockFunction(),
    match: mockFunction()
  });
  
  // if module name starts with 'mock' then return true;
  when(mockPointcut.match)(anything(), containsString('mock'), anything()).thenReturn(true);
  
  J.module('pointcut', mockPointcut);
}

function createMockAdvice() {
  var mockAdvice = mock({
    add: mockFunction(),
    set: mockFunction()
  });
  
  J.module('advice', mockAdvice);
}

test('add advisor with pointcut and advice', function () {
  var id = 'testId';
  var pointcut = 'testPointcut';
  var advice = function (method) {};
  
  o.addAdvisor(id, pointcut, advice);
  
  verify(J.get('pointcut').add, times(1))(id, pointcut);
  verify(J.get('advice').add, times(1))(id, advice);
});

test('apply advisor to modules', function () {
  var id = 'testId';
  
  o.applyAdvisorToModules(id);
  
  verify(J.get('advice').set, times(3))(id, anything(), anything()); 
  
});


