
// 1. print list of item
// 2. click 'x' button to remove

// productlist.item.js
J.module({
  package: 'productlist',
  id: 'item',
  plugins: ['model'],
  singleton: false,
  autostart: false,
  libraries: [],
  modules: []
}, {
  plugin_options: {
    model: {
      url: '/product/item/:id'
    }
  }
});


// productlist.item_view.js
J.module({
  package: 'productlist',
  id: 'item_view',
  plugins: ['view']
}, {
  plugin_options: {
    view: {
      templateId: 'tmpl-product-item',
      modelId: 'item'
    }
  }
});


// productlist.list.js
J.module({
  package: 'productlist',
  id: 'list',
  singleton: true,
  plugins: ['models']
  libraries: [],
  modules: []
}, {
  plugin_options: {
    models: {
      url: '/product/list/p:page',
      modelId: 'item'
    }
  }
});

// productlist.list_view.js
J.module({
  package: 'productlist',
  id: 'list_view',
  plugins: ['view'],
  libraries: [],
  modules: []
}, {
  plugin_options: {
    view: {
      templateId: 'j-productlist-list-tmpl',
      modelId: 'list'
    }
  }

});

// productlist.main.js
J.module({
  package: 'productlist',
  id: 'main',
  libraries: [],
  modules: ['list']
}, {
  init: function () {
    this.loadList();
  },
  loadList: function () {
    this.__list.fetch();
  }
});

// main.js
J.init();
J.start({
  productlist: null // call todolist.main#init()
});
