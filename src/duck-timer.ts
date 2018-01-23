import { EventEmitter } from 'eventemitter3';
import assignIn from 'lodash-es/assignIn';
import TimeClock from './time-clock';

export { TimeClock };

type CallbackFn = (clock: TimeClock) => void;

interface EventNames {
  interval: string;
  timeout: string;
}

interface Options {
  setTime?: number;
  tick?: number;
  interval?: number;
  timeout?: number;
  onInterval?: CallbackFn;
  onTimeout?: CallbackFn;
  countdownDate?: Date;
  eventName?: EventNames;
  enableAutoDelay?: boolean;
}

interface Delay {
  time: number;
  callback: CallbackFn|undefined;
}

export default class DuckTimer {
  clock: TimeClock;
  event: EventEmitter;
  option: Options;
  delay: Delay|null = null;
  isPaused: boolean = false;
  private tickIntervalId: number|null = null;

  constructor(option: Options = {}) {
    this.clock = new TimeClock();
    this.event = new EventEmitter();
    this.option = this.getDefaultOption();
    this.setOption(option);
  }

  get time(): number {
    return this.clock.time;
  }

  set time(ms: number) {
    this.clock.time = ms;
  }

  getDefaultOption(): Options {
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
  }

  setOption(option: Options = {}): this {
    this.option = assignIn(this.option, option);
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
  }

  getClock(): TimeClock {
    return this.clock;
  }

  getEventEmitter(): EventEmitter {
    return this.event;
  }

  setCountdown(date: Date|string, startDate: Date|string = new Date()): this {
    this.clock.setDistance(startDate, date);
    return this;
  }

  setInterval(ms: number, callback: CallbackFn|null = null): this {
    this.option.interval = ms;
    return this.onInterval(callback);
  }

  onInterval(callback: CallbackFn|null): this {
    if (typeof callback === 'function') {
      this.event.on(this.option.eventName.interval, callback);
    }
    return this;
  }

  setTimeout(ms: number, callback: CallbackFn|null = null): this {
    this.option.timeout = ms;
    this.clock.setTimeout(this.option.timeout);
    return this.onTimeout(callback);
  }

  onTimeout(callback: CallbackFn|null): this {
    if (typeof callback === 'function') {
      this.event.on(this.option.eventName.timeout, callback);
    }
    return this;
  }

  setDelay(ms: number, cb: CallbackFn|null = null): this {
    this.delay = {
      time: ms,
      callback: cb,
    };
    return this;
  }

  start(): void {
    if (this.isPaused) {
      this.isPaused = false;
    }
    if (this.hasTick()) {
      return;
    }
    this.prepareCountdown();

    if (this.delay) {
      setTimeout(this.onDelayTimeout.bind(this), this.delay.time);
    } else {
      this.startTick();
    }
  }

  stop(): void {
    this.isPaused = true;
  }

  reset(): void {
    this.clearTick();
    this.isPaused = false;
    this.time = 0;
  }

  // private

  private tickProcess(): void {
    if (this.isPaused) {
      return;
    }
    this.time += this.option.tick;

    // Interval.
    if (this.time % this.option.interval === 0) {
      this.event.emit(this.option.eventName.interval, this.clock);
    }

    // Timeout.
    if (this.time >= this.option.timeout) {
      this.event.emit(this.option.eventName.timeout, this.clock);
      this.clearTick();
    }

    // Countdown finished.
    if (this.clock.remain && this.clock.remain.time <= 0) {
      this.event.emit(this.option.eventName.timeout, this.clock);
      this.clearTick();
    }
  }

  private startTick(): void {
    this.tickIntervalId = setInterval(
      this.tickProcess.bind(this),
      this.option.tick,
    );
  }

  private clearTick(): void {
    clearInterval(this.tickIntervalId);
    this.tickIntervalId = null;
  }

  private hasTick(): boolean {
    return this.tickIntervalId != null;
  }

  private onDelayTimeout(): void {
    this.clock.delayed = this.delay.time;
    if (typeof this.delay.callback === 'function') {
      this.delay.callback(this.clock);
    }
    this.startTick();
  }

  private prepareCountdown() {
    if (!this.clock.distance) {
      return;
    }
    const remainder = this.clock.distance.time % this.option.interval || 0;

    if (remainder > 0 && this.option.enableAutoDelay) {
      const c = this.clock;
      c.startDate.setTime(c.startDate.getTime() + remainder);
      c.setDistance(c.startDate, c.endDate);
      this.setDelay(remainder);
    }
  }
}
