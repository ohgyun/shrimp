/**
 * Util Module
 */
J.module('util', {
  


  /**
   * Do callback for each property
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
   * Create random unique id
   */
  guid: function () {
    return 'j' + (Math.random() * (1 << 30)).toString(32).replace('.', '');
  }
});