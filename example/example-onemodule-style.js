/**
 * Implementation example of search box
 */

J.module('example.searchbox', {
  
  $ps: null,
  
  $dom: null,
  
  $event: null,
  
  _nodes: null,
  
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