describe('TimeClock', function () {
  describe('constructor', function () {
    it('First argument is milliseconds time.', function () {
      var clock = new TimeClock(1000);
      expect(clock).to.be.instanceOf(TimeClock);
      expect(clock.time).to.equal(1000);
    });
  });

  describe('getters', function () {
    it('seconds: 3000-3999 milliseconds equal to 3 seconds.', function () {
      var clock = new TimeClock(3000);
      expect(clock.seconds).to.equal(3);
      clock.time = 3600;
      expect(clock.seconds).to.equal(3);
    });

    it('minutes: 300,000 milliseconds equal to 5 minutes.', function () {
      var clock = new TimeClock(300000);
      expect(clock.minutes).to.equal(5);
    });

    it('hours: 21,600,000 milliseconds equal to 6 hours.', function () {
      var clock = new TimeClock(21600000);
      expect(clock.hours).to.equal(6);
    });

    it('days: 604,800,000 milliseconds equal to 7 days.', function () {
      var clock = new TimeClock(604800000);
      expect(clock.days).to.equal(7);
    });
  });

  describe('#toData', function () {
    var clock = new TimeClock(8764500000);

    it('Returns time value to data object.', function () {
      expect(clock.toData()).to.be.an('object');
    });

    it("Data have keys: ['day', 'hour', 'min', 'sec', 'ms']", function () {
      expect(clock.toData()).to.have.all.keys(['day', 'hour', 'min', 'sec', 'ms']);
    });
  });

  describe('#toTimeString', function () {
    it('Return time to string as simple format.', function () {
      var clock = new TimeClock(9000000);
      expect(clock.toTimeString()).to.be.a('string');
    });
  });

  describe('#setDistance', function () {
    var clock;

    before(function () {
      clock = new TimeClock();
      clock.setDistance('2017-11-01', '2017-11-30 21:00:00');
    });

    it('startDate and endDate properties are instanceof Date.', function () {
      expect(clock.startDate).to.instanceOf(Date);
      expect(clock.endDate).to.instanceOf(Date);
    });

    it('distance will returns time between startDate and endDate as instance of TimeClock.', function () { // jscs:ignore maximumLineLength
      expect(clock.distance).to.instanceOf(TimeClock);
      expect(clock.distance.time).to.be.a('number');
    });

    it('remain property will returns as instance of TimeClock.', function () {
      expect(clock.remain).to.instanceOf(TimeClock);
      expect(clock.remain.time).to.be.a('number');
    });
  });

  describe('.timeout', function () {
    var clock = new TimeClock();
    clock.setTimeout(3000);

    it('Getter and setter will timeout convert to TimeClock.', function () {
      expect(clock.timeout).to.be.instanceOf(TimeClock);
      expect(clock.timeout.time).to.equal(3000);
    });

    it('Getter "remain" will be available.', function () {
      expect(clock.remain).to.be.instanceOf(TimeClock);
      expect(clock.remain.time).to.equal(3000);
    });
  });
});
