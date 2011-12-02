module('J.pointcut', {
  setup: function () {  
    window.o = J.get('pointcut');
    J.init();
  },
  teardown: function () {
  }
});

test('module name match: all wild card', function () {
  matchName('*', 'abc');
  matchName('*', '');
});

test('module name match: wild card at last', function () {
  matchName('a*', 'abc');
  matchName('a*', 'a');  
});

test('module name match: wild card at first', function () {
  matchName('*bc', 'abc');
  matchName('*bc', 'bc');
  unmatchName('*bc', '');
});

test('module name match: wild card at each side', function () {
  matchName('*bcd*', 'abcde');
  matchName('*bcd*', 'bbcdbcdxx');
  matchName('*bcd*', 'bcd');
  unmatchName('*bcd*', '');
});

test('module name match: wild card at center', function () {
  matchName('a*bcd', 'aabcd');
  matchName('a*bcd', 'abcd');
  unmatchName('a*bcd', 'abbce');  
  unmatchName('a*bcd', '');
});

test('module name match: name should not have blank', function () {
  unmatchName('a*', 'aabb ');
  unmatchName('*a', '  bb');
  unmatchName('a', ' a');
});

function matchName(expression, name) {
  ok(o.matchName(expression, name)); 
}

function unmatchName(expression, name) {
  ok(o.matchName(expression, name) === false); 
}

test('expr validation', function () {
  ok(o._rExpr.test('module.doSomething()'));
  ok(o._rExpr.test('m*.do*()'));
  ok(o._rExpr.test('a*b.*()'));
  ok(o._rExpr.test('a*bc.*ab*c()'));
  ok(o._rExpr.test('*.*()'));
  ok(o._rExpr.test('*()'));
  ok(o._rExpr.test('do*()'));
  ok(o._rExpr.test('a*()'));
  
  
  ok(o._rExpr.test('.*()') === false);
  ok(o._rExpr.test('*') === false);
  ok(o._rExpr.test('()') === false);
  ok(o._rExpr.test('*.*') === false);
  ok(o._rExpr.test('abc') === false);
});

test('add expr: without module', function () {
  o.add('a', 'do*()');
  
  same({
    module: '*',
    method: 'do*' 
  }, o._exprs['a']);
});

test('add expr: with module', function () {
  o.add('b', 'abc*.do*()');
  
  same({
    module: 'abc*',
    method: 'do*' 
  }, o._exprs['b']);
});

test('add expr: invalid id', function () {
  raises(function () {
    o.add('', 'abc');
  }, 'if no id');
});

test('add expr: invalid expression', function () {
  raises(function () {
    o.add('a', '?xxx');
  }, 'if invalid expression');
  
  raises(function () {
    o.add('a', 'abc..');
  }, 'if no id');
  
  raises(function () {
    o.add('a', 'a b');
  });
});

test('match module', function () {
  o.add('cacheExpr', 'ajax.request*()');
  
  ok(o.match('cacheExpr', 'ajax', 'requestWithCache'));
  ok(o.match('cacheExpr', 'ajax', 'request'));
  
  ok(o.match('cacheExpr', 'ajax1', 'request') === false);
  ok(o.match('cacheExpr', 'ajax', 're1quest') === false);
  ok(o.match('cacheExpr', 'ajax', 're1questrequest') === false);
  ok(o.match('xxxx', 'ajax', 'request') === false);
});