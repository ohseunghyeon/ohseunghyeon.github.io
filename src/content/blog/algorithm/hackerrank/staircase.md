---
title: Staircase
date: 2019-11-18T08:31:49.752Z
description: practice > algorithms > warmup
category: algorithm/hackerrank
---

[출처](https://www.hackerrank.com/challenges/staircase/problem)

```javascript
// Complete the staircase function below.
function staircase(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      process.stdout.write(" ")
    }
    for (let k = 0; k < i + 1; k++) {
      process.stdout.write("#")
    }
    process.stdout.write("\n")
  }
}
```
