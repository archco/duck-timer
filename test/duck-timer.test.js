import chai from 'chai';
import DuckTimer from '../lib/duck-timer.mod';
const expect = chai.expect;

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
});
