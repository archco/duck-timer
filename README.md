# DuckTimer

[![Node.js CI](https://github.com/archco/duck-timer/actions/workflows/node.js.yml/badge.svg)](https://github.com/archco/duck-timer/actions/workflows/node.js.yml)
[![npm version](https://badge.fury.io/js/duck-timer.svg)](https://www.npmjs.com/package/duck-timer)
[![Downloads](https://img.shields.io/npm/dm/duck-timer.svg)](https://www.npmjs.com/package/duck-timer)

A helpful timer class for both of browsers and node.js.

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

timer.setCountdown(`Dec 25, ${new Date().getFullYear()}`)
  .onInterval(res => console.log(res.remain.seconds))
  .onTimeout(() => console.log('Merry Christmas!!!'))
  .start();
```

## API

Please see [DuckTimer API](https://github.com/archco/duck-timer/blob/master/doc/README.md).

## License

[MIT License](https://github.com/archco/duck-timer/blob/master/LICENSE)
