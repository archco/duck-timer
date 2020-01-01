import { TimeClock } from '../src/time-clock';

describe('#TimeClock', () => {
  describe('constructor', () => {
    it('the only argument is milliseconds time.', () => {
      const clock = new TimeClock(1000);
      expect(clock instanceof TimeClock).toBeTruthy();
      expect(clock.time).toEqual(1000);
    });
  });

  describe('getters', () => {
    it('seconds: 3000-3999 milliseconds equal to 3 seconds.', () => {
      const clock = new TimeClock(3000);
      expect(clock.seconds).toEqual(3);
      clock.time = 3600;
      expect(clock.seconds).toEqual(3);
    });

    it('minutes: 300,000 milliseconds equal to 5 minutes.', () => {
      const clock = new TimeClock(300000);
      expect(clock.minutes).toEqual(5);
    });

    it('hours: 21,600,000 milliseconds equal to 6 hours.', () => {
      const clock = new TimeClock(21600000);
      expect(clock.hours).toEqual(6);
    });

    it('days: 604,800,000 milliseconds equal to 7 days.', () => {
      const clock = new TimeClock(604800000);
      expect(clock.days).toEqual(7);
    });
  });

  describe('#toData', () => {
    const clock = new TimeClock(8764500000);

    it('Returns time value to data object.', () => {
      expect(typeof clock.toData()).toBe('object');
    });

    it("Data have keys: ['day', 'hour', 'min', 'sec', 'ms']", () => {
      const dataKeys = Object.keys(clock.toData());
      expect(dataKeys).toEqual(['day', 'hour', 'min', 'sec', 'ms']);
    });
  });

  describe('#toTimeString', () => {
    it('Return time to string as simple format.', () => {
      const clock = new TimeClock(9000000);
      expect(typeof clock.toTimeString()).toBe('string');
    });

    it('strict test', () => {
      // 25 hours
      expect(new TimeClock(90e6).toTimeString()).toBe('1d 01h 00m 00s 0ms');
      // 70 minutes
      expect(new TimeClock(42e5).toTimeString()).toBe('01h 10m 00s 0ms');
      // 70 seconds
      expect(new TimeClock(70e3).toTimeString()).toBe('01m 10s 0ms');
      // 2 seconds
      expect(new TimeClock(2000).toTimeString()).toBe('02s 0ms');
      // 100 ms
      expect(new TimeClock(100).toTimeString()).toBe('100ms');
    });
  });

  describe('#setDistance', () => {
    const clock = new TimeClock();
    clock.setDistance('2017-11-01', '2017-11-30 21:00:00');

    it('startDate and endDate properties are instanceof Date.', () => {
      expect(clock.startDate instanceof Date).toBeTruthy();
      expect(clock.endDate instanceof Date).toBeTruthy();
    });

    it('distance will returns time between startDate and endDate as instance of TimeClock.', () => {
      expect(clock.distance instanceof TimeClock).toBeTruthy();
      expect(typeof clock.distance.time).toBe('number');
    });

    it('remain property will returns as instance of TimeClock.', () => {
      expect(clock.remain instanceof TimeClock).toBeTruthy();
      expect(typeof clock.remain.time).toBe('number');
    });
  });

  describe('.timeout', () => {
    const clock = new TimeClock();
    clock.setTimeout(3000);

    it('Getter and setter will timeout convert to TimeClock.', () => {
      expect(clock.timeout instanceof TimeClock).toBeTruthy();
      expect(clock.timeout.time).toBe(3000);
    });

    it('Getter "remain" will be available.', () => {
      expect(clock.remain instanceof TimeClock).toBeTruthy();
      expect(clock.remain.time).toBe(3000);
    });
  });
});
