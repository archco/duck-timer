export default class TimeClock {
  constructor(time = 0) {
    this.time = time; // milliseconds.
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
