import chai from 'chai';
import { TimeClock } from '../lib/duck-timer.mod';
const expect = chai.expect;

describe('TimeClock', () => {
  describe('constructor', () => {
    it('Time property is exists.', () => {
      let clock = new TimeClock(1000);
      expect(clock).to.be.instanceOf(TimeClock);
      expect(clock.time).to.equal(1000);
    });
  });

  describe('getters', () => {
    it('seconds: 3000 milliseconds equal to 3 seconds.', () => {
      let clock = new TimeClock(3000);
      expect(clock.seconds).to.equal(3);
    });

    it('minutes: 300,000 milliseconds equal to 5 minutes.', () => {
      let clock = new TimeClock(300000);
      expect(clock.minutes).to.equal(5);
    });

    it('hours: 21,600,000 milliseconds equal to 6 hours.', () => {
      let clock = new TimeClock(21600000);
      expect(clock.hours).to.equal(6);
    });

    it('days: 604,800,000 milliseconds equal to 7 days.', () => {
      let clock = new TimeClock(604800000);
      expect(clock.days).to.equal(7);
    });
  });

  describe('#toTimeString', () => {
    it('Return time to string as simple format.', () => {
      let clock = new TimeClock(9000000);
      expect(clock.toTimeString()).to.be.a('string');
    });
  });

  describe('#setDuration', () => {
    let clock;

    before(() => {
      clock = new TimeClock();
      clock.setDuration('2017-11-01', '2017-11-30 21:00:00');
    });

    it('startDate and endDate properties are instanceof Date.', () => {
      expect(clock.startDate).to.instanceOf(Date);
      expect(clock.endDate).to.instanceOf(Date);
    });

    it('duration will returns time between startDate and endDate as instance of TimeClock.', () => {
      expect(clock.duration).to.instanceOf(TimeClock);
      expect(clock.duration.time).to.be.a('number');
    });

    it('remain property will returns as instance of TimeClock.', () => {
      expect(clock.remain).to.instanceOf(TimeClock);
      expect(clock.remain.time).to.be.a('number');
    });
  });
});
