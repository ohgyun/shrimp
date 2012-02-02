module('Shrimp core', {
  setup: function () {
  },
  teardown: function () {
    Shrimp._modules = {};
    Shrimp._libraries = {};
  }
});

test('register library', function () {
  var lib = {};
  Shrimp.library('lib', lib);
  equals(lib, Shrimp._libraries.lib);
});

test('define namespace', function () {
  Shrimp.namespace('foo');
  same({
    name: 'foo'
  }, Shrimp._modules['foo']);
});

test('register module', function () {
  var one = {};
  Shrimp.module('foo.one', one);
  
  equals(one, Shrimp._modules.foo.one);
  equals('one', one.name);
  equals('foo.one', one.fullName);
});

test('register module without namespace', function () {
  raises(function () {
    // module should be like 'namespace.moduleName'.
    Shrimp.module('some', {});  
  });
});

test('inject library dependency to module automatically', function () {
  Shrimp.library('lib', {});

  var bar = {
    $lib: null
  };
  Shrimp.module('foo.bar', bar);
  
  Shrimp.init(); // must initialize to inject dependency

  equals(Shrimp._libraries['lib'], bar.$lib);
});

test('inject dependency between libraries', function () {
  Shrimp.library('libA', {
    $libB: null
  });
  
  Shrimp.library('libB', {
    $libA: null
  });
  
  Shrimp.init();
  
  equals(Shrimp._libraries['libA'], Shrimp._libraries['libB'].$libA);
  equals(Shrimp._libraries['libB'], Shrimp._libraries['libA'].$libB);
});

test('add core library', function () {
  Shrimp.init();
  
  equals(Shrimp, Shrimp._libraries['core']);
});

test('inject dependency between modules', function () {
  Shrimp.module('foo.one', {
    __two: null
  });
  
  Shrimp.module('foo.two', {
    __one: null
  });
  
  Shrimp.module('bar.one', {
    __two: null
  });
  
  Shrimp.init();
  
  equals(Shrimp._modules['foo']['one'], Shrimp._modules['foo']['two'].__one);
  equals(Shrimp._modules['foo']['two'], Shrimp._modules['foo']['one'].__two);
  equals(null, Shrimp._modules['bar']['one'].__two);
});

test('start/stop modules', function () {
  createMockModule('foo.one');

  Shrimp.start('foo.one');
  
  verify(Shrimp._modules['foo']['one'].init, times(1))();
  verify(Shrimp._modules['foo']['one'].destroy, times(0))();

  Shrimp.stop('foo.one');

  verify(Shrimp._modules['foo']['one'].destroy, times(1))();
});

test('start/stop all modules', function () {
  createMockModule('foo.one');
  createMockModule('foo.two');

  Shrimp.startAll();

  verify(Shrimp._modules['foo']['one'].init, times(1))();
  verify(Shrimp._modules['foo']['two'].init, times(1))();

  Shrimp.stopAll();

  verify(Shrimp._modules['foo']['one'].destroy, times(1))();
  verify(Shrimp._modules['foo']['two'].destroy, times(1))();
});

function createMockModule(name) {
  Shrimp.module(name, {
    init: mockFunction(),
    destroy: mockFunction()
  });
}

