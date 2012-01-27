/**
 * Implementation example of search box
 * With config parameter
 * File name: example.searchbox.js
 */
J.module({
  package: 'example',
  id: 'searchbox',
  singleton: false, // is singleton? default: true
  autostart: true, // start automatically when framework initialized. default: false
  libraries: ['ps', 'dom', 'event'], //--> this.$ps, this.$dom, this.$event
  modules: ['a1', 'a2'] //--> this.__a1, this.__a2 in same package
}, {
  init: function () {
    this.$dom.node('#searchbox', {
      query: '.query',
      submitBtn: '.submit'
    }, this);
     
    this.$event.bind([
      {node: 'query', type: 'focus'},
      {node: 'query', type: 'blur'},
      {node: 'query', type: 'keydown'},
      {node: 'submitBtn', type: 'click'}
    ], this);
  },
  
  onFocusQuery: function () {
    
  },
  
  onBlurQuery: function () {
    
  },
  
  onClickSubmitBtn: function () {
    this.search();
  },
  
  onKeydownQuery: function () {
    this.search(); 
  },
  
  search: function () {
    var value = this._nodes.query.value();
    this.$ps.publish('example.searchbox.search', {
      query: value
    });
  }

});