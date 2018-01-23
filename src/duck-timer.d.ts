import { EventEmitter } from 'eventemitter3';
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
  delay: Delay|null;
  isPaused: boolean;
  time: number;

  constructor(option?: Options);

  getDefaultOption(): Options;
  setOption(option?: Options): this;
  getClock(): TimeClock;
  getEventEmitter(): EventEmitter;
  setCountdown(date: Date|string, startDate?: Date|string): this;
  setInterval(ms: number, callback?: CallbackFn|null): this;
  onInterval(callback: CallbackFn|null): this;
  setTimeout(ms: number, callback?: CallbackFn|null): this;
  onTimeout(callback: CallbackFn|null): this;
  setDelay(ms: number, cb?: CallbackFn|null): this;
  start(): void;
  stop(): void;
  reset(): void;
}
