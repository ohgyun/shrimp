if (!window.J) window.J = {

  _modules: {},
 
  module: function (name, obj) {
    this._modules[name] = obj;
  },

  init: function () {
    this.injectDependency();
    this.initModules();
  },

  /**
   * Inject module dependency to variables that start with '$'.
   * e.g. if object has $some variable, module 'some' is assigned to $some.
   */
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

  /**
   * get module by name
   */
  get: function (name) {
    return this._modules[name];
  },

  /**
   * init method of each module is called
   */
  initModules: function () {
    this.eachModule(function (name, obj) {
      if (typeof obj.init === 'function') {
        obj.init();
      }
    });
  },

	/**
	 * clear module
	 * @param name name[, name, ...]
	 */
  clear: function () {
    var args = Array.prototype.slice.call(arguments),
    	modules = this._modules,
    	i, len = args.length;
    	
    for (i = 0; i < len; i++) {
    	delete modules[args[i]];
    }
  }

};
/**
 * call async init function if script downloaded
 */
window.setTimeout(function () {
  if (window.jAsyncInit && !window.jAsyncInit.hasRun) {
    window.jAsyncInit.hasRun = true;
    window.jAsyncInit();
  }
}, 0);


/**
 * Util Module
 */
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
    return 'j' + (Math.random() * (1 << 30)).toString(32).replace('.', '');
  }
});

/**
 * Pub/Sub Module
 */
J.module('ps', {

  $util: null,

  /**
   * subscribers map.
   * e.g. If you subscribe 'some.one.*' and 'some.two',..
   * {
   *   some: {
   *     one: {
   *       *: {
   *         callbackId: callback
   *       }
   *     }
   *   },
   *   two: {
   *     callbackId: callback
   *   }
   * }
   */
  _subscribersMap: {},

  /**
   * Subscribe topic.
   * You can seperate topics by dot(.), and subscribe all topics using asterisk(*).
   * e.g. 'some.topic.*'
   *
   * @param topic string or *
   * @param callback(data)
   * @return subscribed callback id
   */
  subscribe: function (topic, callback) {
  	var callbackId = this.$util.guid();
  	
  	this.eachSubscriberMapDepth(topic, function (n, m, map, isLast) {
  		if (isLast) {
  		  m[callbackId] = callback;	
  		}
  	});

    return callbackId;
  },  
  
  /**
   * Do callback for each subscribers map depth
   *
   * @param topic
   * @param callback(n, m, map, isLast)
   *           n (string) depth name
   *           m (object) current map
   *           map (object) parent map
   *           isLast (boolean) is last depth
   */
  eachSubscriberMapDepth: function (topic, callback) {
  	var map = this._subscribersMap,
  	  topics = topic.split('.'),
  	  len = topics.length,
  	  n, m;
  	
  	for (var i = 0; i < len; i++) {
  		n = topics[i];
  		m = map[n] = (map[n] || {});
  		  		
  		callback(n, m, map, i + 1 === len);	
  		
  		map = m;
  	}
  },

  unsubscribe: function (topic, callbackId) {
  	this.eachSubscriberMapDepth(topic, function (n, m, map, isLast) {
  		if (isLast) {
  		  delete m[callbackId];	
  		}
  	});
  },

  publish: function (topic, data) {
    var t = this,
      runCallback = function (m) {
    		t.$util.eachProperty(m, function (k, v) {
    			if (typeof v === 'function') {
    				v(data);
    			}
    		});
    	};
    
    this.eachSubscriberMapDepth(topic, function (n, m, map, isLast) {
    	runCallback(map['*']);
    	
    	if (isLast) {
    		runCallback(m);
    	}
    });
  },  

  clear: function (topic) {
  	this.eachSubscriberMapDepth(topic, function (n, m, map, isLast) {
  		if (isLast) {
  		  delete map[n];	
  		}
  	});
  }
});
