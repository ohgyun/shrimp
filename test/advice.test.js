module('J.advice', {
  setup: function () {  
    window.o = J.get('advice');
    J.init();
  },
  teardown: function () {
  }
});

test('add advice', function () {
  var advice = function () {};
  o.add('a', advice);
  equals(advice, o._advices['a']);
});

test('add advice: wrong param', function () {
  raises(function () {
    o.add('b', 'not function');
  }, 'advice should be function');
});

test('apply advice', function () {
  var mock = getMock();
  equals('mock', mock.getName());
  
  addUpperCaseAdvice();
  
  o.set('upperCase', mock, 'getName');
  
  equals('MOCK', mock.getName());
});

function getMock() {
  return {
    name: 'mock',
    getName: function () {
      return this.name; 
    },
    setName: function (name) {
      this.name = name; 
    }
  }; 
}

function addUpperCaseAdvice() {
  o.add('upperCase', function (method) {
    var ret = method();
    return ret.toUpperCase();
  }); 
}

test('apply advice: function with param ', function () {
  var mock = getMock();
  mock.setName('newMock');
  equals('newMock', mock.getName());
    
  addMakeParamToUpperCaseAdvice();
  
  o.set('paramUpperCase', mock, 'setName');

  mock.setName('newMock');
  equals('NEWMOCK', mock.getName());
});

function addMakeParamToUpperCaseAdvice() {
  o.add('paramUpperCase', function (method, name) {
    method(name.toUpperCase());
  }); 
}