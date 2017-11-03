export default class TimeClock {
  constructor(milliseconds = 0) {
    this.time = milliseconds;
    this.startDate = undefined;
    this.endDate = undefined;
    this.distance = undefined;
  }

  /**
   * Returns seconds part.
   *
   * @return {Number}
   */
  get seconds() {
    return Math.floor((this.time % (1000 * 60)) / 1000);
  }

  /**
   * Returns minutes part.
   *
   * @return {Number}
   */
  get minutes() {
    return Math.floor((this.time % (1000 * 60 * 60)) / (1000 * 60));
  }

  /**
   * Returns hours part.
   *
   * @return {Number}
   */
  get hours() {
    return Math.floor((this.time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  }

  /**
   * Returns days part.
   *
   * @return {Number}
   */
  get days() {
    return Math.floor(this.time / (1000 * 60 * 60 * 24));
  }

  /**
   * Returns remain time until endDate.
   *
   * @return {TimeClock}
   */
  get remain() {
    if (!this.distance) return undefined;
    return new TimeClock(this.distance.time - this.time);
  }

  /**
   * Set startDate, endDate and distnace.
   *
   * @param {Date|String} start
   * @param {Date|String} end
   */
  setDistance(start, end) {
    this.startDate = start instanceof Date ? start : new Date(start);
    this.endDate = end instanceof Date ? end : new Date(end);

    this.distance = new TimeClock(
      this.endDate.getTime() - this.startDate.getTime()
    );
  }

  /**
   * toTimeString
   *
   * @return {String}  e.g. '2d 05h 33m 21s 420ms'
   */
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
