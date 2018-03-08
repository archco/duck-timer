import { EventEmitter as Emitter } from 'eventemitter3';

declare class EventEmitter extends Emitter {}

declare interface ClockData {
  day: number;
  hour: number;
  min: number;
  sec: number;
  ms: number;
}

/**
 * Simple time clock class.
 *
 * @export
 * @class TimeClock
 */
export class TimeClock {
  time: number;
  startDate?: Date;
  endDate?: Date;
  distance?: TimeClock;
  timeout?: TimeClock;
  delayed?: number;

  /** get time as seconds. */
  readonly seconds: number;
  /** get time as minutes. */
  readonly minutes: number;
  /** get time as hours. */
  readonly hours: number;
  /** get time as days. */
  readonly days: number;
  /** get remain clock if it exists. */
  readonly remain?: TimeClock;

  /**
   * constructor
   * @param ms milliseconds
   */
  constructor(ms?: number);

  /**
   * Set startDate and endDate.
   * @param  start
   * @param  end
   * @return
   */
  setDistance(start: Date|string, end: Date|string): this;

  /**
   * Returns time as data object.
   * @return
   */
  toData(): ClockData;

  /**
   * Returns time as string. e.g. '2d 05h 33m 21s 420ms'
   * @return
   */
  toTimeString(): string;
}

/** Callback function type. */
declare type CallbackFn = (clock: TimeClock) => void;

declare interface EventNames {
  interval?: string;
  timeout?: string;
}

declare interface DuckTimerOptions {
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

declare interface Delay {
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
  isPaused: boolean;
  delay?: Delay;

  /** Get or set clock's time. */
  time: number;

  /**
   * constructor
   * @param option
   */
  constructor(option?: DuckTimerOptions);

  /**
   * getDefaultOption
   * @return
   */
  getDefaultOption(): DuckTimerOptions;

  /**
   * setOption
   * @param  option
   * @return
   */
  setOption(option?: DuckTimerOptions): this;

  /**
   * Get clock.
   * @return
   */
  getClock(): TimeClock;

  /**
   * Get event emitter.
   * @return
   */
  getEventEmitter(): EventEmitter;

  /**
   * Set countdown.
   * @param  date      countdown date.
   * @param  startDate start date. default is now.
   * @return
   */
  setCountdown(date: Date|string, startDate?: Date|string): this;

  /**
   * Add listener on 'interval' event.
   * @param  callback
   * @return
   */
  onInterval(callback: CallbackFn|null): this;

  /**
   * Set timeout.
   * @param  ms       milliseconds
   * @param  callback
   * @return
   */
  setTimeout(ms: number, callback?: CallbackFn|null): this;

  /**
   * Add listener on 'timeout' event.
   * @param  callback
   * @return
   */
  onTimeout(callback: CallbackFn|null): this;

  /**
   * Set delay.
   * @param  ms milliseconds
   * @param  cb callback when the delay is over.
   * @return
   */
  setDelay(ms: number, cb?: CallbackFn|null): this;

  /**
   * timer start.
   */
  start(): void;

  /**
   * timer stop.
   */
  stop(): void;

  /**
   * timer reset.
   */
  reset(): void;
}
