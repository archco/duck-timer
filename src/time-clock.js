export default class TimeClock {
  constructor(milliseconds = 0) {
    this.time = milliseconds;
    this.startDate = undefined;
    this.endDate = undefined;
    this.duration = undefined;
  }

  get seconds() {
    return Math.floor((this.time % (1000 * 60)) / 1000);
  }

  get minutes() {
    return Math.floor((this.time % (1000 * 60 * 60)) / (1000 * 60));
  }

  get hours() {
    return Math.floor((this.time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  }

  get days() {
    return Math.floor(this.time / (1000 * 60 * 60 * 24));
  }

  get remain() {
    if (!this.duration) return undefined;
    return new TimeClock(this.duration.time - this.time);
  }

  setDuration(start, end) {
    this.startDate = start instanceof Date ? start : new Date(start);
    this.endDate = end instanceof Date ? end : new Date(end);

    this.duration = new TimeClock(
      this.endDate.getTime() - this.startDate.getTime()
    );
  }

  toTimeString() {
    let str = '';

    if (this.days > 0) {
      str += `${this.days}d`;
    }

    if (str.length > 0 || this.hours > 0) {
      str += ` ${this.hours.toString().padStart(2, '0')}h`;
    }

    if (str.length > 0 || this.minutes > 0) {
      str += ` ${this.minutes.toString().padStart(2, '0')}m`;
    }

    if (str.length > 0 || this.seconds > 0) {
      str += ` ${this.seconds.toString().padStart(2, '0')}s`;
    }

    str += ` ${this.time % 1000}ms`;

    return str.trim();
  }
}
