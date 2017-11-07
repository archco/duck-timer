import EventEmitter from 'eventemitter3';
import TimeClock from './time-clock';

export { TimeClock };

export default class DuckTimer {
  constructor(option = {}) {
    this._timeClock = new TimeClock();
    this._event = new EventEmitter();
    this._tickIntevalId = null;
    this._isPaused = false;
    this._delay = undefined;
    this.setOption(option);
  }

  // public

  /**
   * time getter.
   *
   * @return {Number} milliseconds.
   */
  get time() {
    return this.getClock().time;
  }

  /**
   * time setter.
   *
   * @param  {Number} val milliseconds.
   */
  set time(val) {
    this.getClock().time = val;
  }

  /**
   * getDefaultOption
   *
   * @return {Object}
   */
  getDefaultOption() {
    return {
      setTime: 0,
      tick: 10,
      interval: undefined,
      timeout: undefined,
      onInterval: undefined,
      onTimeout: undefined,
      countdownDate: undefined,
      enableAutoDelay: true,
      eventName: {
        interval: 'interval',
        timeout: 'timeout',
      },
    };
  }

  /**
   * setOption
   *
   * @param {Object} [option = {}]
   */
  setOption(option = {}) {
    this.option = this.option || {};
    this.option = Object.assign(this.getDefaultOption(), this.option, option);
    this.time = this.option.setTime;
    this.onInterval(this.option.onInterval);
    this.onTimeout(this.option.onTimeout);
    if (this.option.countdownDate) this.setCountdown(this.option.countdownDate);

    return this;
  }

  /**
   * Return TimeClock.
   *
   * @return {TimeClock}
   */
  getClock() {
    return this._timeClock;
  }

  /**
   * Return EventEmitter.
   *
   * @return {EventEmitter}
   */
  getEventEmitter() {
    return this._event;
  }

  /**
   * Set dates for countdown.
   *
   * @param {Date|String} date
   * @param {Date|String} [startDate = null]
   * @return {DuckTimer}
   */
  setCountdown(date, startDate = null) {
    startDate = startDate === null ? new Date() : startDate;
    this._timeClock.setDistance(startDate, date);
    return this;
  }

  /**
   * Set interval time. and set callback function (optional).
   *
   * @param {Number} ms
   * @param {Function} [callback = null]
   * @return {DuckTimer}
   */
  setInterval(ms, callback = null) {
    this.option.interval = ms;
    this.onInterval(callback);
    return this;
  }

  /**
   * Attach callback function on interval event.
   *
   * @param  {Function} callback
   * @return {DuckTimer}
   */
  onInterval(callback) {
    if (typeof callback === 'function') {
      this._event.on(this.option.eventName.interval, callback);
    }

    return this;
  }

  /**
   * Set timeout time. and set callback function (optional).
   *
   * @param {Number} ms
   * @param {Function} [callback = null]
   * @return {DuckTimer}
   */
  setTimeout(ms, callback = null) {
    this.option.timeout = ms;
    this.onTimeout(callback);
    return this;
  }

  /**
   * Attach callback function on timeout event.
   *
   * @param  {Function} callback
   * @return {DuckTimer}
   */
  onTimeout(callback) {
    if (typeof callback === 'function') {
      this._event.on(this.option.eventName.timeout, callback);
    }

    return this;
  }

  /**
   * Start clock.
   */
  start() {
    if (this._isPaused) this._isPaused = false;
    if (this._hasTick()) return;

    if (this._delay) {
      setTimeout(() => {
        if (typeof this._delay.callback === 'function') {
          this._delay.callback(this.getClock());
        }

        this._startTick();
      }, this._delay.time);
    } else {
      this._startTick();
    }
  }

  /**
   * Stop clock.
   */
  stop() {
    this._isPaused = true;
  }

  /**
   * Reset clock.
   */
  reset() {
    this._clearTick();
    this._isPaused = false;
    this.time = 0;
  }

  setDelay(ms, callback = null) {
    this._delay = {
      time: ms,
      callback: callback,
    };
    this.getClock().delayed = ms;
    return this;
  }

  // private

  _tickProcess() {
    if (this._isPaused) return;
    this.time += this.option.tick;

    // Interval.
    if (this.time % this.option.interval == 0) {
      this._event.emit(this.option.eventName.interval, this._timeClock);
    }

    // Timeout.
    if (this.time >= this.option.timeout) {
      this._event.emit(this.option.eventName.timeout, this._timeClock);
      this._clearTick();
    }

    // Countdown finished.
    if (this.getClock().remain && this.getClock().remain.time <= 0) {
      this._event.emit(this.option.eventName.timeout, this._timeClock);
      this._clearTick();
    }
  }

  _startTick() {
    this._tickIntevalId = setInterval(
      this._tickProcess.bind(this),
      this.option.tick
    );
  }

  _clearTick() {
    clearInterval(this._tickIntevalId);
    this._tickIntevalId = null;
  }

  _hasTick() {
    return this._tickIntevalId != null;
  }
}
