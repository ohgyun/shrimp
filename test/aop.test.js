module('J.aop', {
  setup: function () {  
    window.o = J.get('aop');
    
    J.module('mockA', {
      _name: 'mockA',
      getName: function () {
        return this._name; 
      }
    });
    
    J.module('mockB', {
      _name: 'mockB',
      getName: function () {
        return this._name;
      }
    });
    
    J.module('C', {
      _name: 'mockC',
      getName: function () {
        return this._name; 
      }
    });
    
    J.init();
  },
  teardown: function () {
    J.destroy('mockA', 'mockB', 'C');
  }
});

test('apply aop to object', function () {
  // TODO 
});
