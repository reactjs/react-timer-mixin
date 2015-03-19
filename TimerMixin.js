/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */
'use strict';

 var setter = function(setter, clearer, array) {
   return function(callback, delta) {
     var id = setter(function() {
       clearer.call(this, id);
       callback.apply(this, arguments);
     }.bind(this), delta);

     if (!this[array]) {
       this[array] = [id];
     } else {
       this[array].push(id);
     }
     return id;
   };
 };

 var clearer = function(clearer, array) {
   return function(id) {
     if (this[array]) {
       var index = this[array].indexOf(id);
       if (index !== -1) {
         this[array].splice(index, 1);
       }
     }
     clearer(id);
   };
 };

 var _timeouts = 'TimerMixin_timeouts';
 var _clearTimeout = clearer(clearTimeout, _timeouts);
 var _setTimeout = setter(setTimeout, _clearTimeout, _timeouts);

 var _intervals = 'TimerMixin_intervals';
 var _clearInterval = clearer(clearInterval, _intervals);
 var _setInterval = setter(setInterval, function() {/* noop */}, _intervals);

 var _immediates = 'TimerMixin_immediates';
 var _clearImmediate = clearer(clearImmediate, _immediates);
 var _setImmediate = setter(setImmediate, _clearImmediate, _immediates);

 var _rafs = 'TimerMixin_rafs';
 var _cancelAnimationFrame = clearer(cancelAnimationFrame, _rafs);
 var _requestAnimationFrame = setter(requestAnimationFrame, _cancelAnimationFrame, _rafs);

var TimerMixin = {
  componentWillUnmount: function() {
    this[_timeouts] && this[_timeouts].forEach(this.clearTimeout);
    this[_intervals] && this[_intervals].forEach(this.clearInterval);
    this[_immediates] && this[_immediates].forEach(this.clearImmediate);
    this[_rafs] && this[_rafs].forEach(this.cancelAnimationFrame);
  },

  setTimeout: _setTimeout,
  clearTimeout: _clearTimeout,

  setInterval: _setInterval,
  clearInterval: _clearInterval,

  setImmediate: _setImmediate,
  clearImmediate: _clearImmediate,

  requestAnimationFrame: _requestAnimationFrame,
  cancelAnimationFrame: _cancelAnimationFrame,
};

module.exports = TimerMixin;
