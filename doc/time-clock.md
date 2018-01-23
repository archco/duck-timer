# TimeClock

### constructor

- Syntax
  ``` js
  let timeClock = new TimeClock(milliseconds = 0);
  ```
- Param `Number` [milliseconds = 0]

### seconds

Return time as seconds.

``` js
let seconds = timeClock.seconds;
```

### minutes

Return time as minutes.

``` js
let minutes = timeClock.minutes;
```

### hours

Return time as hours.

``` js
let hours = timeClock.hours;
```

### days

Return time as days.

``` js
let days = timeClock.days;
```

### remain

Returns `TimeClock` that remains until endDate.

``` js
let remainTimeClock = timeClock.remain;
```

### setDistance

Set startDate, endDate and distance.

- Syntax
  ``` js
  timeClock.setDistance(start, end);
  ```
- Param `Date|String` start
- Param `Date|String` end
- Return `void`

### toData

Return time to data object.

- Syntax
  ``` js
  let obj = timeClock.toData();
  ```
- Return `Object` - object keys: `day` `hour` `min` `sec` `ms`

### toTimeString

Return time to string.

- Syntax
  ``` js
  let str = timeClock.toTimeString();
  ```
- Return `String` - e.g. '2d 05h 33m 21s 420ms'
