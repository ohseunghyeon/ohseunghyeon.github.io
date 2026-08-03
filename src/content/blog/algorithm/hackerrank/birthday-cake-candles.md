---
title: Birthday Cake Candles
date: 2019-11-20T01:06:17.175Z
description: practice > algorithms > warmup
category: algorithm/hackerrank
---

[출처](https://www.hackerrank.com/challenges/birthday-cake-candles/problem)

```javascript
// Complete the birthdayCakeCandles function below.
function birthdayCakeCandles(ar) {
  let max = Number.MIN_SAFE_INTEGER
  let cnt = 0

  ar.forEach(n => {
    if (max < n) {
      max = n
      cnt = 0
    }
    if (max === n) {
      cnt++
    }
  })

  return cnt
}
```
