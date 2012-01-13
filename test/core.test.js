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

test('define namespace', function () {
  J.namespace('foo');
  same({
    name: 'foo'
  }, J._modules['foo']);
});

test('register module', function () {
  var one = {};
  J.module('foo.one', one);
  
  equals(one, J._modules.foo.one);
  equals('one', one.name);
  equals('foo.one', one.fullName);
});

test('register module without namespace', function () {
  raises(function () {
    // module should be like 'namespace.moduleName'.
    J.module('some', {});  
  });
});

test('inject library dependency to module automatically', function () {
  J.library('lib', {});

  var bar = {
    $lib: null
  };
  J.module('foo.bar', bar);
  
  J.init(); // must initialize to inject dependency

  equals(J._libraries['lib'], bar.$lib);
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

test('inject dependency between modules', function () {
  J.module('foo.one', {
    __two: null
  });
  
  J.module('foo.two', {
    __one: null
  });
  
  J.module('bar.one', {
    __two: null
  });
  
  J.init();
  
  equals(J._modules['foo']['one'], J._modules['foo']['two'].__one);
  equals(J._modules['foo']['two'], J._modules['foo']['one'].__two);
  equals(null, J._modules['bar']['one'].__two);
});

test('start/stop modules', function () {
  createMockModule('foo.one');

  J.start('foo.one');
  
  verify(J._modules['foo']['one'].init, times(1))();
  verify(J._modules['foo']['one'].destroy, times(0))();

  J.stop('foo.one');

  verify(J._modules['foo']['one'].destroy, times(1))();
});

test('start/stop all modules', function () {
  createMockModule('foo.one');
  createMockModule('foo.two');

  J.startAll();

  verify(J._modules['foo']['one'].init, times(1))();
  verify(J._modules['foo']['two'].init, times(1))();

  J.stopAll();

  verify(J._modules['foo']['one'].destroy, times(1))();
  verify(J._modules['foo']['two'].destroy, times(1))();
});

function createMockModule(name) {
  J.module(name, {
    init: mockFunction(),
    destroy: mockFunction()
  });
}

