---
title: Utopian Tree
date: "2019-09-05T02:00:00.000Z"
description: hackkerrank practice
category: algorithm/hackerrank
---

```none
Author dheeraj
Difficulty Easy
```

## Problem

The Utopian Tree goes through 2 cycles of growth every year. Each spring, it doubles in height. Each summer, its height increases by 1 meter.

Laura plants a Utopian Tree sapling with a height of 1 meter at the onset of spring. How tall will her tree be after `n` growth cycles?

For example, if the number of growth cycles is `n = 5`, the calculations are as follows:

|Period|Height|
|-|-|
|0|1|
|1|2|
|2|3|
|3|6|
|4|7|
|5|14|

### Function Description

Complete the utopianTree function in the editor below. It should return the integer height of the tree after the input number of growth cycles.

utopianTree has the following parameter(s):

- n: an integer, the number of growth cycles to simulate

### Input Format

The first line contains an integer, `t`, the number of test cases.
`t` subsequent lines each contain an integer, `n`, denoting the number of cycles for that test case.

### Constraints

```
1 <= t <= 10
0 <= n <= 60
```

### Output Format

For each test case, print the height of the Utopian Tree after  cycles. Each height must be printed on a new line.

### Sample Input

```
3
0
1
4
```

### Sample Output

```
1
2
7
```

Explanation

There are 3 test cases.

In the first case (`n = 0`), the initial height (`H = 1`) of the tree remains unchanged.

In the second case (`n = 1`), the tree doubles in height and is `2` meters tall after the spring cycle.

In the third case (`n = 4`), the tree doubles its height in spring (`n = 1`, `H = 2`), then grows a meter in summer (`n = 2`, `H = 3`), then doubles after the next spring (`n = 3`, `H = 6`), and grows another meter after summer (`n = 4`, `H = 7`). Thus, at the end of 4 cycles, its height is `7` meters.

## 풀이

간단한 문제다.

인자로 들어오는 n는 싸이클의 횟수.

그리고 싸이클은 봄-여름-봄-여름 이렇게 반복된다.

처음 봄으로 시작해서 싸이클마다 봄이면 `* 2`, 여름이면 `+ 1` 하면 된다.

```javascript
  function utopianTree(n) {
      let h = 1;

      for (let i = 1; i <= n; i++) {
        i % 2 === 0 ? h++ : h *= 2;
      }

      return h;
  }
```

