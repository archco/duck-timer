# API

## [DuckTimer](duck-timer.md)

- [constructor](duck-timer.md#constructor)
- [getClock](duck-timer.md#getclock): Return dependency instance of `TimeClock`. See [TimeClock](time-clock.md).
- [getEventEmitter](duck-timer.md#geteventemitter):
  Return dependency instance of `EventEmitter`. See [EventEmitter3](https://github.com/primus/eventemitter3#readme),
[https://nodejs.org/api/events.html](https://nodejs.org/api/events.html)

- [onInterval](duck-timer.md#oninterval):
  Attach callback function on `interval` event.
- [setInterval](duck-timer.md#oninterval): Set interval time. and set callback function (optional).
- [onTimeout](duck-timer.md#ontimeout): Attach callback function on `timeout` event.
- [setTimeout](duck-timer.md#settimeout): Set timeout time. and set callback function (optional).
- [setCountdown](duck-timer.md#setcountdown): Set dates for countdown.
- [setDelay](duck-timer.md#setdelay): Set milliseconds delay before start timer.
- [start](duck-timer.md#start): Timer start.
- [stop](duck-timer.md#stop): Timer stop.
- [reset](duck-timer.md#reset): Timer reset.

## [TimeClock](time-clock.md)

- [constructor](time-clock.md#constructor)
- getters
  - [seconds](time-clock.md#seconds): Return time as seconds.
  - [minutes](time-clock.md#minutes): Return time as minutes.
  - [hours](time-clock.md#hours): Return time as hours.
  - [days](time-clock.md#days): Return time as days.
  - [remain](time-clock.md#remain): Returns `TimeClock` that remains until endDate.
- [setDistance](time-clock.md#setdistance): Set `startDate`, `endDate` and `distance`.
- [toData](time-clock.md#todata): Return time to data object.
- [toTimeString](time-clock.md#totimestring): Return time to string.
