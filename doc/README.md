# API

## [DuckTimer](duck-timer.md)
- [constructor](duck-timer.md#constructor)
- [onInterval](duck-timer.md#oninterval): Attach callback function on `interval` event.
- [setInterval](duck-timer.md#oninterval): Set interval time.
- [setCountdown](duck-timer.md#setcountdown): Set dates for countdown.
- [start](duck-timer.md#start): Clock start.
- [stop](duck-timer.md#stop): Clock stop for stopwatch.
- [reset](duck-timer.md#reset): Clock reset for stopwatch.

## [TimeClock](time-clock.md)
- [constructor](time-clock.md#constructor)
- getters
  - [seconds](time-clock.md#seconds): Return time as seconds.
  - [minutes](time-clock.md#minutes): Return time as minutes.
  - [hours](time-clock.md#hours): Return time as hours.
  - [days](time-clock.md#days): Return time as days.
  - [remain](time-clock.md#remain): Returns `TimeClock` that remains until endDate.
- [setDistance](time-clock.md#setdistance): Set `startDate`, `endDate` and `distnace`.
- [toData](time-clock.md#todata): Return time to data object.
- [toTimeString](time-clock#totimestring): Return time to string.
