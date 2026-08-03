---
title: Time Conversion
date: 2019-11-21T01:00:23.328Z
description: practice > algorithms > warmup
category: algorithm/hackerrank
---

[출처](https://www.hackerrank.com/challenges/time-conversion/problem)

```javascript
function timeConversion(s) {
  /*
   * Write your code here.
   */
  const ampm = s.slice(-2)
  let hours = Number(s.slice(0, 2))

  if (s.slice(-2) === "AM") {
    if (hours === 12) {
      hours = 0
    }
  } else {
    if (hours < 12) {
      hours += 12
    }
  }

  return hours.toString().padStart(2, "0") + s.slice(2, -2)
}
```
