/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

function everyIterator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push(num);
      callback(num % 2);
    }, num * 30);
  };
}

function everyIteratorWithError(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push(num);
      callback(null, num % 2);
    }, num * 30);
  };
}

function everyIteratorWithKey(order) {

  return function(num, key, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push([num, key]);
      callback(num % 2);
    }, num * 30);
  };
}

function everyIteratorWithKeyAndError(order) {

  return function(num, key, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push([num, key]);
      callback(null, num % 2);
    }, num * 30);
  };
}

describe('#every', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.every(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 2]);
      done();
    });
  });

  it('should execute iterator by collection of array and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.every(collection, everyIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 2]);
      done();
    });
  });

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 1, 5];
    async.every(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, [1, 1, 3, 5]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.every(collection, everyIteratorWithKey(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [1, 0],
        [2, 2]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.every(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [2]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.every(collection, everyIteratorWithKey(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key and get 2rd callback argument', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.every(collection, everyIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.every(collection, everyIteratorWithKey(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator with binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };

    async.every(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 3, 4]);
      done();
    }, Math);
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.every([], everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.every(function() {}, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.every(undefined, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.every(null, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

});

describe('#everySeries', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.everySeries(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.everySeries(collection, everyIteratorWithKey(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [1, 0],
        [3, 1],
        [2, 2]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of array and get callback 2rd argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.everySeries(collection, everyIteratorWithError(order), function(err, res) {
      console.log(err, res);
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index and get callback 2rd argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.everySeries(collection, everyIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [1, 0],
        [3, 1],
        [2, 2]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 1, 5];
    async.everySeries(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, [1, 3, 1, 5]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.everySeries(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [4]);
      done();
    });
  });

  it('should execute iterator with binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };

    async.everySeries(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 4]);
      done();
    }, Math);
  });

  it('should throw error if double callback', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      callback(true);
      callback(true);
    };
    try {
      async.everySeries(collection, iterator);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.everySeries([], everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.everySeries(function() {}, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.everySeries(undefined, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.everySeries(null, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

});

describe('#everyLimit', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 2, 4];
    async.everyLimit(collection, 2, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 2]);
      done();
    });
  });

  it('should execute iterator by collection of array passing index', function(done) {

    var order = [];
    var collection = [1, 5, 2, 4];
    async.everyLimit(collection, 2, everyIteratorWithKey(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [1, 0],
        [2, 2]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of array and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 5, 2, 4];
    async.everyLimit(collection, 2, everyIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 2]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 5, 2, 4];
    async.everyLimit(collection, 2, everyIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [1, 0],
        [2, 2]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 2,
      d: 4
    };
    async.everyLimit(collection, 2, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 2]);
      done();
    });
  });

  it('should execute iterator with binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };

    async.everyLimit(collection, 2, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 4]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 9, 5];
    async.everyLimit(collection, Infinity, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, [1, 3, 5, 9]);
      done();
    });

  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.everyLimit([], 4, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.everyLimit(function() {}, 2, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.everyLimit(undefined, 0, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.everyLimit(null, 0, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.everyLimit(collection, 0, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.everyLimit(collection, undefined, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

});
