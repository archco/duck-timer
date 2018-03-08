import EventEmitter from './emitter';
import TimeClock from './time-clock';

export { TimeClock };

/** Callback function type. */
type CallbackFn = (clock: TimeClock) => void;

interface EventNames {
  interval?: string;
  timeout?: string;
}

interface DuckTimerOptions {
  /** Initialize clock time. */
  setTime?: number;
  /** clock's tick interval time. */
  tick?: number;
  /** Set interval time. */
  interval?: number;
  /** Set timeout time. */
  timeout?: number;
  /** a callback when occur 'interval' event. */
  onInterval?: CallbackFn;
  /** a callback when occur 'timeout' event. */
  onTimeout?: CallbackFn;
  /** Set countdown date. */
  countdownDate?: Date;
  /** Specifying event names. */
  eventName?: EventNames;
  /**
   * Enable auto delay when countdown started.
   * This delay is a function to prevent slight differences
   * between the countdown time and the current time
   * from being expressed as remain.
   */
  enableAutoDelay?: boolean;
}

interface Delay {
  /** Delay time. */
  time: number;
  /** a callback when finished delay. */
  callback?: CallbackFn;
}

/**
 * The timer class that can stopwatch, timeout and countdown.
 *
 * @export
 * @class DuckTimer
 */
export default class DuckTimer {
  clock: TimeClock;
  event: EventEmitter;
  option: DuckTimerOptions;
  isPaused: boolean = false;
  delay?: Delay;
  private tickIntervalId?: number;

  /**
   * constructor
   * @param option
   */
  constructor(option: DuckTimerOptions = {}) {
    this.clock = new TimeClock();
    this.event = new EventEmitter();
    this.option = this.getDefaultOption();
    this.setOption(option);
  }

  /**
   * Get clock's time.
   * @return
   */
  get time(): number {
    return this.clock.time;
  }

  /**
   * Set clock's time.
   * @param  ms milliseconds
   */
  set time(ms: number) {
    this.clock.time = ms;
  }

  /**
   * getDefaultOption
   * @return
   */
  getDefaultOption(): DuckTimerOptions {
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

  /**
   * setOption
   * @param  option
   * @return
   */
  setOption(option: DuckTimerOptions = {}): this {
    this.option = {...this.option, ...option};
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

  /**
   * Get clock.
   * @return
   */
  getClock(): TimeClock {
    return this.clock;
  }

  /**
   * Get event emitter.
   * @return
   */
  getEventEmitter(): EventEmitter {
    return this.event;
  }

  /**
   * Set countdown.
   * @param  date      countdown date.
   * @param  startDate start date. default is now.
   * @return
   */
  setCountdown(date: Date|string, startDate: Date|string = new Date()): this {
    this.clock.setDistance(startDate, date);
    return this;
  }

  /**
   * Set interval
   * @param  ms       milliseconds
   * @param  callback
   * @return
   */
  setInterval(ms: number, callback: CallbackFn|null = null): this {
    this.option.interval = ms;
    return this.onInterval(callback);
  }

  /**
   * Add listener on 'interval' event.
   * @param  callback
   * @return
   */
  onInterval(callback: CallbackFn|null): this {
    if (typeof callback === 'function') {
      this.event.on(this.option.eventName.interval, callback);
    }
    return this;
  }

  /**
   * Set timeout.
   * @param  ms       milliseconds
   * @param  callback
   * @return
   */
  setTimeout(ms: number, callback: CallbackFn|null = null): this {
    this.option.timeout = ms;
    this.clock.setTimeout(this.option.timeout);
    return this.onTimeout(callback);
  }

  /**
   * Add listener on 'timeout' event.
   * @param  callback
   * @return
   */
  onTimeout(callback: CallbackFn|null): this {
    if (typeof callback === 'function') {
      this.event.on(this.option.eventName.timeout, callback);
    }
    return this;
  }

  /**
   * Set delay.
   * @param  ms milliseconds
   * @param  cb callback when the delay is over.
   * @return
   */
  setDelay(ms: number, cb: CallbackFn|null = null): this {
    this.delay = {
      time: ms,
      callback: cb,
    };
    return this;
  }

  /**
   * timer start.
   */
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

  /**
   * timer stop.
   */
  stop(): void {
    this.isPaused = true;
  }

  /**
   * timer reset.
   */
  reset(): void {
    this.clearTick();
    this.isPaused = false;
    this.time = 0;
  }

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
