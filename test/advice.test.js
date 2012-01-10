module('J.advice');

function adv() {
  return J._libraries['advice']; 
}

test('add advice', function () {
  var advice = function () {};
  adv().add('a', advice);
  equals(advice, adv()._advices['a']);
});

test('add advice: wrong param', function () {
  raises(function () {
    adv().add('b', 'not function');
  }, 'advice should be function');
});

test('apply advice', function () {
  var mock = getMock();
  equals('mock', mock.getName());
  
  addUpperCaseAdvice();
  
  adv().set('upperCase', mock, 'getName');
  
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
  adv().add('upperCase', function (method) {
    var ret = method();
    return ret.toUpperCase();
  }); 
}

test('apply advice: function with param ', function () {
  var mock = getMock();
  mock.setName('newMock');
  equals('newMock', mock.getName());
    
  addMakeParamToUpperCaseAdvice();
  
  adv().set('paramUpperCase', mock, 'setName');

  mock.setName('newMock');
  equals('NEWMOCK', mock.getName());
});

function addMakeParamToUpperCaseAdvice() {
  adv().add('paramUpperCase', function (method, name) {
    method(name.toUpperCase());
  }); 
}