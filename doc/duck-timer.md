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
  interval: undefined, // {Number} Interval time value.
  timeout: undefined, // {Number} Timeout time value.
  onInterval: undefined, // {function} callback function on interval.
  onTimeout: undefined, // {function} callback function on timeout.
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
Set interval time. (optional) and set callback function.

- Syntax
```js
duckTimer.setInterval(ms, callback = null);
```
- Param `Number` ms - interval time (milliseconds).
- Param `Function` [callback = null] - callback function on interval event.
- Return `DuckTimer`

### onTimeout
Attach callback function on `timeout` event.

- Syntax
```js
duckTimer.onTimeout(callback);
```
- Param `Function` callback
- Return `DuckTimer`

### setTimeout
Set timeout time. (optional) and set callback function.

- Syntax
```js
duckTimer.setTimeout(ms, callback = null);
```
- Param `Number` ms - timeout time (milliseconds).
- Param `Function` [callback = null] - callback function on timeout event.
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
