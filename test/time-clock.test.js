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
    it('description', () => {
      let clock = new TimeClock(9000000);
      console.log(clock.toTimeString());
      expect(clock.toTimeString()).is.not.empty;
    });
  });
});
