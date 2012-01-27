
J.module({
  package: 'example',
  id: 'searchbox_view',
  libraries: ['mvc']
}, {
  init: function () {
    this.$mvc.view(this); 
  }
});



J.module({
  package: 'example',
  id: 'searchbox_model'
  libraries: ['mvc']
}, {
  init: function () {
    this.$mvc.model(this); 
  }
  
});