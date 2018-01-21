import EventEmitter from 'eventemitter3';
import TimeClock from './time-clock';

export { TimeClock };

export default class DuckTimer {
  constructor(option = {}) {
    this._clock = new TimeClock();
    this._event = new EventEmitter();
    this._delay = null;
    this._isPaused = false;
    this._tickIntervalId = null;
    this.setOption(option);
  }

  // public

  /**
   * time getter.
   *
   * @return {Number} milliseconds.
   */
  get time() {
    return this._clock.time;
  }

  /**
   * time setter.
   *
   * @param  {Number} val milliseconds.
   */
  set time(val) {
    this._clock.time = val;
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
    if (this.option.timeout) this.setTimeout(this.option.timeout);
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
    return this._clock;
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
    this._clock.setDistance(startDate, date);
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
    this._clock.timeout = this.option.timeout = ms;
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
   * Set milliseconds delay before start timer.
   *
   * @param {Number} ms
   * @param {Function} [callback = null]
   */
  setDelay(ms, callback = null) {
    this._delay = {
      time: ms,
      callback: callback,
    };
    return this;
  }

  /**
   * Start clock.
   */
  start() {
    if (this._isPaused) this._isPaused = false;
    if (this._hasTick()) return;
    this._prepareCountdown();

    if (this._delay) {
      setTimeout(this._onDelayTimeout.bind(this), this._delay.time);
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

  // private

  _tickProcess() {
    if (this._isPaused) return;
    this.time += this.option.tick;

    // Interval.
    if (this.time % this.option.interval == 0) {
      this._event.emit(this.option.eventName.interval, this._clock);
    }

    // Timeout.
    if (this.time >= this.option.timeout) {
      this._event.emit(this.option.eventName.timeout, this._clock);
      this._clearTick();
    }

    // Countdown finished.
    if (this._clock.remain && this._clock.remain.time <= 0) {
      this._event.emit(this.option.eventName.timeout, this._clock);
      this._clearTick();
    }
  }

  _startTick() {
    this._tickIntervalId = setInterval(
      this._tickProcess.bind(this),
      this.option.tick
    );
  }

  _clearTick() {
    clearInterval(this._tickIntervalId);
    this._tickIntervalId = null;
  }

  _hasTick() {
    return this._tickIntervalId != null;
  }

  _onDelayTimeout() {
    this._clock.delayed = this._delay.time;
    if (typeof this._delay.callback === 'function') {
      this._delay.callback(this._clock);
    }

    this._startTick();
  }

  _prepareCountdown() {
    if (!this._clock.distance) return;
    let remainder = this._clock.distance.time % this.option.interval || 0;

    if (remainder > 0 && this.option.enableAutoDelay) {
      let c = this._clock;
      c.startDate.setTime(c.startDate.getTime() + remainder);
      c.setDistance(c.startDate, c.endDate);
      this.setDelay(remainder);
    }
  }
}
