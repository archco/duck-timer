import { EventEmitter } from 'eventemitter3';
import assignIn from 'lodash-es/assignin';
import TimeClock from './time-clock';

export { TimeClock };

type CallbackOrUndefined = ((clock: TimeClock) => void|undefined);

interface EventName {
  interval: string;
  timeout: string;
}

interface Option {
  setTime: number;
  tick: number;
  interval: number|undefined;
  timeout: number|undefined;
  onInterval: CallbackOrUndefined;
  onTimeout: CallbackOrUndefined;
  countdownDate: Date|undefined;
  eventName: EventName;
  enableAutoDelay: boolean;
}

interface Delay {
  time: number;
  callback: CallbackOrUndefined;
}

export default class DuckTimer {
  public clock: TimeClock;
  public event: EventEmitter;
  public option: Option;
  public delay: Delay|null = null;
  public isPaused: boolean = false;
  private tickIntervalId: number|null = null;

  constructor(option: Partial<Option> = {}) {
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

  public getDefaultOption(): Option {
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

  public setOption(option: Partial<Option> = {}): this {
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

  public getClock(): TimeClock {
    return this.clock;
  }

  public getEventEmitter(): EventEmitter {
    return this.event;
  }

  public setCountdown(date: (Date|string), startDate: (Date|string) = new Date()): this {
    this.clock.setDistance(startDate, date);
    return this;
  }

  public setInterval(ms: number, callback: CallbackOrUndefined = null): this {
    this.option.interval = ms;
    return this.onInterval(callback);
  }

  public onInterval(callback: CallbackOrUndefined): this {
    if (typeof callback === 'function') {
      this.event.on(this.option.eventName.interval, callback);
    }
    return this;
  }

  public setTimeout(ms: number, callback: CallbackOrUndefined = null): this {
    this.option.timeout = ms;
    this.clock.setTimeout(this.option.timeout);
    return this.onTimeout(callback);
  }

  public onTimeout(callback: CallbackOrUndefined): this {
    if (typeof callback === 'function') {
      this.event.on(this.option.eventName.timeout, callback);
    }
    return this;
  }

  public setDelay(ms: number, cb: CallbackOrUndefined = null): this {
    this.delay = {
      time: ms,
      callback: cb,
    };
    return this;
  }

  public start(): void {
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

  public stop(): void {
    this.isPaused = true;
  }

  public reset(): void {
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
