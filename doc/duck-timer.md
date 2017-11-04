# DuckTimer

### constructor
- Syntax
```js
let duckTimer = new DuckTimer(option = {});
```
- Param `Object` [option = {}]
- options
```js
let defaultOpion = {
  setTime: 0, // {Number} Set default time (milliseconds)
  tick: 10, // {Number} Time of one ticking.
  interval: 100, // {Number} Interval time value.
  onInterval: undefined, // {function} callback function on interval.
  countdownDate: undefined, // {Date|String} The goal date when use countdown.
  // Event names.
  eventName: {
    interval: 'interval',
    done: 'done',
  },
};
```

### onInterval
Attach callback function on `interval` event.

- Syntax
```js
duckTimer.onInterval(callback);
```
- Param `Function` callback
- Return `DuckTimer`

### setInterval
Set interval time.

- Syntax
```js
duckTimer.setInterval(ms, callback = null);
```
- Param `Number` ms - interval time (milliseconds).
- Param `Function` [callback = null] - callback function on interval event.
- Return `DuckTimer`

### setCountdown
Set dates for countdown.

- Syntax
```js
duckTimer.setCountdown(date, startDate = 'now')
```
- Param `Date|String` date - Set goal date.
- Param `Date|String` [startDate = 'now'] - Set start date.
- Return `DuckTimer`

### start
Clock start.

- Syntax
```js
duckTimer.start();
```
- Return `void`

### stop
Clock stop for stopwatch.

- Syntax
```js
duckTimer.stop();
```
- Return `void`

### reset
Clock reset for stopwatch.

- Syntax
```js
duckTimer.reset();
```
- Return `void`
