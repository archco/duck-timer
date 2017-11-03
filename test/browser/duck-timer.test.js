/************************************************************
  Browser test.
*************************************************************/
const expect = window.chai.expect;
const sinon = window.sinon;
const mod = window.DuckTimer;
const DuckTimer = mod.default;
const TimeClock = mod.TimeClock;

describe('DuckTimer', () => {
  describe('constructor', () => {
    it('constructible.', () => {
      let timer = new DuckTimer();
      expect(timer).to.be.instanceOf(DuckTimer);
    });
  });

  describe('options', () => {
    it('setTime: set time value(milliseconds).', () => {
      let timer = new DuckTimer({ setTime: 1200 });
      expect(timer.time).to.equal(1200);
    });

    it('interval: milliseconds value for callback invoke.', () => {
      let timer = new DuckTimer({ interval: 1000 });
      expect(timer.option.interval).to.equal(1000);
    });

    it('onInterval: callback function.', () => {
      let timer = new DuckTimer({ onInterval: (res) => console.log(res) });
      expect(timer.option.onInterval).to.be.a('function');
      expect(timer.getEventEmitter().listeners('interval', true)).to.be.true;
    });

    it('countdownDate: set endDate value to "timeClock"', () => {
      let timer = new DuckTimer({ countdownDate: '2010-11-01' });
      let endDate = timer.getClock().endDate;
      expect(endDate).to.be.instanceOf(Date);
      expect(endDate.getFullYear()).to.equal(2010);
    });
  });

  describe('Feature: Interval callback', () => {
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
      timer.onInterval(() => count++).start();
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
    let clock;
    let timer;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
      timer = new DuckTimer({ interval: 60000, tick: 10 });
    });

    afterEach(() => {
      clock.restore();
    });

    it('works.', () => {
      let m = 5;
      timer.setCountdown('2017-11-03 00:05:00', '2017-11-03 00:00:00')
        .onInterval(res => {
          m--;
          expect(res.remain.minutes).to.equal(m);
        }).start();
      clock.tick(300000);
    });
  });
});
