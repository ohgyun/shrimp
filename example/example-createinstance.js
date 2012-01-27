

J.module({
  package: 'example',
  id: 'list',
  singleton: true,
  modules: ['item']
}, {
  createItem: function () {
    this.__item.new()
     
  }
  
});


J.module({
  package: 'example',
  id: 'item',
  singleton: false
}, {
  init: function () {
   
  }
});