import EventEmitter from 'eventemitter3';
import TimeClock from './time-clock';

export { TimeClock };

export default class DuckTimer {
  constructor(option = {}) {
    this._timeClock = new TimeClock();
    this._event = new EventEmitter();
    this._intervalId = undefined;
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
      interval: 100,
      onInterval: undefined, // callback function on interval.
      countdownDate: undefined,
      eventName: {
        interval: 'interval',
        done: 'done',
      },
    };
  }

  setOption(option = {}) {
    this.option = Object.assign(this.getDefaultOption(), option);
    this.time = this.option.setTime;
    if (this.option.countdownDate) this.setCountdown(this.option.countdownDate);
    if (this.option.onInterval) {
      this.setInterval(this.option.interval, this.option.onInterval);
    }

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

  setInterval(ms, callback) {
    this.option.interval = ms;
    if (typeof callback === 'function') {
      this._event.on(this.option.eventName.interval, callback);
    }

    return this;
  }

  onInterval(callback) {
    if (typeof callback === 'function') {
      this._event.on(this.option.eventName.interval, callback);
    }

    return this;
  }

  start() {
    if (this._isPaused) {
      this._isPaused = false;
    } else {
      this._intervalId = setInterval(
        this._intervalProcess.bind(this),
        this.option.tick
      );
    }
  }

  stop() {
    this._isPaused = true;
  }

  reset() {
    clearInterval(this._intervalId);
    this._isPaused = false;
    this.time = 0;
  }

  // private

  _intervalProcess() {
    if (this._isPaused) return;
    this.time += this.option.tick;
    if (this.time % this.option.interval == 0) {
      this._event.emit(this.option.eventName.interval, this._timeClock);
    }
  }
}
