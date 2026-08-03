---
title: Plus Minus
date: 2019-11-15T00:26:57.526Z
description: practice > algorithms > warmup
category: algorithm/hackerrank
---

[출처](https://www.hackerrank.com/challenges/plus-minus/problem)

```javascript
// Complete the plusMinus function below.
function plusMinus(arr) {
  const length = arr.length
  const count = [0, 0, 0]

  arr.forEach(n => {
    if (n > 0) count[0]++
    else if (n < 0) count[1]++
    else count[2]++
  })

  count.forEach(c => process.stdout.write((c / length).toFixed(6) + "\n"));
```
