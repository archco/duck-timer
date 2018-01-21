describe('DuckTimer', () => {
  describe('constructor', () => {
    it('can constructed.', () => {
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
      let timer = new DuckTimer({ onInterval: res => console.log(res) });
      let listeners = timer.getEventEmitter().listeners('interval');

      expect(timer.option.onInterval).to.be.a('function');
      expect(listeners.length).to.equal(1);
    });

    it('timeout: Set timeout time(milliseconds).', () => {
      let timer = new DuckTimer({ timeout: 1000 });
      expect(timer.option.timeout).to.equal(1000);
    });

    it('onTimeout: callback function that invoke when timeout done or countdown finished.', () => {
      let timer = new DuckTimer({ onTimeout: res => console.log(res) });
      let listeners = timer.getEventEmitter().listeners('timeout');
      expect(timer.option.onTimeout).to.be.a('function');
      expect(listeners.length).to.equal(1);
    });

    it('countdownDate: set endDate value to "timeClock"', () => {
      let timer = new DuckTimer({ countdownDate: '2010-11-01' });
      let endDate = timer.getClock().endDate;
      expect(endDate).to.be.instanceOf(Date);
      expect(endDate.getFullYear()).to.equal(2010);
    });
  });

  describe('#getClock', () => {
    it('Return instance of TimeClock.', () => {
      let timer = new DuckTimer({ setTime: 3000 });
      expect(timer.getClock()).to.be.instanceOf(TimeClock);
      expect(timer.getClock().seconds).to.equal(3);
    });
  });

  describe('#getEventEmitter', () => {
    it('Return instance of eventemitter3', () => {
      let timer = new DuckTimer();
      timer.setInterval(1000, res => console.log(res));
      expect(timer.getEventEmitter()).to.be.an('object');
      expect(timer.getEventEmitter().listeners('interval')).is.not.empty;
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

  describe('Feature: Timeout callback', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('If timeout time is come, then "timeout" event will occur.', () => {
      let timer = new DuckTimer({ timeout: 3000 });
      let occurred = false;
      timer.onTimeout(res => {
        expect(res).to.be.instanceOf(TimeClock);
        occurred = true;
      }).start();
      clock.tick(3000);
      expect(occurred).to.be.true;

      // again.
      occurred = false;
      timer.start();
      clock.tick(3000);
      expect(occurred).to.be.true;
    });

    it('In clock, "timeout" and "remain" properties defined automatically.', () => {
      let timer = new DuckTimer();
      let result;
      timer.setTimeout(3000).start();
      expect(timer.getClock().timeout).to.be.instanceOf(TimeClock);
      expect(timer.getClock().remain.time).to.equal(3000);
      clock.tick(3000);
      expect(timer.getClock().remain.time).to.equal(0);
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
      timer = new DuckTimer();
    });

    afterEach(() => {
      clock.restore();
    });

    describe('#setCountdown', () => {
      it('Second argument is optional.', () => {
        let m = 5;
        let date = new Date();
        date.setMinutes(date.getMinutes() + m);
        timer.setCountdown(date)
          .setInterval(60000, res => {
            m--;
            expect(res.remain.minutes).to.equal(m);
          }).start();
        clock.tick(300000);
        expect(m).to.equal(0);
      });
    });

    describe('Countdown test.', () => {
      it('5 minutes countdown test.', () => {
        let m = 5;
        timer.setCountdown('2017-11-03 00:05:00', '2017-11-03 00:00:00')
          .setInterval(60000, res => {
            m--;
            expect(res.remain.minutes).to.equal(m);
          }).start();
        clock.tick(300000);
        expect(m).to.equal(0);
      });

      it('When countdown finished, "timeout" event is occurred.', () => {
        let occurred = false;
        timer.setCountdown('2017-11-03 00:05:00', '2017-11-03 00:00:00')
          .onTimeout(() => {
            occurred = true;
          }).start();
        clock.tick(300000);
        expect(occurred).to.be.true;
      });
    });

    describe('Auto delay test.', () => {
      it('Real time = delayed time + time', () => {
        let interval = 1000;
        let result;
        timer.setOption({ enableAutoDelay: true })
          .setCountdown('2000-01-01 00:05:00', '2000-01-01 00:00:00.250')
          .setInterval(interval, res => {
            expect(res.remain.time % interval).to.equal(0);
          })
          .onTimeout(res => {
            result = res;
          })
          .start();
        clock.tick(300000);
        expect(result.time + result.delayed).to.equal(299750);
      });
    });
  });

  describe('Feature: delay', () => {
    let clock;
    let timer;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
      timer = new DuckTimer();
    });

    afterEach(() => {
      clock.restore();
    });

    it('can set option: enableAutoDelay (default = true)', () => {
      expect(timer.option.enableAutoDelay).to.be.true;
      timer.setOption({ enableAutoDelay: false });
      expect(timer.option.enableAutoDelay).to.be.false;
    });

    describe('#setDelay', () => {
      it('First argument is delay time.', () => {
        let time;
        let delayed;
        timer.setTimeout(1000, res => {
          time = res.time;
          delayed = res.delayed;
        }).setDelay(1000).start();
        clock.tick(3000);
        expect(time).to.equal(1000);
        expect(delayed).to.equal(1000);
      });

      it('Second argument is callback when delay done. (optional)', () => {
        let time;
        let delayed;
        timer.setTimeout(1000).setDelay(1000, res => {
          time = res.time;
          delayed = res.delayed;
        }).start();
        clock.tick(2000);
        expect(time).to.equal(0);
        expect(delayed).to.equal(1000);
      });
    });
  });
});
