var Utils = require('./utils');

var PriorityQueue = (function() {
  /**
   * Priority queue implementation
   * `numA >> numB` used for implement integer division
   *
   * Root node is `__nodes[1]`
   * Child of node `i` stores in `2 * i` and `2 * i + 1`
   *
   * @see http://synset.com/ai/ru/data/Queue.html for details
   * @param { Number | undefined } size Queue size
   */
  function PriorityQueue(size) {
    if (!size) {
      size = 1000;
    }

    this.__size = 0;
    this.__nodes = new Array(size);
    this.__comparator = this.__defaultComparator;
  }

  PriorityQueue.prototype = {
    constructor: PriorityQueue,

    /**
     * Get size
     * @returns { Number }
     */
    size: function() {
      return this.__size;
    },

    /**
     * Add an element to queue
     * @param { * } value Element to be added
     */
    push: function(value) {
      this.__nodes[++this.__size] = value;

      for (
        var i = this.__size;
        i > 1 && this.compare(this.__nodes[i], this.__nodes[i >> 1]);
        i = i >> 1
      ) {
        this.swap(i, i >> 1);
      }
    },

    /**
     * Check, if a is less than b using
     * Calls a `__comparator`
     * @param { * } a
     * @param { * } b
     * @returns { Boolean }
     */
    compare: function(a, b) {
      return this.__comparator(a, b);
    },

    /**
     * Takes an element from the queue with minimal value and rebuilds the queue
     * @returns { * }
     */
    shift: function() {
      if (this.__size === 0) {
        return;
      }

      this.swap(1, this.__size);
      this.rebuild(1);

      return this.__nodes[this.__size--];
    },

    /**
     * Swap in tree i with a
     * @param { * } i
     * @param { * } a
     */
    swap: function(i, j) {
      var a = this.__nodes[i];

      this.__nodes[i] = this.__nodes[j];
      this.__nodes[j] = a;
    },

    /**
     * Rebuild the tree
     */
    rebuild: function(node) {
      var lf = 2 * node;

      if (lf < this.__size) {
        var rt = lf + 1;

        if (
          rt < this.__size &&
          this.compare(this.__nodes[rt], this.__nodes[lf])
        ) {
          lf = rt;
        }

        if (this.compare(this.__nodes[lf], this.__nodes[node])) {
          this.swap(node, lf);
          this.rebuild(lf);
        }
      }
    },

    /**
     * Set custom comparator
     * @param { function } comparator
     */
    setComparator: function(comparator) {
      this.__comparator = comparator;
    },

    /**
     * Default comparator. Simply checks if a is less than b
     * @private
     * @param { * } a
     * @param { * } b
     * @returns { Boolean }
     */
    __defaultComparator: function(a, b) {
      return a < b;
    }
  };

  return PriorityQueue;
})();

module.exports = PriorityQueue;
