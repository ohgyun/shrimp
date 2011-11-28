if (!window.J) window.J = {

  _modules: {},
 
  module: function (name, obj) {
    this._modules[name] = obj;
  },

  init: function () {
    this.injectDependency();
    this.initModules();
  },

  injectDependency: function () {
    var t = this;
    t.eachModule(function (name, obj) {
      t.eachProperty(obj, function (k, v) {
        if (k.substring(0, 1) === '$') {
          var refName = k.substring(1);
          this[k] = t.get(refName);
        }
      });
    });
  },

  /**
   * @param callback(name, obj)
   */
  eachModule: function (callback) {
    var ms = this._modules;
    this.eachProperty(ms, callback);
  },

  /**
   * @param obj
   * @param callback(k, v)
   */
  eachProperty: function (obj, callback) {
    var k, v;
    for (k in obj) {
      if (obj.hasOwnProperty(k)) {
        v = obj[k];
        callback.call(obj, k, v);
      }
    }
  },

  get: function (name) {
    return this._modules[name];
  },

  initModules: function () {
    this.eachModule(function (name, obj) {
      if (typeof obj.init === "function") {
        obj.init();
      }
    });
  },

  clear: function (name) {
    delete this._modules[name];
  }

};
window.setTimeout(function () {
  if (window.oAsyncInit && !window.oAsyncInit.hasRun) {
    window.oAsyncInit.hasRun = true;
    window.oAsyncInit();
  }
}, 0);


J.module('util', {
  
  /**
   * @param arr
   * @param callback(i, v)
   */
  eachArray: function (arr, callback) {
    var i, v, len = arr.length;
    for (i = 0; i < len; i++) {
      v = arr[i];
      callback.call(arr, i, v);
    }
  },

  /**
   * @param obj
   * @param callback(k, v)
   */
  eachProperty: function (obj, callback) {
    var k, v;
    for (k in obj) {
      if (obj.hasOwnProperty(k)) {
        v = obj[k];
        callback.call(obj, k, v);
      }
    }
  },

  /**
   * @param fn
   * @param context
   * @param data, ...
   */
  bind: function (fn, context) {
    var slice = Array.prototype.slice,
      args = slice.call(arguments, 2);

    return function () {
      fn.apply(context, args.concat(slice.call(arguments))); 
    };
  },

  guid: function () {
    return 'g' + (Math.random() * (1 << 30)).toString(32).replace('.', '');
  }
});

/**
 * Pub/Sub Module
 */
J.module('ps', {

  $util: null,

  /**
   * {
   *   topic: {
   *     callbackId: callback,
   *     ...
   *   },
   *   ...
   * }
   */
  _subscribersMap: {},

  /**
   * @param topic
   * @param callback(data)
   * @return subscribed callback id
   */
  subscribe: function (topic, callback) {
    var map = this._subscribersMap,
      callbackId = this.$util.guid();

    if (!map[topic]) {
      map[topic] = {};
    }

    map[topic][callbackId] = callback;

    return callbackId;
  },

  unsubscribe: function (topic, callbackId) {
    var subscribers = this._subscribersMap[topic];
    delete subscribers[callbackId];
  },

  publish: function (topic, data) {
    var subscribers = this._subscribersMap[topic];
    this.$util.eachProperty(subscribers, function (k, v) {
      v(data);
    });
  },

  clear: function (topic) {
    delete this._subscribersMap[topic];
  }

});
