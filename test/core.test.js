module('J core', {
  setup: function () {
    J.module('a', {
      $b: null
    });

    J.module('b', {
      $a: null,
      _test: null,
      init: function () {
        this._test = "inited";
      }
    });

    J.init();
  },
  teardown: function () {
    J.clear('a', 'b');
  }
});

test('inject dependency automately', function () {
  equals(J.get('a').$b, J.get('b'));
  equals(J.get('b').$a, J.get('a'));
});

test('init called when J inited', function () {
  equals("inited", J.get('b')._test);
});

test('test core module', function () {
  equals(J.get('core'), J);
});

test('clear module', function () {
  J.clear('b');
  equals(J.get('b'), null);
});