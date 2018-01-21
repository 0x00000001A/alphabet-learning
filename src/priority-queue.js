/* @flow */

var Utils = require('./utils');

var PriorityQueue = (function() {
  /**
   * Priority queue implementation
   * `numA >> numB` used for implement integer division
   *
   * Root node is `_nodes[1]`
   * Child of node `i` stores in `2 * i` and `2 * i + 1`
   *
   * @see http://synset.com/ai/ru/data/Queue.html for details
   * @param { Number | undefined } size Queue size
   */
  function PriorityQueue(size?: number) {
    if (!size) {
      size = 1000;
    }

    this._size = 0;
    this._nodes = new Array(size);
    this._comparator = this._defaultComparator;
  }

  PriorityQueue.prototype = {
    constructor: PriorityQueue,

    /**
     * Get size
     * @returns { number }
     */
    size: function(): number {
      return this._size;
    },

    /**
     * Add an element to queue
     * @param { * } value Element to be added
     */
    push: function(value: any) {
      this._nodes[++this._size] = value;

      for (
        var i = this._size;
        i > 1 && this.compare(this._nodes[i], this._nodes[i >> 1]);
        i = i >> 1
      ) {
        this.swap(i, i >> 1);
      }
    },

    /**
     * Check, if a is less than b using
     * Calls a `_comparator`
     * @param { * } a
     * @param { * } b
     * @returns { Boolean }
     */
    compare: function(a: any, b: any): boolean {
      return this._comparator(a, b);
    },

    /**
     * Takes an element from the queue with minimal value and rebuilds the queue
     * @returns { * }
     */
    shift: function(): any {
      if (this._size === 0) {
        return;
      }

      this.swap(1, this._size);
      this.rebuild(1);

      return this._nodes[this._size--];
    },

    /**
     * Swap in tree i with a
     * @param { * } i
     * @param { * } a
     */
    swap: function(i: any, j: any) {
      var a = this._nodes[i];

      this._nodes[i] = this._nodes[j];
      this._nodes[j] = a;
    },

    /**
     * Rebuild the tree
     */
    rebuild: function(node: number) {
      var lf = 2 * node;

      if (lf < this._size) {
        var rt = lf + 1;

        if (rt < this._size && this.compare(this._nodes[rt], this._nodes[lf])) {
          lf = rt;
        }

        if (this.compare(this._nodes[lf], this._nodes[node])) {
          this.swap(node, lf);
          this.rebuild(lf);
        }
      }
    },

    /**
     * Set custom comparator
     * @param { function } comparator
     */
    setComparator: function(comparator: (a: any, b: any) => boolean) {
      this._comparator = comparator;
    },

    /**
     * Default comparator. Simply checks if a is less than b
     * @private
     * @param { number } a
     * @param { number } b
     * @returns { Boolean }
     */
    _defaultComparator: function(a: number, b: number): boolean {
      return a < b;
    }
  };

  return PriorityQueue;
})();

module.exports = PriorityQueue;
