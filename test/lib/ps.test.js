module('Shrimp.ps', {
  setup: function () {
    ps().$core = Shrimp;
  
    // Set mock util libarary
    MOCK_CALLBACK_ID = 'mock-callback-id';
    ps().$util = {
      guid: function () {
        return MOCK_CALLBACK_ID; 
      }
    };
  
  },
  teardown: function () {
    Shrimp._modules = {};
    ps()._subscribersMap = {};
  }

});

/**
 * Get ps library
 * @return {Object} ps library
 */
function ps() {
  return Shrimp._libraries['ps'];
}

/**
 * mock guid returns string
 * @param {string} s
 */
function guidReturns(s) {
  MOCK_CALLBACK_ID = s;
}

test('subscribe one depth', function () {
  var expectedCallbackId = 'A';
  guidReturns(expectedCallbackId);
  
  var callback = mockFunction();
  var callbackId = ps().subscribe('msg', callback);
  
  equals(expectedCallbackId, callbackId, 'subscribe() returns subscribed callback id');
  equals(callback, ps()._subscribersMap['msg'][expectedCallbackId], 'callback saved to subscribers map by callbackId');
});

test('subscribe two depth', function () {
  var expectedCallbackId = 'A';
  guidReturns(expectedCallbackId);
  
  var callback = mockFunction();
  ps().subscribe('some.msg', callback);
  
  equals(callback, ps()._subscribersMap['some']['msg'][expectedCallbackId]);
});

test('subscribe multiple message', function () {
  guidReturns('A');
  var callbackA = mockFunction();
  
  // subscribe one
  ps().subscribe('some.one', callbackA);
  
  guidReturns('B');
  var callbackB = mockFunction();
  
  // subscribe two
  ps().subscribe('some.two', callbackB);
  
  
  equals(callbackA, ps()._subscribersMap['some']['one']['A']);
  equals(callbackB, ps()._subscribersMap['some']['two']['B']);
});

test('unsubscribe', function () {
  guidReturns('A');
  var callback = mockFunction();
  var callbackId = ps().subscribe('some.one', callback);
  
  equals(callback, ps()._subscribersMap['some']['one']['A']);
  
  // unsubscribe specific callback by id
  ps().unsubscribe('some.one', callbackId);
  
  equals(undefined, ps()._subscribersMap['some']['one']['A']);
});

test('publish', function () {
  var callback = mockFunction();
  ps().subscribe('some.one', callback);
  
  ps().publish('some.one');
  
  verify(callback, times(1))();
});

test('subscribe with wildcard', function () {
  var callback = mockFunction();
  ps().subscribe('some.*', callback); // subscribe all children of some
  
  ps().publish('some'); // not subscribed
  ps().publish('some.one');
  ps().publish('some.two');
  ps().publish('some.two.three');
  
  verify(callback, times(3))();
});

test('subscribe all message', function () {
  var callback = mockFunction();
  ps().subscribe('*', callback);
  
  ps().publish('one');
  ps().publish('two');
  ps().publish('one.two.three');
  
  verify(callback, times(3))();
});



