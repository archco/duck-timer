import { EventEmitter } from 'eventemitter3';
import TimeClock from './time-clock';

export as namespace DuckTimer;

export { TimeClock };

type CallbackFn = (clock: TimeClock) => void;

interface EventName {
  interval: string;
  timeout: string;
}

interface Option {
  setTime: number;
  tick: number;
  interval: number|undefined;
  timeout: number|undefined;
  onInterval: CallbackFn|undefined;
  onTimeout: CallbackFn|undefined;
  countdownDate: Date|undefined;
  eventName: EventName;
  enableAutoDelay: boolean;
}

interface Delay {
  time: number;
  callback: CallbackFn|undefined;
}

declare class DuckTimer {
  constructor(option?: object);

  clock: TimeClock;
  event: EventEmitter;
  option: Option;
  delay: Delay|null;
  isPaused: boolean;
  time: number;

  getDefaultOption(): Option;
  setOption(option?: object): this;
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
