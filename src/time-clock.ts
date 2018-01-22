import padStart from 'lodash-es/padstart';

export interface ClockData {
  day: number;
  hour: number;
  min: number;
  sec: number;
  ms: number;
}

export default class TimeClock {
  public time: number;
  public startDate: (Date|null) = null;
  public endDate: (Date|null) = null;
  public distance: (TimeClock|null) = null;
  public timeout: (TimeClock|null) = null;

  constructor(ms: number = 0) {
    this.time = ms;
  }

  get seconds(): number {
    return this.time / 1000;
  }

  get minutes(): number {
    return this.time / (1000 * 60);
  }

  get hours(): number {
    return this.time / (1000 * 60 * 60);
  }

  get days(): number {
    return this.time / (1000 * 60 * 60 * 24);
  }

  get remain(): (TimeClock|null) {
    return this.distance
      ? new TimeClock(this.distance.time - this.time)
      : this.timeout
      ? new TimeClock(this.timeout.time - this.time)
      : null;
  }

  public setTimeout(ms: number): this {
    this.timeout = new TimeClock(ms);
    return this;
  }

  public setDistance(start: (Date|string), end: (Date|string)): this {
    this.startDate = start instanceof Date ? start : new Date(start);
    this.endDate = end instanceof Date ? end : new Date(end);

    this.distance = new TimeClock(
      this.endDate.getTime() - this.startDate.getTime(),
    );
    return this;
  }

  public toData(): ClockData {
    const t = this.time;
    return {
      day: Math.floor(t / (1000 * 60 * 60 * 24)),
      hour: Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      min: Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)),
      sec: Math.floor((t % (1000 * 60)) / 1000),
      ms: t % 1000,
    };
  }

  public toTimeString(): string {
    const t = this.toData();
    const refine = (num: number) => padStart(num.toString(), 2, '0');
    let str = '';

    if (t.day > 0) {
      str += `${t.day}d`;
    }

    if (str.length > 0 || t.hour > 0) {
      str += ` ${refine(t.hour)}h`;
    }

    if (str.length > 0 || t.min > 0) {
      str += ` ${refine(t.min)}m`;
    }

    if (str.length > 0 || t.sec > 0) {
      str += ` ${refine(t.sec)}s`;
    }

    str += ` ${t.ms}ms`;

    return str.trim();
  }
}
