(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["DuckTimer"] = factory();
	else
		root["DuckTimer"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/eventemitter3/index.js":
/*!*********************************************!*\
  !*** ./node_modules/eventemitter3/index.js ***!
  \*********************************************/
/***/ ((module) => {



var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
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
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
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
 * @public
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
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
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
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
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

/***/ "./src/time-clock.ts":
/*!***************************!*\
  !*** ./src/time-clock.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TimeClock": () => (/* binding */ TimeClock),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

/**
 * Simple time clock class.
 *
 * @export
 * @class TimeClock
 */
var TimeClock = /** @class */ (function () {
    /**
     * constructor
     * @param ms milliseconds
     */
    function TimeClock(ms) {
        if (ms === void 0) { ms = 0; }
        this.time = ms;
    }
    Object.defineProperty(TimeClock.prototype, "seconds", {
        /**
         * get time as seconds.
         * @return
         */
        get: function () {
            return Math.floor(this.time / 1000);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TimeClock.prototype, "minutes", {
        /**
         * get time as minutes.
         * @return
         */
        get: function () {
            return Math.floor(this.time / (1000 * 60));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TimeClock.prototype, "hours", {
        /**
         * get time as hours.
         * @return
         */
        get: function () {
            return Math.floor(this.time / (1000 * 60 * 60));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TimeClock.prototype, "days", {
        /**
         * get time as days
         * @return
         */
        get: function () {
            return Math.floor(this.time / (1000 * 60 * 60 * 24));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TimeClock.prototype, "remain", {
        /**
         * get remain clock if it exists.
         * @return
         */
        get: function () {
            return this.distance
                ? new TimeClock(this.distance.time - this.time)
                : this.timeout
                    ? new TimeClock(this.timeout.time - this.time)
                    : null;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * set timeout.
     * @param  ms milliseconds
     * @return
     */
    TimeClock.prototype.setTimeout = function (ms) {
        this.timeout = new TimeClock(ms);
        return this;
    };
    /**
     * Set startDate and endDate.
     * @param  start
     * @param  end
     * @return
     */
    TimeClock.prototype.setDistance = function (start, end) {
        this.startDate = start instanceof Date ? start : new Date(start);
        this.endDate = end instanceof Date ? end : new Date(end);
        this.distance = new TimeClock(this.endDate.getTime() - this.startDate.getTime());
        return this;
    };
    /**
     * Returns time as data object.
     * @return
     */
    TimeClock.prototype.toData = function () {
        var t = this.time;
        return {
            day: Math.floor(t / (1000 * 60 * 60 * 24)),
            hour: Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            min: Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)),
            sec: Math.floor((t % (1000 * 60)) / 1000),
            ms: t % 1000,
        };
    };
    /**
     * Returns time as string. e.g. '2d 05h 33m 21s 420ms'
     * @return
     */
    TimeClock.prototype.toTimeString = function () {
        var t = this.toData();
        var refine = function (num) { return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.padStart)(num.toString(), 2, '0'); };
        var str = '';
        if (t.day > 0) {
            str += "".concat(t.day, "d");
        }
        if (str.length > 0 || t.hour > 0) {
            str += " ".concat(refine(t.hour), "h");
        }
        if (str.length > 0 || t.min > 0) {
            str += " ".concat(refine(t.min), "m");
        }
        if (str.length > 0 || t.sec > 0) {
            str += " ".concat(refine(t.sec), "s");
        }
        str += " ".concat(t.ms, "ms");
        return str.trim();
    };
    return TimeClock;
}());

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TimeClock);


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "padEnd": () => (/* binding */ padEnd),
/* harmony export */   "padStart": () => (/* binding */ padStart)
/* harmony export */ });
function padStart(str, length, chars) {
    var space = length - str.length;
    return space > 0 ? "".concat(makePad(chars, space)).concat(str) : str;
}
function padEnd(str, length, chars) {
    var space = length - str.length;
    return space > 0 ? "".concat(str).concat(makePad(chars, space)) : str;
}
function makePad(chars, limit) {
    while (chars.length < limit) {
        chars += chars;
    }
    return chars.substring(0, limit);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/duck-timer.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DuckTimer": () => (/* binding */ DuckTimer),
/* harmony export */   "EventEmitter": () => (/* reexport default from dynamic */ eventemitter3__WEBPACK_IMPORTED_MODULE_0___default.a),
/* harmony export */   "TimeClock": () => (/* reexport safe */ _time_clock__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(eventemitter3__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _time_clock__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./time-clock */ "./src/time-clock.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};



/**
 * The timer class that can stopwatch, timeout and countdown.
 *
 * @export
 * @class DuckTimer
 */
var DuckTimer = /** @class */ (function () {
    /**
     * constructor
     * @param option
     */
    function DuckTimer(option) {
        if (option === void 0) { option = {}; }
        this.isPaused = false;
        this.clock = new _time_clock__WEBPACK_IMPORTED_MODULE_1__["default"]();
        this.event = new (eventemitter3__WEBPACK_IMPORTED_MODULE_0___default())();
        this.option = this.getDefaultOption();
        this.setOption(option);
    }
    Object.defineProperty(DuckTimer.prototype, "time", {
        /**
         * Get clock's time.
         * @return
         */
        get: function () {
            return this.clock.time;
        },
        /**
         * Set clock's time.
         * @param  ms milliseconds
         */
        set: function (ms) {
            this.clock.time = ms;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * getDefaultOption
     * @return
     */
    DuckTimer.prototype.getDefaultOption = function () {
        return {
            setTime: 0,
            tick: 10,
            interval: undefined,
            timeout: undefined,
            onInterval: undefined,
            onTimeout: undefined,
            countdownDate: undefined,
            eventName: {
                interval: 'interval',
                timeout: 'timeout',
            },
            enableAutoDelay: true,
        };
    };
    /**
     * setOption
     * @param  option
     * @return
     */
    DuckTimer.prototype.setOption = function (option) {
        if (option === void 0) { option = {}; }
        this.option = __assign(__assign({}, this.option), option);
        this.time = this.option.setTime;
        this.onInterval(this.option.onInterval);
        if (this.option.timeout) {
            this.setTimeout(this.option.timeout);
        }
        this.onTimeout(this.option.onTimeout);
        if (this.option.countdownDate) {
            this.setCountdown(this.option.countdownDate);
        }
        return this;
    };
    /**
     * Get clock.
     * @return
     */
    DuckTimer.prototype.getClock = function () {
        return this.clock;
    };
    /**
     * Get event emitter.
     * @return
     */
    DuckTimer.prototype.getEventEmitter = function () {
        return this.event;
    };
    /**
     * Set countdown.
     * @param  date      countdown date.
     * @param  startDate start date. default is now.
     * @return
     */
    DuckTimer.prototype.setCountdown = function (date, startDate) {
        if (startDate === void 0) { startDate = new Date(); }
        this.clock.setDistance(startDate, date);
        return this;
    };
    /**
     * Set interval
     * @param  ms       milliseconds
     * @param  callback
     * @return
     */
    DuckTimer.prototype.setInterval = function (ms, callback) {
        if (callback === void 0) { callback = null; }
        this.option.interval = ms;
        return this.onInterval(callback);
    };
    /**
     * Add listener on 'interval' event.
     * @param  callback
     * @return
     */
    DuckTimer.prototype.onInterval = function (callback) {
        if (typeof callback === 'function') {
            this.event.on(this.option.eventName.interval, callback);
        }
        return this;
    };
    /**
     * Set timeout.
     * @param  ms       milliseconds
     * @param  callback
     * @return
     */
    DuckTimer.prototype.setTimeout = function (ms, callback) {
        if (callback === void 0) { callback = null; }
        this.option.timeout = ms;
        this.clock.setTimeout(this.option.timeout);
        return this.onTimeout(callback);
    };
    /**
     * Add listener on 'timeout' event.
     * @param  callback
     * @return
     */
    DuckTimer.prototype.onTimeout = function (callback) {
        if (typeof callback === 'function') {
            this.event.on(this.option.eventName.timeout, callback);
        }
        return this;
    };
    /**
     * Set delay.
     * @param  ms milliseconds
     * @param  cb callback when the delay is over.
     * @return
     */
    DuckTimer.prototype.setDelay = function (ms, cb) {
        if (cb === void 0) { cb = null; }
        this.delay = {
            time: ms,
            callback: cb,
        };
        return this;
    };
    /**
     * timer start.
     */
    DuckTimer.prototype.start = function () {
        if (this.isPaused) {
            this.isPaused = false;
        }
        if (this.hasTick()) {
            return;
        }
        this.prepareCountdown();
        if (this.delay) {
            setTimeout(this.onDelayTimeout.bind(this), this.delay.time);
        }
        else {
            this.startTick();
        }
    };
    /**
     * timer stop.
     */
    DuckTimer.prototype.stop = function () {
        this.isPaused = true;
    };
    /**
     * timer reset.
     */
    DuckTimer.prototype.reset = function () {
        this.clearTick();
        this.isPaused = false;
        this.time = 0;
    };
    DuckTimer.prototype.tickProcess = function () {
        if (this.isPaused) {
            return;
        }
        this.time += this.option.tick;
        // Interval.
        if (this.time % this.option.interval === 0) {
            this.event.emit(this.option.eventName.interval, this.clock);
        }
        // Timeout or Countdown finished.
        if (this.clock.remain && this.clock.remain.time <= 0) {
            this.event.emit(this.option.eventName.timeout, this.clock);
            this.clearTick();
        }
    };
    DuckTimer.prototype.startTick = function () {
        this.tickIntervalId = setInterval(this.tickProcess.bind(this), this.option.tick);
    };
    DuckTimer.prototype.clearTick = function () {
        clearInterval(this.tickIntervalId);
        this.tickIntervalId = null;
    };
    DuckTimer.prototype.hasTick = function () {
        return this.tickIntervalId != null;
    };
    DuckTimer.prototype.onDelayTimeout = function () {
        this.clock.delayed = this.delay.time;
        if (typeof this.delay.callback === 'function') {
            this.delay.callback(this.clock);
        }
        this.startTick();
    };
    DuckTimer.prototype.prepareCountdown = function () {
        if (!this.clock.distance) {
            return;
        }
        var remainder = this.clock.distance.time % this.option.interval || 0;
        if (remainder > 0 && this.option.enableAutoDelay) {
            var c = this.clock;
            c.startDate.setTime(c.startDate.getTime() + remainder);
            c.setDistance(c.startDate, c.endDate);
            this.setDelay(remainder);
        }
    };
    return DuckTimer;
}());

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DuckTimer);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=duck-timer.js.map