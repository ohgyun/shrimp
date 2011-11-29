//----------------------------------------------------------------------------
// Core
//----------------------------------------------------------------------------
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

//----------------------------------------------------------------------------
// Pub/Sub Module
//----------------------------------------------------------------------------
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
          t._received = true;
        });
      }
    });

    J.module('s2', {
      $ps: null,

      _callbackId: null,

      init: function () {
        var t = this;
        this._callbackId = this.$ps.subscribe('p.pub', function () {
          t._received = true;
        });
      },

      unsub: function () {
        this.$ps.unsubscribe('p.pub', this._callbackId);
      }
    });
    
    J.init();
  },
  teardown: function () {
    J.clear('p', 's1', 's2');
  }

});

function received(name) {
  ok(J.get(name)._received);
}

function notReceived(name) {
  ok(!!J.get(name)._received === false);
}

function resetReceived(name) {
  J.get(name)._received = false;
}

test('publish', function () {
  J.get('p').pub();
  received('s1');
  received('s2');
});

test('unsubscribe', function () {
  J.get('p').pub();
  received('s2');

  resetReceived('s2');
  J.get('s2').unsub();
  
  J.get('p').pub();
  notReceived('s2');
});

test('clear topic', function () {
  J.get('p').pub();
  received('s2');

  resetReceived('s2')
  J.get('p').$ps.clear('p.pub');
  
  J.get('p').pub();
  notReceived('s2');
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


//----------------------------------------------------------------------------
// Pub/Sub Module: Message Depth
//----------------------------------------------------------------------------
module('J.ps', {
  setup: function () {
    J.module('s1', {
      $ps: null,

      init: function () {
        var t = this;
        this.$ps.subscribe('p.one', function () {
          t._received = true;
        });
      }
    });
    
    J.module('s2', {
      $ps: null,

      init: function () {
        var t = this;
        this.$ps.subscribe('p.one.two', function () {
          t._received = true;
        });
      }
    });
    
    J.module('s3', {
      $ps: null,

      init: function () {
        var t = this;
        this.$ps.subscribe('p.one.*', function () {
          t._received = true;
        });
      }
    });    
    
    J.module('s4', {
      $ps: null,

      init: function () {
        var t = this;
        this.$ps.subscribe('p.*', function () {
          t._received = true;
        });
      }
    });
    
    J.module('s5', {
      $ps: null,

      init: function () {
        var t = this;
        this.$ps.subscribe('*', function () {
          t._received = true;
        });
      }
    }); 
    
    J.init();
  },
  teardown: function () {
    J.clear('s1', 's2', 's3', 's4', 's5');
  }

});

test('subscribe topic', function () {
  J.get('ps').publish('p');
  notReceived('s1');
  notReceived('s2');
  notReceived('s3');
  notReceived('s4');
  received('s5');
});

test('subscribe one depth topic', function () {
  J.get('ps').publish('p.one');
  received('s1');
  notReceived('s2');
  notReceived('s3');
  received('s4');
  received('s5');
});

test('subscribe two depth topic', function () {
  J.get('ps').publish('p.one.two');
  notReceived('s1');
  received('s2');
  received('s3');
  received('s4');
  received('s5');
});

test('* subscribe all topic', function () {
  J.get('ps').publish('');
  notReceived('s1');
  notReceived('s2');
  notReceived('s3');
  notReceived('s4');
  received('s5');
});

