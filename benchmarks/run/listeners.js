'use strict';

/**
 * Benchmark related modules.
 */
var benchmark = require('benchmark')
  , microtime = require('microtime');

/**
 * Logger.
 */
var logger = new(require('devnull'))({ timestamp: false, namespacing: 0 });

/**
 * Preparation code.
 */
var EventEmitter2 = require('eventemitter2').EventEmitter2
  , EventEmitter3 = require('../../').EventEmitter
  , EventEmitter1 = require('events').EventEmitter;

function handle() {
  if (arguments.length > 100) console.log('damn');
}

/**
 * Instances.
 */
var ee2 = new EventEmitter2()
  , ee3 = new EventEmitter3()
  , ee1 = new EventEmitter1();

ee1.setMaxListeners(Infinity);
ee2.setMaxListeners(Infinity);

(
  new benchmark.Suite()
).add('EventEmitter 1', function test1() {
  ee1.on('foo', handle);
  ee1.listeners('foo');
//
// // EE2 doesn't correctly handle listeners as they can be removed by doing a
// // ee2.listeners('foo').length = 0; kills the event emitter
// }).add('EventEmitter 2', function test2() {
//   ee2.on('foo', handle);
//   ee2.listeners('foo');
//
}).add('EventEmitter 3', function test2() {
  ee3.on('foo', handle);
  ee3.listeners('foo');
}).on('cycle', function cycle(e) {
  var details = e.target;

  logger.log('Finished benchmarking: "%s"', details.name);
  logger.metric('Count (%d), Cycles (%d), Elapsed (%d), Hz (%d)'
    , details.count
    , details.cycles
    , details.times.elapsed
    , details.hz
  );
}).on('complete', function completed() {
  logger.info('Benchmark: "%s" is was the fastest.'
    , this.filter('fastest').pluck('name')
  );
}).run();
