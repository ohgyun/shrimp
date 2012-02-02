module('Shrimp.util', {});

function util() {
  return Shrimp._libraries['util']; 
}

test('guid', function () {
  var id = util().guid();
  equals('j', id.substring(0, 1), 'guid start with j');
});