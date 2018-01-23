describe('DuckTimer', function () {
  describe('constructor', function () {
    it('can constructed.', function () {
      var timer = new DuckTimer();
      expect(timer).to.be.instanceOf(DuckTimer);
    });
  });

  describe('options', function () {
    it('setTime: set time value(milliseconds).', function () {
      var timer = new DuckTimer({ setTime: 1200 });
      expect(timer.time).to.equal(1200);
    });

    it('interval: milliseconds value for callback invoke.', function () {
      var timer = new DuckTimer({ interval: 1000 });
      expect(timer.option.interval).to.equal(1000);
    });

    it('onInterval: callback function.', function () {
      var timer = new DuckTimer({
        onInterval: function (res) {
          console.log(res);
        }
      });
      var listeners = timer.getEventEmitter().listeners('interval');

      expect(timer.option.onInterval).to.be.a('function');
      expect(listeners.length).to.equal(1);
    });

    it('timeout: Set timeout time(milliseconds).', function () {
      var timer = new DuckTimer({ timeout: 1000 });
      expect(timer.option.timeout).to.equal(1000);
    });

    it('onTimeout: callback function that invoke when timeout done or countdown finished.', function () {
      var timer = new DuckTimer({
        onTimeout: function (res) {
          console.log(res);
        }
      });
      var listeners = timer.getEventEmitter().listeners('timeout');
      expect(timer.option.onTimeout).to.be.a('function');
      expect(listeners.length).to.equal(1);
    });

    it('countdownDate: set endDate value to "timeClock"', function () {
      var timer = new DuckTimer({ countdownDate: '2010-11-01' });
      var endDate = timer.getClock().endDate;
      expect(endDate).to.be.instanceOf(Date);
      expect(endDate.getFullYear()).to.equal(2010);
    });
  });

  describe('#getClock', function () {
    it('Return instance of TimeClock.', function () {
      var timer = new DuckTimer({ setTime: 3000 });
      expect(timer.getClock()).to.be.instanceOf(TimeClock);
      expect(timer.getClock().seconds).to.equal(3);
    });
  });

  describe('#getEventEmitter', function () {
    it('Return instance of eventemitter3', function () {
      var timer = new DuckTimer();
      timer.setInterval(1000, function (res) {
        console.log(res);
      });
      expect(timer.getEventEmitter()).to.be.an('object');
      expect(timer.getEventEmitter().listeners('interval')).is.not.empty;
    });
  });

  describe('Feature: Interval callback', function () {
    var clock;

    beforeEach(function () {
      clock = sinon.useFakeTimers();
    });

    afterEach(function () {
      clock.restore();
    });

    it('interval callback\'s response is not empty.', function () {
      var timer = new DuckTimer();
      timer.setInterval(1000, function (res) {
        expect(res).is.not.empty;
        expect(res).to.be.instanceOf(TimeClock);
      }).start();
      clock.tick(1000);
    });

    it('If interval set 100 milliseconds and clock passed 1 sec, then callback called 10 times.', function () { //jscs:ignore
      var timer = new DuckTimer({ interval: 100 });
      var count = 0;
      timer.onInterval(function () {
        count++;
      }).start();
      clock.tick(1000);
      expect(count).to.equal(10);
    });
  });

  describe('Feature: Timeout callback', function () {
    var clock;

    beforeEach(function () {
      clock = sinon.useFakeTimers();
    });

    afterEach(function () {
      clock.restore();
    });

    it('If timeout time is come, then "timeout" event will occur.', function () {
      var timer = new DuckTimer({ timeout: 3000 });
      var occurred = false;
      timer.onTimeout(function (res) {
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

    it('In clock, "timeout" and "remain" properties defined automatically.', function () {
      var timer = new DuckTimer();
      var result;
      timer.setTimeout(3000).start();
      expect(timer.getClock().timeout).to.be.instanceOf(TimeClock);
      expect(timer.getClock().remain.time).to.equal(3000);
      clock.tick(3000);
      expect(timer.getClock().remain.time).to.equal(0);
    });
  });

  describe('Feature: Stopwatch', function () {
    var clock;
    var timer;

    beforeEach(function () {
      clock = sinon.useFakeTimers();
      timer = new DuckTimer({ interval: 1000, tick: 10 });
    });

    afterEach(function () {
      clock.restore();
    });

    describe('#start', function () {
      it('call start(), then time running.', function () {
        timer.onInterval(function (res) {
          expect(res.time).to.equal(1000);
        }).start();
        clock.tick(1000);
      });
    });

    describe('#stop', function () {
      it('If stop during time is running, then time is stop.', function () {
        timer.start();
        clock.tick(460);
        expect(timer.time).to.equal(460);
        timer.stop();
        clock.tick(540);
        expect(timer.time).to.equal(460);
      });
    });

    describe('#reset', function () {
      it('If reset, then time set 0.', function () {
        timer.start();
        clock.tick(400);
        expect(timer.time).to.equal(400);
        timer.reset();
        expect(timer.time).to.equal(0);
      });
    });
  });

  describe('Feature: Countdown', function () {
    var clock;
    var timer;

    beforeEach(function () {
      clock = sinon.useFakeTimers();
      timer = new DuckTimer();
    });

    afterEach(function () {
      clock.restore();
    });

    describe('#setCountdown', function () {
      it('Second argument is optional.', function () {
        var m = 5;
        var date = new Date();
        date.setMinutes(date.getMinutes() + m);
        timer.setCountdown(date)
          .setInterval(60000, function (res) {
            m--;
            expect(res.remain.minutes).to.equal(m);
          }).start();
        clock.tick(300000);
        expect(m).to.equal(0);
      });
    });

    describe('Countdown test.', function () {
      it('5 minutes countdown test.', function () {
        var m = 5;
        timer.setCountdown('2017-11-03 00:05:00', '2017-11-03 00:00:00')
          .setInterval(60000, function (res) {
            m--;
            expect(res.remain.minutes).to.equal(m);
          }).start();
        clock.tick(300000);
        expect(m).to.equal(0);
      });

      it('When countdown finished, "timeout" event is occurred.', function () {
        var occurred = false;
        timer.setCountdown('2017-11-03 00:05:00', '2017-11-03 00:00:00')
          .onTimeout(function () {
            occurred = true;
          }).start();
        clock.tick(300000);
        expect(occurred).to.be.true;
      });
    });

    describe('Auto delay test.', function () {
      it('Real time = delayed time + time', function () {
        var interval = 1000;
        var result;
        timer.setOption({ enableAutoDelay: true })
          .setCountdown('2000-01-01 00:05:00', '2000-01-01 00:00:00.250')
          .setInterval(interval, function (res) {
            expect(res.remain.time % interval).to.equal(0);
          })
          .onTimeout(function (res) {
            result = res;
          })
          .start();
        clock.tick(300000);
        expect(result.time + result.delayed).to.equal(299750);
      });
    });
  });

  describe('Feature: delay', function () {
    var clock;
    var timer;

    beforeEach(function () {
      clock = sinon.useFakeTimers();
      timer = new DuckTimer();
    });

    afterEach(function () {
      clock.restore();
    });

    it('can set option: enableAutoDelay (default = true)', function () {
      expect(timer.option.enableAutoDelay).to.be.true;
      timer.setOption({ enableAutoDelay: false });
      expect(timer.option.enableAutoDelay).to.be.false;
    });

    describe('#setDelay', function () {
      it('First argument is delay time.', function () {
        var time;
        var delayed;
        timer.setTimeout(1000, function (res) {
          time = res.time;
          delayed = res.delayed;
        }).setDelay(1000).start();
        clock.tick(3000);
        expect(time).to.equal(1000);
        expect(delayed).to.equal(1000);
      });

      it('Second argument is callback when delay done. (optional)', function () {
        var time;
        var delayed;
        timer.setTimeout(1000).setDelay(1000, function (res) {
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
