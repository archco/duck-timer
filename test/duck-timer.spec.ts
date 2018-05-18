import DuckTimer, { TimeClock } from '../src/duck-timer';

jest.useFakeTimers();

describe('#DuckTimer', () => {
  describe('constructor', () => {
    it('can constructed.', () => {
      const timer = new DuckTimer();
      expect(timer instanceof DuckTimer).toBeTruthy();
    });
  });

  describe('options', () => {
    it('setTime: set time value(milliseconds).', () => {
      const timer = new DuckTimer({ setTime: 1200 });
      expect(timer.time).toBe(1200);
    });

    it('interval: milliseconds value for callback invoke.', () => {
      const timer = new DuckTimer({ interval: 1000 });
      expect(timer.option.interval).toBe(1000);
    });

    it('onInterval: callback function.', () => {
      const timer = new DuckTimer({
        onInterval: jest.fn(),
      });
      const intervalListeners = timer.getEventEmitter().listeners('interval');

      expect(typeof timer.option.onInterval).toBe('function');
      expect(intervalListeners.length).toBe(1);
    });

    it('timeout: Set timeout time(milliseconds).', () => {
      const timer = new DuckTimer({ timeout: 1000 });
      expect(timer.option.timeout).toBe(1000);
    });

    it('onTimeout: set callback when occur "timeout" event.', () => {
      const timer = new DuckTimer({
        onTimeout: jest.fn(),
      });
      const timeoutListeners = timer.getEventEmitter().listeners('timeout');
      expect(typeof timer.option.onTimeout).toBe('function');
      expect(timeoutListeners.length).toBe(1);
    });

    it('countdownDate: set endDate value to "timeClock"', () => {
      const timer = new DuckTimer({ countdownDate: '2010-11-01' });
      const endDate = timer.getClock().endDate;
      expect(endDate instanceof Date).toBeTruthy();
      expect(endDate.getFullYear()).toBe(2010);
    });
  });

  describe('#getClock', () => {
    it('Return instance of TimeClock.', () => {
      const timer = new DuckTimer({ setTime: 3000 });
      expect(timer.getClock() instanceof TimeClock).toBeTruthy();
      expect(timer.getClock().seconds).toBe(3);
    });
  });

  describe('#getEventEmitter', () => {
    it('Return instance of eventemitter3', () => {
      const timer = new DuckTimer();
      timer.setInterval(1000, jest.fn());

      expect(typeof timer.getEventEmitter()).toBe('object');
      expect(timer.getEventEmitter().listeners('interval')).toHaveLength(1);
    });
  });

  describe('Feature: Interval callback', () => {
    it('interval callback\'s response is not empty.', () => {
      const timer = new DuckTimer();
      const callback = jest.fn();
      timer.setInterval(1000, callback).start();
      jest.advanceTimersByTime(1000);

      expect(callback).toBeCalled();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('If interval set 100 milliseconds and clock passed 1 sec, then callback called 10 times.', () => {
      const timer = new DuckTimer({ interval: 100 });
      const callback = jest.fn();
      timer.onInterval(callback).start();
      jest.advanceTimersByTime(1000);

      expect(callback).toBeCalled();
      expect(callback).toHaveBeenCalledTimes(10);
    });
  });

  describe('Feature: Timeout callback', () => {
    it('occurs `timeout` event when timeout has come.', () => {
      const timer = new DuckTimer();
      const callback = jest.fn();

      timer.setTimeout(1000, callback).start();
      jest.advanceTimersByTime(1000);
      expect(callback).toBeCalled();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('In clock, "timeout" and "remain" properties defined automatically.', () => {
      const timer = new DuckTimer();
      const callback = jest.fn();

      timer.setTimeout(3000).start();
      expect(timer.getClock().timeout instanceof TimeClock).toBeTruthy();
      expect(timer.getClock().remain.time).toEqual(3000);
      jest.advanceTimersByTime(3000);
      expect(timer.getClock().remain.time).toEqual(0);
    });
  });

  describe('Feature: Stopwatch', () => {
    let timer: DuckTimer;

    beforeEach(() => {
      timer = new DuckTimer({ interval: 1000, tick: 10 });
    });

    describe('#start', () => {
      it('call start(), then time running.', () => {
        const callback = jest.fn();
        timer.onInterval(callback).start();
        jest.advanceTimersByTime(1000);
        expect(timer.time).toEqual(1000);
        expect(callback).toBeCalled();
      });
    });

    describe('#stop', () => {
      it('If stop during time is running, then time is stop.', () => {
        timer.start();
        jest.advanceTimersByTime(460);
        expect(timer.time).toEqual(460);
        timer.stop();
        jest.advanceTimersByTime(1000);
        expect(timer.time).toEqual(460);
      });
    });

    describe('#reset', () => {
      it('If reset, then time set 0.', () => {
        timer.start();
        jest.advanceTimersByTime(400);
        expect(timer.time).toEqual(400);
        timer.reset();
        expect(timer.time).toEqual(0);
      });
    });
  });

  describe('Feature: Countdown', () => {
    describe('#setCountdown', () => {
      it('Second argument is optional.', () => {
        const timer = new DuckTimer();
        const callback = jest.fn();
        const date = new Date();
        date.setSeconds(date.getSeconds() + 10);
        timer.setCountdown(date).setInterval(1000, callback).start();
        jest.advanceTimersByTime(10000);
        expect(callback).toBeCalled();
        expect(callback).toHaveBeenCalledTimes(10);
      });
    });

    describe('Countdown test.', () => {
      it('1 minute countdown test.', () => {
        const timer = new DuckTimer();
        const callback = jest.fn();
        timer.setCountdown('2017-11-03 00:01:00', '2017-11-03 00:00:00')
          .setInterval(1000, callback).start();
        jest.advanceTimersByTime(60e3);
        expect(callback).toBeCalled();
        expect(callback).toHaveBeenCalledTimes(60);
      });

      it('When countdown finished, "timeout" event is occurred.', () => {
        const timer = new DuckTimer();
        const callback = jest.fn();
        timer.setCountdown('2017-11-03 00:01:00', '2017-11-03 00:00:00')
          .onTimeout(callback)
          .start();
        jest.advanceTimersByTime(60e3);
        expect(callback).toBeCalled();
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });

    describe('Auto delay test.', () => {
      it('Real time = delayed time + time', () => {
        const timer = new DuckTimer();
        const callback = jest.fn();
        const interval = 1000;
        let result: TimeClock;
        timer.setOption({ enableAutoDelay: true })
          .setCountdown('2000-01-01 00:01:00', '2000-01-01 00:00:00.250')
          .setInterval(interval, res => {
            expect(res.remain.time % interval).toEqual(0);
          })
          .onTimeout(res => {
            result = res;
          })
          .start();
        jest.advanceTimersByTime(60e3);
        expect(result.time + result.delayed).toEqual(59750);
      });
    });
  });

  describe('Feature: delay', () => {
    it('can set option: enableAutoDelay (default = true)', () => {
      const timer = new DuckTimer();
      expect(timer.option.enableAutoDelay).toBeTruthy();
      timer.setOption({ enableAutoDelay: false });
      expect(timer.option.enableAutoDelay).toBeFalsy();
    });

    describe('#setDelay', () => {
      it('First argument is delay time.', () => {
        const timer = new DuckTimer();
        let time: number;
        let delayed: number;
        timer.setTimeout(1000, res => {
          time = res.time;
          delayed = res.delayed;
        }).setDelay(1000).start();
        jest.advanceTimersByTime(2000);
        expect(time).toEqual(1000);
        expect(delayed).toEqual(1000);
      });

      it('Second argument is callback when delay done. (optional)', () => {
        const timer = new DuckTimer();
        let time: number;
        let delayed: number;
        timer.setTimeout(1000).setDelay(1000, res => {
          time = res.time;
          delayed = res.delayed;
        }).start();
        jest.advanceTimersByTime(2000);
        expect(time).toEqual(0);
        expect(delayed).toEqual(1000);
      });
    });
  });
});
