import EventEmitter from 'eventemitter3';
import TimeClock from './time-clock';

export { TimeClock };

export default class DuckTimer {
  constructor(option = {}) {
    this._timeClock = new TimeClock();
    this._event = new EventEmitter();
    this._tickIntevalId = null;
    this._isPaused = false;
    this.setOption(option);
  }

  // public

  get time() {
    return this._timeClock.time;
  }

  set time(val) {
    this._timeClock.time = val;
  }

  getDefaultOption() {
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
    };
  }

  setOption(option = {}) {
    this.option = this.option || {};
    this.option = Object.assign(this.getDefaultOption(), this.option, option);
    this.time = this.option.setTime;
    this.onInterval(this.option.onInterval);
    this.onTimeout(this.option.onTimeout);
    if (this.option.countdownDate) this.setCountdown(this.option.countdownDate);

    return this;
  }

  getClock() {
    return this._timeClock;
  }

  getEventEmitter() {
    return this._event;
  }

  setCountdown(date, startDate = 'now') {
    this._timeClock.setDistance(startDate, date);
    return this;
  }

  setInterval(ms, callback = null) {
    this.option.interval = ms;
    this.onInterval(callback);
    return this;
  }

  onInterval(callback) {
    if (typeof callback === 'function') {
      this._event.on(this.option.eventName.interval, callback);
    }

    return this;
  }

  setTimeout(ms, callback = null) {
    this.option.timeout = ms;
    this.onTimeout(callback);
    return this;
  }

  onTimeout(callback) {
    if (typeof callback === 'function') {
      this._event.on(this.option.eventName.timeout, callback);
    }

    return this;
  }

  start() {
    if (this._isPaused) this._isPaused = false;

    if (!this._hasTick()) {
      this._tickIntevalId = setInterval(
        this._tickProcess.bind(this),
        this.option.tick
      );
    }
  }

  stop() {
    this._isPaused = true;
  }

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

  _clearTick() {
    clearInterval(this._tickIntevalId);
    this._tickIntevalId = null;
  }

  _hasTick() {
    return this._tickIntevalId != null;
  }
}
