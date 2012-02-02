

// @param {Object} config
// @param {Object} object
Shrimp.module({
  package: 'example',
  id: 'foo',
  plugins: ['a'], // wrapped by plugin 'a'
  libraries: ['b'], //-> this.$b
  modules: ['c'] //-> this.__c
}, {
  plugin_options: {
    'a': {
       
    }
  }
});


// Define plugin
Shrimp.plugin('a', {
  init: function (module, config) {
    // module = target object
    // config = plugin_options.a
  }
});


// Define library
Shrimp.library('b', {
  
});
