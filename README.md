# DuckTimer

The helpful timer class for browser and node.js.

## Installation

``` sh
npm install duck-timer
```

## Usage

### Stopwatch

``` js
import DuckTimer from 'duck-timer';
const timer = new DuckTimer({ interval: 100 }); // interval time: 100ms = 0.1sec.

// start.
timer.onInterval(res => {
  console.log(res.seconds);
}).start();

// stop.
timer.stop();

// reset.
timer.reset();
```

### Countdown

``` js
import DuckTimer from 'duck-timer';
const timer = new DuckTimer({ interval: 1000 });

timer.setCountdown('2017-12-25 00:00:00')
  .onInterval(res => console.log(res.remain.seconds))
  .onTimeout(() => console.log('Merry Christmas!!!'))
  .start();
```

## API

Please see [DuckTimer API](https://github.com/archco/duck-timer/blob/master/doc/README.md).

## License

[MIT License](https://github.com/archco/duck-timer/blob/master/LICENSE)
