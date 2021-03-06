#!/usr/bin/env node --stack-size=65536

'use strict';
var comparator = require('func-comparator');
var _ = require('lodash');
var async = require('async');
var neo_async = require('../../');

// loop count
var count = 100;
// sampling times
var times = 3000;
var array = _.shuffle(_.times(count));
var iterator = function(n, callback) {
  callback(null, false);
};
var funcs = {
  'async': function(callback) {
    async.detect(array, iterator, callback);
  },
  'neo-async': function(callback) {
    neo_async.detect(array, iterator, callback);
  }
};

comparator
  .set(funcs)
  .option({
    async: true,
    times: times
  })
  .start()
  .result(function(err, res) {
    console.log(res);
  });
