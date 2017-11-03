window["DuckTimer"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeClock = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventemitter = __webpack_require__(1);

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _timeClock = __webpack_require__(2);

var _timeClock2 = _interopRequireDefault(_timeClock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.TimeClock = _timeClock2.default;

var DuckTimer = function () {
  function DuckTimer() {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, DuckTimer);

    this._timeClock = new _timeClock2.default();
    this._event = new _eventemitter2.default();
    this._intervalId = undefined;
    this._isPaused = false;
    this.setOption(option);
  }

  // public

  _createClass(DuckTimer, [{
    key: 'getDefaultOption',
    value: function getDefaultOption() {
      return {
        setTime: 0,
        tick: 10,
        interval: 100,
        onInterval: undefined, // callback function on interval.
        countdownDate: undefined,
        eventName: {
          interval: 'interval',
          done: 'done'
        }
      };
    }
  }, {
    key: 'setOption',
    value: function setOption() {
      var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.option = Object.assign(this.getDefaultOption(), option);
      this.time = this.option.setTime;
      if (this.option.countdownDate) this.setCountdown(this.option.countdownDate);
      if (this.option.onInterval) {
        this.setInterval(this.option.interval, this.option.onInterval);
      }

      return this;
    }
  }, {
    key: 'getClock',
    value: function getClock() {
      return this._timeClock;
    }
  }, {
    key: 'getEventEmitter',
    value: function getEventEmitter() {
      return this._event;
    }
  }, {
    key: 'setCountdown',
    value: function setCountdown(date) {
      var startDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'now';

      this._timeClock.setDistance(startDate, date);
      return this;
    }
  }, {
    key: 'setInterval',
    value: function setInterval(ms) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      this.option.interval = ms;
      if (typeof callback === 'function') {
        this.onInterval(callback);
      }

      return this;
    }
  }, {
    key: 'onInterval',
    value: function onInterval(callback) {
      if (typeof callback === 'function') {
        this._event.on(this.option.eventName.interval, callback);
      }

      return this;
    }
  }, {
    key: 'start',
    value: function start() {
      if (this._isPaused) {
        this._isPaused = false;
      } else {
        this._intervalId = setInterval(this._intervalProcess.bind(this), this.option.tick);
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._isPaused = true;
    }
  }, {
    key: 'reset',
    value: function reset() {
      clearInterval(this._intervalId);
      this._isPaused = false;
      this.time = 0;
    }

    // private

  }, {
    key: '_intervalProcess',
    value: function _intervalProcess() {
      if (this._isPaused) return;
      this.time += this.option.tick;
      if (this.time % this.option.interval == 0) {
        this._event.emit(this.option.eventName.interval, this._timeClock);
      }
    }
  }, {
    key: 'time',
    get: function get() {
      return this._timeClock.time;
    },
    set: function set(val) {
      this._timeClock.time = val;
    }
  }]);

  return DuckTimer;
}();

exports.default = DuckTimer;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @api private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Mixed} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Remove the listeners of a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {Mixed} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {String|Symbol} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimeClock = function () {
  function TimeClock() {
    var milliseconds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    _classCallCheck(this, TimeClock);

    this.time = milliseconds;
    this.startDate = undefined;
    this.endDate = undefined;
    this.distance = undefined;
  }

  /**
   * Return time as seconds.
   *
   * @return {Number}
   */


  _createClass(TimeClock, [{
    key: 'setDistance',


    /**
     * Set startDate, endDate and distnace.
     *
     * @param {Date|String} start
     * @param {Date|String} end
     */
    value: function setDistance(start, end) {
      this.startDate = start instanceof Date ? start : new Date(start);
      this.endDate = end instanceof Date ? end : new Date(end);

      this.distance = new TimeClock(this.endDate.getTime() - this.startDate.getTime());
    }

    /**
     * Returns to data object.
     *
     * @return {Object}
     */

  }, {
    key: 'toData',
    value: function toData() {
      var t = this.time;
      return {
        day: Math.floor(t / (1000 * 60 * 60 * 24)),
        hour: Math.floor(t % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
        min: Math.floor(t % (1000 * 60 * 60) / (1000 * 60)),
        sec: Math.floor(t % (1000 * 60) / 1000),
        ms: t % 1000
      };
    }

    /**
     * toTimeString
     *
     * @return {String}  e.g. '2d 05h 33m 21s 420ms'
     */

  }, {
    key: 'toTimeString',
    value: function toTimeString() {
      var str = '';
      var t = this.toData();

      if (t.day > 0) {
        str += t.day + 'd';
      }

      if (str.length > 0 || t.hour > 0) {
        str += ' ' + t.hour.toString().padStart(2, '0') + 'h';
      }

      if (str.length > 0 || t.min > 0) {
        str += ' ' + t.min.toString().padStart(2, '0') + 'm';
      }

      if (str.length > 0 || t.sec > 0) {
        str += ' ' + t.sec.toString().padStart(2, '0') + 's';
      }

      str += ' ' + t.ms + 'ms';

      return str.trim();
    }
  }, {
    key: 'seconds',
    get: function get() {
      return parseInt(this.time / 1000);
    }

    /**
     * Return time as minutes.
     *
     * @return {Number}
     */

  }, {
    key: 'minutes',
    get: function get() {
      return parseInt(this.time / (1000 * 60));
    }

    /**
     * Return time as hours.
     *
     * @return {Number}
     */

  }, {
    key: 'hours',
    get: function get() {
      return parseInt(this.time / (1000 * 60 * 60));
    }

    /**
     * Return time as days.
     *
     * @return {Number}
     */

  }, {
    key: 'days',
    get: function get() {
      return parseInt(this.time / (1000 * 60 * 60 * 24));
    }

    /**
     * Returns remain time until endDate.
     *
     * @return {TimeClock}
     */

  }, {
    key: 'remain',
    get: function get() {
      if (!this.distance) return undefined;
      return new TimeClock(this.distance.time - this.time);
    }
  }]);

  return TimeClock;
}();

exports.default = TimeClock;

/***/ })
/******/ ]);
//# sourceMappingURL=duck-timer.js.map