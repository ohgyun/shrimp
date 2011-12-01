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
  unmatchName('a*', 'a');  
});

test('module name match: wild card at first', function () {
  matchName('*bc', 'abc');
  unmatchName('*bc', 'bc');
  unmatchName('*bc', '');
});

test('module name match: wild card at each side', function () {
  matchName('*bcd*', 'abcde');
  matchName('*bcd*', 'bbcdbcdxx');
  unmatchName('*bcd*', 'bcd');
  unmatchName('*bcd*', '');
});

test('module name match: wild card at center', function () {
  matchName('a*bcd', 'aabcd');
  unmatchName('a*bcd', 'abcd');
  unmatchName('a*bcd', 'abbce');  
  unmatchName('a*bcd', '');
});

test('module name match: name should not have blank', function () {
  unmatchName('a*', 'aabb ');
  unmatchName('*a', '  bb');
  unmatchName('a', ' a');
});

test('expression is not valid', function () {
  raises(function () {
    o.matchName('?invalid expression');
  }, o.msg.INVALID_EXPR);
});

function matchName(expression, name) {
  ok(o.matchName(expression, name)); 
}

function unmatchName(expression, name) {
  ok(o.matchName(expression, name) === false); 
}

test('return type match: wild card', function () {
  matchType('*', undefined);
  matchType('*', null);
  matchType('*', 1);
  matchType('*', 0);
  matchType('*', -1);
  matchType('*', 'str');
  matchType('*', {});
  matchType('*', []);
  matchType('*', function () {});
});

test('return type match: undefined', function () {
  matchType('undefined', undefined);
  unmatchType('undefined', '');
  unmatchType('undefined', false);
  unmatchType('undefined', null);
});

test('return type match: object', function () {
  matchType('object', {});
  matchType('object', []);
  matchType('object', null);
  unmatchType('object', undefined);
  unmatchType('object', function () {});
  
  matchType('Object', {});
  matchType('Object', []);
  unmatchType('Object', null);
});

test('return type match: function', function () {
  matchType('function', function () {});
  matchType('function', new Function());
  matchType('Function', function () {});
  matchType('Function', new Function());
  unmatchType('function', {});
});

test('return type match: Array', function () {
  matchType('Array', []);
  matchType('Array', new Array());
});

test('return type match: string', function () {
  matchType('string', 'abc');
  matchType('string', '');
  matchType('string', String('a'));
  matchType('string', new String('a'));
  matchType('String', 'abc');
  matchType('String', '');
  matchType('String', String('a'));
  matchType('String', new String('a'));
});

test('return type match: number', function () {
  matchType('number', 3);
  matchType('number', 0);
  matchType('number', Number(3));
  matchType('number', new Number(3));
  matchType('Number', 3);
  matchType('Number', 0);
  matchType('Number', Number(3));
  matchType('Number', new Number(3));
});

test('return type match: null', function () {
  matchType('null', null);
  unmatchType('null', undefined);
});

function matchType(type, value) {
  ok(o.matchType(type, value));
}

function unmatchType(type, value) {
  ok(o.matchType(type, value) === false);
}