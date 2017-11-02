import EventEmitter from 'eventemitter3';
import TimeClock from './time-clock';

export { TimeClock };

export default class DuckTimer extends EventEmitter {
  constructor(option = {}) {
    super();
    this.setOption(option);
    this._timePaused = false;
    this._intervalId = undefined;
  }

  // public

  getDefaultOption() {
    return {
      setTime: 0,
      setDate: undefined,
      tick: 10,
      interval: 100,
      countdown: false,
      eventName: {
        interval: 'interval',
        done: 'done',
      },
    };
  }

  setOption(option = {}) {
    this.option = Object.assign(this.getDefaultOption(), option);
    this.setDate(this.option.setDate);
    this.setTime(this.option.setTime);
    if (typeof this.option.onInterval === 'function') {
      this.on(this.option.eventName.interval, this.option.onInterval);
    }

    if (typeof this.option.onDone === 'function') {
      this.on(this.option.eventName.interval, this.option.onDone);
    }

    return this;
  }

  setDate(val) {
    this.date = new Date(val);
    return this;
  }

  setTime(mSec) {
    this.time = mSec;
    return this;
  }

  start() {
    if (this._timePaused) {
      this._timePaused = false;
    } else {
      this._intervalId = setInterval(
        this._intervalProcess.bind(this),
        this.option.tick
      );
    }
  }

  stop() {
    this._timePaused = true;
  }

  reset() {
    clearInterval(this._intervalId);
    this._timePaused = false;
    this.time = 0;
  }

  // private

  _intervalProcess() {
    if (this._timePaused) return;
    this._timeCount();
    if (this.time % this.option.interval == 0) {
      this.emit(this.option.eventName.interval, this);
    }
  }

  _timeCount() {
    if (this.option.countdown) {
      this.time -= this.option.tick;
    } else {
      this.time += this.option.tick;
    }
  }
}
