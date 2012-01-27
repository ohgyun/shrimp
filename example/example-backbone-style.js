/**
 * Implementation example of search box
 */
J.model({
  package: 'example',
  id: 'searchbox'
}, {
  
});


J.view({
  package: 'example',
  id: 'searchbox'
}, {
  
  el: '#searchbox',
  
  events: {
    'focus .query': 'onFocusQuery',
    'blur .query': 'onBlurQuery',
    'keydown .query': 'onKeydownQuery',
    'click .submit': 'onClickSubmit' 
  },
  
  
  
});