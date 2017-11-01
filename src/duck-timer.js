import EventEmitter from 'eventemitter3';

export default class DuckTimer extends EventEmitter {
  constructor(option = {}) {
    super();
    this.setOption(option);
  }

  // public

  getDefaultOption() {
    return {
      setTime: 0,
      setDate: undefined,
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
}
