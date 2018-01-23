export interface ClockData {
  day: number;
  hour: number;
  min: number;
  sec: number;
  ms: number;
}

export default class TimeClock {
  time: number;
  startDate: Date|null;
  endDate: Date|null;
  distance: TimeClock|null;
  timeout: TimeClock|null;
  delayed: number|undefined;
  readonly seconds: number;
  readonly minutes: number;
  readonly hours: number;
  readonly days: number;
  readonly remain: TimeClock|null;

  constructor(ms?: number);

  setTimeout(ms: number): this;
  setDistance(start: Date|string, end: Date|string): this;
  toData(): ClockData;
  toTimeString(): string;
}
