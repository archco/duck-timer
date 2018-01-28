import padStart from 'lodash-es/padStart';

export interface ClockData {
  day: number;
  hour: number;
  min: number;
  sec: number;
  ms: number;
}

export default class TimeClock {
  time: number;
  startDate: Date|null = null;
  endDate: Date|null = null;
  distance: TimeClock|null = null;
  timeout: TimeClock|null = null;
  delayed: number|undefined = undefined;

  /**
   * constructor
   * @param ms milliseconds
   */
  constructor(ms: number = 0) {
    this.time = ms;
  }

  /**
   * get time as seconds.
   * @return
   */
  get seconds(): number {
    return Math.floor(this.time / 1000);
  }

  /**
   * get time as minutes.
   * @return
   */
  get minutes(): number {
    return Math.floor(this.time / (1000 * 60));
  }

  /**
   * get time as hours.
   * @return
   */
  get hours(): number {
    return Math.floor(this.time / (1000 * 60 * 60));
  }

  /**
   * get time as days
   * @return
   */
  get days(): number {
    return Math.floor(this.time / (1000 * 60 * 60 * 24));
  }

  /**
   * get remain clock when it exists.
   * @return
   */
  get remain(): TimeClock|null {
    return this.distance
      ? new TimeClock(this.distance.time - this.time)
      : this.timeout
      ? new TimeClock(this.timeout.time - this.time)
      : null;
  }

  /**
   * set timeout.
   * @param  ms milliseconds
   * @return
   */
  setTimeout(ms: number): this {
    this.timeout = new TimeClock(ms);
    return this;
  }

  /**
   * Set startDate and endDate.
   * @param  start
   * @param  end
   * @return
   */
  setDistance(start: Date|string, end: Date|string): this {
    this.startDate = start instanceof Date ? start : new Date(start);
    this.endDate = end instanceof Date ? end : new Date(end);

    this.distance = new TimeClock(
      this.endDate.getTime() - this.startDate.getTime(),
    );
    return this;
  }

  /**
   * Returns time as data object.
   * @return
   */
  toData(): ClockData {
    const t = this.time;
    return {
      day: Math.floor(t / (1000 * 60 * 60 * 24)),
      hour: Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      min: Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)),
      sec: Math.floor((t % (1000 * 60)) / 1000),
      ms: t % 1000,
    };
  }

  /**
   * Returns time as string. e.g. '2d 05h 33m 21s 420ms'
   * @return
   */
  toTimeString(): string {
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
