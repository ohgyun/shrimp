module('J', {
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
    J.clear('a');
    J.clear('b');
  }
});

test('inject dependency automately', function () {
  equals(J.get('a').$b, J.get('b'));
  equals(J.get('b').$a, J.get('a'));
});

test('init called when J inited', function () {
  equals("inited", J.get('b')._test);
});


module('J.ps', {
  setup: function () {
    J.module('p', {
      $ps: null,

      pub: function () {
        this.$ps.publish('p.pub');
      }
    });

    J.module('s1', {
      $ps: null,

      init: function () {
        var t = this;
        this.$ps.subscribe('p.pub', function () {
          t._result = "s1";
        });
      }
    });

    J.module('s2', {
      $ps: null,
      $util: null,

      _callbackId: null,

      init: function () {
        this._callbackId = this.$ps.subscribe('p.pub', this.$util.bind(this.sub, this));
      },

      sub: function () {
        this._result = "s2";
      },

      unsub: function () {
        this.$ps.unsubscribe('p.pub', this._callbackId);
      }
    });

    J.init();
  },
  teardown: function () {
    J.clear('p');
    J.clear('s1');
    J.clear('s2');
  }

});

test('publish', function () {
  J.get('p').pub();
  equals('s1', J.get('s1')._result);
  equals('s2', J.get('s2')._result);
});

test('unsubscribe', function () {
  J.get('p').pub();
  equals('s2', J.get('s2')._result);

  J.get('s2')._result = '';
  J.get('s2').unsub();
  J.get('p').pub();
  equals('', J.get('s2')._result);
});

test('clear topic', function () {
  J.get('p').pub();
  equals('s2', J.get('s2')._result);

  J.get('s2')._result = '';
  J.get('p').$ps.clear('p.pub');
  J.get('p').pub();
  equals('', J.get('s2')._result);
});

test('no subscribers', function () {
  J.get('ps').publish('nobody.listen');
  ok('no error');
});

test('invalid subscribe topic', function () {
  J.get('ps').subscribe('invalid.topic', function () {});
  ok('no error');
});

test('invalid unsubscribe topic', function () {
  J.get('ps').unsubscribe('invalid.topic', null);
  ok('no error');
});

