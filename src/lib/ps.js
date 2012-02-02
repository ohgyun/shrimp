/**
 * Pub/Sub Library
 */
Shrimp.library('ps', {

  $core: null,
  
  $util: null,

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
    var callbackId = this.$util.guid();
    
    this.eachSubscriberMapDepth(topic, function (messageName, currentMap, parentMap, isLast) {
      if (isLast) {
        currentMap[callbackId] = callback; 
      }
    });

    return callbackId;
  },  
  
  /**
   * Do callback for each subscribers map depth
   *
   * @param {string} topic
   * @param {function(string, Object, Object, boolean)} callback(messageName, currentMap, parentMap, isLast)
   */
  eachSubscriberMapDepth: function (topic, callback) {
    var parentMap = this._subscribersMap,
      topics = topic.split('.'),
      len = topics.length,
      messageName, currentMap;
    
    for (var i = 0; i < len; i++) {
      messageName = topics[i];
      currentMap = parentMap[messageName] = (parentMap[messageName] || {});
            
      callback(messageName, currentMap, parentMap, i + 1 === len); 
      
      parentMap = currentMap;
    }
  },

  /**
   * Unsubscribe specific callback
   * @param {string} topic
   * @param {string} callbackId
   */
  unsubscribe: function (topic, callbackId) {
    this.eachSubscriberMapDepth(topic, function (messageName, currentMap, parentMap, isLast) {
      if (isLast) {
        delete currentMap[callbackId]; 
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
      runCallback = function (currentMap) {
        t.$core.eachProperty(currentMap, function (callbackId, callback) {
          if (typeof callback === 'function') {
            callback(data, topic);
          }
        });
      };
    
    this.eachSubscriberMapDepth(topic, function (messageName, currentMap, parentMap, isLast) {
      runCallback(parentMap['*']);
      
      if (isLast) {
        runCallback(currentMap);
      }
    });
  },  

  /**
   * Remove subscribers of specific topic
   * @param {string} topic
   */
  clear: function (topic) {
    this.eachSubscriberMapDepth(topic, function (messageName, currentMap, parentMap, isLast) {
      if (isLast) {
        delete map[messageName];  
      }
    });
  }
});
