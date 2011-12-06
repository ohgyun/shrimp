/**
 * j-framework
 * 
 * j-framework is a simple javascript framework.
 * The important point of this framework is clarifying dependencies between modules.
 *
 * @author ohgyun@gmail.com
 * @version 0.1
 */
if (!window.J) window.J = {

  _modules: {},
 
  /**
   * define module
   * @param name (string) module name. 'name' property of obj is setted by this name.
   * @param obj (object) object. obj is not function.
   */
  module: function (name, obj) {
    obj.name = name;
    this._modules[name] = obj;
  },

  /**
   * init framework.
   * inject module dependency and init each module.
   */
  init: function () {
    this.module('core', this);
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
   * Do callback for each array
   * @param arr
   * @param callback(i, v)
   */
  each: function (arr, callback) {
    var i, v, len = arr.length;
    for (i = 0; i < len; i++) {
      v = arr[i];
      callback.call(arr, i, v);
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
      if (typeof obj.init === 'function' && name !== 'core') {
        obj.init();
      }
    });
  },

  /**
   * destroy module
   * @param name name[, name, ...]
   */
  destroy: function () {
    var args = Array.prototype.slice.call(arguments),
      modules = this._modules;
      
    this.each(args, function (i, v) {
      var module = modules[v];
      if (module && typeof module.destroy === 'function') {
        module.destroy(); 
      }
      delete modules[v];
    });
  },
  
  /**
   * Create random unique id
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