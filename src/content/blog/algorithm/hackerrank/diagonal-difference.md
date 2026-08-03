---
title: Diagonal Difference
date: 2019-11-13T00:46:59.015Z
description: practice > algorithms > warmup
category: algorithm/hackerrank
---

[출처](https://www.hackerrank.com/challenges/diagonal-difference/problem)

```javascript
/*
 * Complete the 'diagonalDifference' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts 2D_INTEGER_ARRAY arr as parameter.
 */

function diagonalDifference(arr) {
  const length = arr.length

  const [leftToRight, rightToLeft] = arr.reduce(
    (diagonals, row, index) => {
      diagonals[0] += row[index]
      diagonals[1] += row[length - 1 - index]

      return diagonals
    },
    [0, 0]
  )

  return Math.abs(leftToRight - rightToLeft)
}
```
