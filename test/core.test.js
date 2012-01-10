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

test('inject library dependency to module automately', function () {
  J.library('lib', {});

  var mod = {
    $lib: null
  };
  J.module('mod', mod);
  
  J.init(); // must initialize to inject dependency

  equals(J._libraries['lib'], mod.$lib);
});

test('inject dependency between libraries', function () {
  J.library('libA', {
    $libB: null
  });
  
  J.library('libB', {
    $libA: null
  });
  
  J.init();
  
  equals(J._libraries['libA'], J._libraries['libB'].$libA);
  equals(J._libraries['libB'], J._libraries['libA'].$libB);
});

test('add core library', function () {
  J.init();
  
  equals(J, J._libraries['core']);
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

