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
});
