export default class TimeClock {
  constructor(milliseconds = 0) {
    this.time = milliseconds;
    this.startDate = undefined;
    this.endDate = undefined;
    this.distance = undefined;
  }

  /**
   * Return time as seconds.
   *
   * @return {Number}
   */
  get seconds() {
    return parseInt(this.time / 1000);
  }

  /**
   * Return time as minutes.
   *
   * @return {Number}
   */
  get minutes() {
    return parseInt(this.time / (1000 * 60));
  }

  /**
   * Return time as hours.
   *
   * @return {Number}
   */
  get hours() {
    return parseInt(this.time / (1000 * 60 * 60));
  }

  /**
   * Return time as days.
   *
   * @return {Number}
   */
  get days() {
    return parseInt(this.time / (1000 * 60 * 60 * 24));
  }

  /**
   * Returns remain time until endDate.
   *
   * @return {TimeClock}
   */
  get remain() {
    return this.distance
      ? new TimeClock(this.distance.time - this.time)
      : this.timeout
      ? new TimeClock(this.timeout.time - this.time)
      : undefined;
  }

  /**
   * Return timeout time.
   *
   * @return {TimeClock}
   */
  get timeout() {
    return this._timeout;
  }

  /**
   * Set timeout as TimeClock.
   *
   * @param  {Number} val milliseconds.
   * @return {void}
   */
  set timeout(val) {
    this._timeout = new TimeClock(val);
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
   * Returns to data object.
   *
   * @return {Object}
   */
  toData() {
    let t = this.time;
    return {
      day: Math.floor(t / (1000 * 60 * 60 * 24)),
      hour: Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      min: Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)),
      sec: Math.floor((t % (1000 * 60)) / 1000),
      ms: t % 1000,
    };
  }

  /**
   * toTimeString
   *
   * @return {String}  e.g. '2d 05h 33m 21s 420ms'
   */
  toTimeString() {
    let str = '';
    let t = this.toData();

    if (t.day > 0) {
      str += `${t.day}d`;
    }

    if (str.length > 0 || t.hour > 0) {
      str += ` ${t.hour.toString().padStart(2, '0')}h`;
    }

    if (str.length > 0 || t.min > 0) {
      str += ` ${t.min.toString().padStart(2, '0')}m`;
    }

    if (str.length > 0 || t.sec > 0) {
      str += ` ${t.sec.toString().padStart(2, '0')}s`;
    }

    str += ` ${t.ms}ms`;

    return str.trim();
  }
}
