import chai from 'chai';
import sinon from 'sinon';
import DuckTimer, { TimeClock } from '../../lib/duck-timer.mod';

global.expect = chai.expect;
global.sinon = sinon;
global.DuckTimer = DuckTimer;
global.TimeClock = TimeClock;
