---
title: Compare the Triplets
date: 2019-10-31T02:28:15.825Z
description: practice > algorithms > warmup
category: algorithm/hackerrank
---

[출처](https://www.hackerrank.com/challenges/compare-the-triplets/problem)

```javascript
// Complete the compareTriplets function below.
function compareTriplets(a, b) {
    const points = [0, 0];

    for (let i = 0; i < 3; i++) {
        if (a[i] > b[i]) {
            points[0]++;
        } else if (a[i] < b[i]) {
            points[1]++;
        }
    }
    return points;
}
```
