/**
 * Util Library
 */
Shrimp.library('util', {
  /**
   * Create random unique id
   * @return {string} Random id.
   */
  guid: function () {
    return 'j' + (Math.random() * (1 << 30)).toString(32).replace('.', '');
  }
});


