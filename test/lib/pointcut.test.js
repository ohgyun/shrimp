module('J.pointcut', {});

function pc() {
  return J._libraries['pointcut']; 
}

function matchName(expression, name) {
  ok(pc().matchName(expression, name)); 
}

function unmatchName(expression, name) {
  ok(pc().matchName(expression, name) === false); 
}

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

test('expr validation', function () {
  ok(pc()._rExpr.test('module.doSomething()'));
  ok(pc()._rExpr.test('m*.do*()'));
  ok(pc()._rExpr.test('a*b.*()'));
  ok(pc()._rExpr.test('a*bc.*ab*c()'));
  ok(pc()._rExpr.test('*.*()'));
  ok(pc()._rExpr.test('*()'));
  ok(pc()._rExpr.test('do*()'));
  ok(pc()._rExpr.test('a*()'));
  
  
  ok(pc()._rExpr.test('.*()') === false);
  ok(pc()._rExpr.test('*') === false);
  ok(pc()._rExpr.test('()') === false);
  ok(pc()._rExpr.test('*.*') === false);
  ok(pc()._rExpr.test('abc') === false);
});

test('add expr: without module', function () {
  pc().add('a', 'do*()');
  
  same({
    module: '*',
    method: 'do*' 
  }, pc()._exprs['a']);
});

test('add expr: with module', function () {
  pc().add('b', 'abc*.do*()');
  
  same({
    module: 'abc*',
    method: 'do*' 
  }, pc()._exprs['b']);
});

test('add expr: invalid id', function () {
  raises(function () {
    pc().add('', 'abc');
  }, 'if no id');
});

test('add expr: invalid expression', function () {
  raises(function () {
    pc().add('a', '?xxx');
  }, 'if invalid expression');
  
  raises(function () {
    pc().add('a', 'abc..');
  }, 'if no id');
  
  raises(function () {
    pc().add('a', 'a b');
  });
});

test('match module', function () {
  pc().add('cacheExpr', 'ajax.request*()');
  
  ok(pc().match('cacheExpr', 'ajax', 'requestWithCache'));
  ok(pc().match('cacheExpr', 'ajax', 'request'));
  
  ok(pc().match('cacheExpr', 'ajax1', 'request') === false);
  ok(pc().match('cacheExpr', 'ajax', 're1quest') === false);
  ok(pc().match('cacheExpr', 'ajax', 're1questrequest') === false);
  ok(pc().match('xxxx', 'ajax', 'request') === false);
});