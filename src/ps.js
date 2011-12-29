/**
 * Pub/Sub Module
 */
J.module('ps', {

  $core: null,

  /**
   * Subscribers map.
   * @type {Object.<string, Object.<string, function>}
   * @example If you subscribe 'some.one.*' and 'some.two',..
   *     {
   *       some: {
   *         one: {
   *           *: {
   *             callbackId: callback
   *           }
   *         },
   *         two: {
   *           callbackId: callback
   *         }
   *       }
   *     }
   */
  _subscribersMap: {},

  /**
   * Subscribe topic.
   * You can seperate topics by dot(.), and subscribe all topics using wildcard(*).
   * e.g. 'some.topic.*'
   *
   * @param {string} topic Topic
   * @param {function(?Object, string)} callback(data, topic)
   * @return {string} Subscribed callback id
   */
  subscribe: function (topic, callback) {
    var callbackId = this.$core.guid();
    
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
   * @param {string} topic
   * @param {function(string, Object, Object, boolean)} callback(n, m, map, isLast)
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

  /**
   * Unsubscribe specific callback
   * @param {string} topic
   * @param {string} callbackId
   */
  unsubscribe: function (topic, callbackId) {
    this.eachSubscriberMapDepth(topic, function (n, m, map, isLast) {
      if (isLast) {
        delete m[callbackId]; 
      }
    });
  },

  /**
   * Publish topic with data
   * @param {string} topic The topic has seperator dot('.'), and does not recommand include '*'.
   * @param {?Object=} data
   */
  publish: function (topic, data) {
    var t = this,
      runCallback = function (m) {
        t.$core.eachProperty(m, function (k, v) {
          if (typeof v === 'function') {
            v(data, topic);
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

  /**
   * Remove subscribers of specific topic
   * @param {string} topic
   */
  clear: function (topic) {
    this.eachSubscriberMapDepth(topic, function (n, m, map, isLast) {
      if (isLast) {
        delete map[n];  
      }
    });
  }
});
