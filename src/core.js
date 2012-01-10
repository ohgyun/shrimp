/**
 * j-framework
 * 
 * j-framework is a simple javascript framework.
 * The important point of this framework is clarifying dependencies between modules.
 *
 * @author ohgyun@gmail.com
 * @version 0.1
 */
if ( ! window.J) window.J = {

  /**
   * Libraries. Modules can access a library by 'this.$libraryName' variable.
   * @type {Object.<string, Object>}
   */
  _libraries: {},

  /**
   * Modules
   * @type {Object.<string, Object>}
   */
  _modules: {},

  /**
   * Register library
   * @param {string} name Library name
   * @param {!Object} obj Library object
   */
  library: function (name, obj) {
    this._libraries[name] = obj;
  },
 
  /**
   * Register module.
   * @param {string} name Module name. 'name' property of obj is setted by this name.
   * @param {!Object} obj Module object.
   */
  module: function (name, obj) {
    obj.name = name;
    this.injectLibraryDependency(obj);
    this._modules[name] = obj;
  },

  /**
   * Inject library dependency to member variables of module that start with '$'.
   * e.g. if module has $some variable, library 'some' is assigned to $some.
   */
  injectLibraryDependency: function (obj) {
    var t = this;
    t.eachProperty(obj, function (k, v) {
      if (k.substring(0, 1) === '$') {
        var libName = k.substring(1);
        this[k] = t._libraries[libName];
      }
    });
  },

  /**
   * Do callback for each module
   * @param {function(string, !Object)} callback
   */
  eachModule: function (callback) {
    var ms = this._modules;
    this.eachProperty(ms, callback);
  },

  /**
   * Do callback for each property
   * @param {!Object} obj
   * @param {function(this:obj, string, *)} callback
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
   * Do callback for each array
   * @param {Array} arr
   * @param {function(number, *)} callback
   */
  each: function (arr, callback) {
    var i, v, len = arr.length;
    for (i = 0; i < len; i++) {
      v = arr[i];
      callback.call(arr, i, v);
    }
  },  

  /**
   * Start all modules.
   */
  startAll: function () {
    this.eachModule(function (name, obj) {
      if (typeof obj.init === 'function') {
        obj.init();
      }
    });
  },

  /**
   * Start module
   * @param {string} moduleName
   */
  start: function (moduleName) {
    var module = this._modules[moduleName];
    if (typeof module.init === 'function') {
      module.init();
    }
  },

  /**
   * Stop all modules
   */
  stopAll: function () {
    this.eachModule(function (name, obj) {
      if (typeof obj.destroy === 'function') {
        obj.destroy();
      }
    });
  },

  /**
   * Stop module
   * @param {string} moduleName
   */
  stop: function (moduleName) {
    var module = this._modules[moduleName];
    if (typeof module.destroy === 'function') {
      module.destroy();
    }

  },
  
  /**
   * Create random unique id
   * @return {string} Random id.
   */
  guid: function () {
    return 'j' + (Math.random() * (1 << 30)).toString(32).replace('.', '');
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
