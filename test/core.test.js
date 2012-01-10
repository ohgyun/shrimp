module('J core', {
  setup: function () {
  },
  teardown: function () {
    J._modules = {};
    J._libraries = {};
  }
});

test('register library', function () {
  var lib = {};
  J.library('lib', lib);
  equals(lib, J._libraries.lib);
});

test('register module', function () {
  var mod = {};
  J.module('mod', mod);
  equals(mod, J._modules.mod);
  equals('mod', mod.name, 'object.name setted by module name');
});

test('inject library dependency automately', function () {
  J.library('lib', {});

  var mod = {
    $lib: null
  };
  J.module('mod', mod);

  equals(J._libraries['lib'], mod.$lib);
});

test('start/stop modules', function () {
  createMockModule('a');

  J.start('a');

  verify(J._modules['a'].init, times(1))();
  verify(J._modules['a'].destroy, times(0))();

  J.stop('a');

  verify(J._modules['a'].destroy, times(1))();
});

test('start/stop all modules', function () {
  createMockModule('a');
  createMockModule('b');

  J.startAll();

  verify(J._modules['a'].init, times(1))();
  verify(J._modules['b'].init, times(1))();

  J.stopAll();

  verify(J._modules['a'].destroy, times(1))();
  verify(J._modules['b'].destroy, times(1))();
});

function createMockModule(name) {
  J.module(name, {
    init: mockFunction(),
    destroy: mockFunction()
  });
}

