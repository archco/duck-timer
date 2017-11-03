import chai from 'chai';
import sinon from 'sinon';
import DuckTimer from '../lib/duck-timer.mod';
import { TimeClock } from '../lib/duck-timer.mod';
const expect = chai.expect;

describe('DuckTimer', () => {
  describe('constructor', () => {
    it('constructible.', () => {
      let timer = new DuckTimer();
      expect(timer).to.be.instanceOf(DuckTimer);
    });
  });

  describe('options', () => {
    it('setGoal: set goal date value to "clock.endDate"', () => {
      let timer = new DuckTimer({ setGoal: '2010-11-01' });
      let endDate = timer.getClock().endDate;
      expect(endDate).to.be.instanceOf(Date);
      expect(endDate.getFullYear()).to.equal(2010);
    });

    it('setTime: set time value(milliseconds).', () => {
      let timer = new DuckTimer({ setTime: 1200 });
      expect(timer.time).to.equal(1200);
    });

    it('interval: milliseconds value for callback invoke.', () => {
      let timer = new DuckTimer({ interval: 1000 });
      expect(timer.option.interval).to.equal(1000);
    });

    it('countdown: boolean option for determine whether time will countdown until date.', () => {
      let timer = new DuckTimer({ countdown: true });
      expect(timer.option.countdown).to.be.a('boolean');
      expect(timer.option.countdown).to.be.true;
    });

    it('onInterval: callback function.', () => {
      let timer = new DuckTimer({ onInterval: (res) => console.log(res) });
      expect(timer.option.onInterval).to.be.a('function');
      expect(timer.getEventEmitter().listeners('interval', true)).to.be.true;
    });
  });

  describe('Feature: Timer callback', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('interval callback\'s response is not empty.', () => {
      let timer = new DuckTimer();
      timer.setInterval(1000, res => {
        expect(res).is.not.empty;
        expect(res).to.be.instanceOf(TimeClock);
      }).start();
      clock.tick(1000);
    });

    it('If interval set 100 milliseconds and clock passed 1 sec, then callback called 10 times.', () => { //jscs:ignore
      let timer = new DuckTimer({ interval: 100 });
      let count = 0;
      timer.setInterval(100, () => count++).start();
      clock.tick(1000);
      expect(count).to.equal(10);
    });
  });

  describe('Feature: Stopwatch', () => {
    let clock;
    let timer;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
      timer = new DuckTimer({ interval: 1000, tick: 10 });
    });

    afterEach(() => {
      clock.restore();
    });

    describe('#start', () => {
      it('call start(), then time running.', () => {
        timer.onInterval(res => expect(res.time).to.equal(1000))
          .start();
        clock.tick(1000);
      });
    });

    describe('#stop', () => {
      it('If stop during time is running, then time is stop.', () => {
        timer.start();
        clock.tick(460);
        expect(timer.time).to.equal(460);
        timer.stop();
        clock.tick(540);
        expect(timer.time).to.equal(460);
      });
    });

    describe('#reset', () => {
      it('If reset, then time set 0.', () => {
        timer.start();
        clock.tick(400);
        expect(timer.time).to.equal(400);
        timer.reset();
        expect(timer.time).to.equal(0);
      });
    });
  });

  describe('Feature: Countdown', () => {
    // body...
  });
});
