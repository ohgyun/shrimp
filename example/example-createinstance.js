

J.module({
  package: 'example',
  id: 'list',
  singleton: true,
  modules: ['item']
}, {
  createItem: function () {
    var item = this.__item.new();
    item.set(data);
    
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


J.module({
  package: 'example',
  id: 'item',
  singleton: false,
  type: 'model',
  url: '/list/item/:id'
}, {
  save: function () {}, // save to server
  fetch: function () {}, // fetch from server
  
 
});


J.library({
  id: 'ps'
}, {


});
