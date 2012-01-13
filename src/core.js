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
   * @type {Object.<string, Object<string, Object>>}
   * {
   *   namespace: {
   *     module: {},
   *     module: {}
   *   },
   *   namespace: {
   *   },
   * }
   */
  _modules: {},

  /**
   * Prefix of library reference
   */
  PREFIX_LIBRARY: '$',
  
  /**
   * Prefix of module reference
   */
  PREFIX_MODULE: '__',
  
  /**
   * Module name pattern. 'namespaceName.moduleName' is allowed.
   */
  _rModuleName: /^([a-z]+)\.([a-z]+)$/i,
  
  /**
   * Register library
   * @param {string} name Library name
   * @param {!Object} obj Library object
   */
  library: function (name, obj) {
    this._libraries[name] = obj;
  },
 
  /**
   * Define module namespace.
   * A namespace is a object and can have modules.
   * @param {string} namespaceName
   * @public
   */
  namespace: function(namespaceName) {
    this._modules[namespaceName] = {
      name: namespaceName
    };
  },
 
  /**
   * Register module.
   * Module name should be like 'namespaceName.moduleName' pattern.
   * For the sake of simplicity, a module can have no child module.
   * If namespace does not exist, it is created automatically.
   * @param {string} fullName Module's full name including namespace.
   *     A fullName should be like 'namespaceName.moduleName'.
   *     'name' and 'fullName' property of obj is setted automatically.
   * @param {!Object} obj Module object.
   * @public
   */
  module: function (fullName, obj) {
    var parsed = this.parseFullName(fullName),
      namespaceName = parsed.namespaceName,
      moduleName = parsed.moduleName,
      namespace = this._modules[namespaceName];
      
    if (typeof namespace === 'undefined') {
      this.namespace(namespaceName);
    }
      
    obj.fullName = fullName;
    obj.name = moduleName;
    
    this._modules[namespaceName][moduleName] = obj;
  },
  
  /**
   * Seperates namespace name and module name from fullName.
   * @param {string} fullName
   */
  parseFullName: function (fullName) {
    var m = this._rModuleName.exec(fullName);
    
    if ( ! m) {
      throw 'Module name "' + fullName + '" is not valid. The module name must be like "namespaceName.moduleName" pattern.';
    }
    
    return {
      namespaceName: m[1],
      moduleName: m[2]
    };
  },
  
  /**
   * Initialize framework.
   * Inject library dependencies.
   * @public
   */
  init: function () {
    this._libraries['core'] = this;
    
    this.injectDependencyLibraryToLibarary();
    this.injectDependencyLibraryToModule();
    this.injectDependencyModuleToModule();
  },
  
  /**
   * Inject library dependency between each library.
   * A library is injected as '$name' to target library's member variable.
   */
  injectDependencyLibraryToLibarary: function () {
    var t = this;
    t.eachLibrary(function (libraryName, library) {
      t.injectLibraryDependency(library);
    });    
  },
  
  /**
   * Inject library dependency to each module.
   * A library is injected as '$name' to target module's member variable.
   */
  injectDependencyLibraryToModule: function () {
    var t = this;
    t.eachModule(function (moduleName, module) {
      t.injectLibraryDependency(module);
    });    
  },
  
  /**
   * Inject module dependency between each module.
   * A module is injected as '__name' to target module's member variable.
   * Modules can only access in same namespace.
   * e.g. 'foo.one' module can access to 'foo.two' module, but can't access 'bar.one' module.
   */
  injectDependencyModuleToModule: function () {
    var t = this;
    t.eachNamespace(function (namespaceName, namespace) {
      t.eachProperty(namespace, function (moduleName, module) {
        t.eachProperty(module, function (k, v) {
          if (k.substring(0, 2) === t.PREFIX_MODULE) {
            var moduleName = k.substring(2);
            this[k] = t._modules[namespaceName][moduleName];
          }
        });
      });
    });
  },

  /**
   * Inject library dependency to member variables of module that start with '$'.
   * e.g. if module has $some variable, library 'some' is assigned to $some.
   * @param {!Object} target
   */
  injectLibraryDependency: function (target) {
    var t = this;
    t.eachProperty(target, function (k, v) {
      if (k.substring(0, 1) === t.PREFIX_LIBRARY) {
        var libName = k.substring(1);
        this[k] = t._libraries[libName];
      }
    });
  },

  /**
   * Do callback for each library
   * @param {function(string libraryName, !Object library)} callback
   */
  eachLibrary: function (callback) {
    var libs = this._libraries;
    this.eachProperty(libs, callback);
  },
  
  /**
   * Do callback for each namespace
   * @param {function(string namespaceName, !Object namespace)} callback
   */
  eachNamespace: function (callback) {
    var namespaces = this._modules;
    this.eachProperty(namespaces, callback);
  },

  /**
   * Do callback for each module
   * @param {function(string moduleName, !Object module)} callback
   */
  eachModule: function (callback) {
    var t = this;
    this.eachNamespace(function (name, obj) {
      t.eachProperty(obj, callback);
    });
  },

  /**
   * Do callback for each property
   * @param {!Object} obj
   * @param {function(this:obj, string k, * v)} callback
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
   * Start all modules.
   * @public
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
   * @param {string} fullName
   * @public
   */
  start: function (fullName) {
    var parsed = this.parseFullName(fullName)
      module = this._modules[parsed.namespaceName][parsed.moduleName];

    if (typeof module.init === 'function') {
      module.init();
    }
  },

  /**
   * Stop all modules
   * @public
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
   * @param {string} fullName
   * @public
   */
  stop: function (fullName) {
    var parsed = this.parseFullName(fullName)
      module = this._modules[parsed.namespaceName][parsed.moduleName];
      
    if (typeof module.destroy === 'function') {
      module.destroy();
    }
  }
};
