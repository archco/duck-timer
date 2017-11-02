/************************************************************
  Brower test.
*************************************************************/
const expect = window.chai.expect;
const sinon = window.sinon;
const mod = window.DuckTimer;
const DuckTimer = mod.default;

describe('DuckTimer', () => {
  describe('constructor', () => {
    it('constructible.', () => {
      let timer = new DuckTimer();
      expect(timer).to.be.instanceOf(DuckTimer);
    });
  });

  describe('options', () => {
    it('setDate: set Date value to "timer.date"', () => {
      let timer = new DuckTimer({ setDate: '' });
      expect(timer.date).to.be.instanceOf(Date);
      timer = new DuckTimer({ setDate: '2010-11-01' });
      expect(timer.date.getFullYear()).to.equal(2010);
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
      expect(timer.listeners('interval', true)).to.be.true;
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

    it('interval callback\'s argument is not empty.', () => {
      let timer = new DuckTimer({ interval: 1000 });
      timer.on('interval', res => {
        expect(res).is.not.empty;
      });
      timer.start();
      clock.tick(1000);
    });

    it('If interval set 100 milliseconds and clock passed 1 sec, then callback called 10 times.', () => { //jscs:ignore
      let timer = new DuckTimer({ interval: 100 });
      let count = 0;
      timer.on('interval', () => count++);
      timer.start();
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
        timer.on('interval', res => {
          expect(res.time).to.equal(1000);
        });
        timer.start();
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
