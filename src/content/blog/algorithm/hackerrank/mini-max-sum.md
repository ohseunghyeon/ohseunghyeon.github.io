---
title: Mini-Max Sum
date: 2019-11-19T00:35:41.678Z
description: practice > algorithms > warmup
category: algorithm/hackerrank
---

[출처](https://www.hackerrank.com/challenges/mini-max-sum/problem)

```javascript
// Complete the miniMaxSum function below.
function miniMaxSum(arr) {
  let min = Number.MAX_SAFE_INTEGER
  let max = Number.MIN_SAFE_INTEGER
  let sum = 0

  arr.forEach(n => {
    if (n < min) min = n
    if (n > max) max = n
    sum += n
  })

  process.stdout.write(`${sum - max} ${sum - min}`)
}
```
