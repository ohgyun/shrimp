/**
 * Pub/Sub Module
 */
J.module('ps', {

  $core: null,

  /**
   * Subscribers map.
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
   * @param callback(data, topic)
   * @return subscribed callback id
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

  /**
   * Unsubscribe specific callback
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
   * @param topic (string) The topic has seperator dot('.'), and does not recommand include '*'.
   * @param data (object)
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
   */
  clear: function (topic) {
    this.eachSubscriberMapDepth(topic, function (n, m, map, isLast) {
      if (isLast) {
        delete map[n];  
      }
    });
  }
});
