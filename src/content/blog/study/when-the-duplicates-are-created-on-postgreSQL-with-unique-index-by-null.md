---
title: PostgreSQL, unique index 컬럼에 null 삽입으로 인한 중복 생성 문제
date: 2020-11-16T02:57:09.238Z
description: null도 중복처리 될 줄 알았지 ..
category: study
---

## 문제의 발단

Unique index가 걸려있는데 데이터가 중복으로 들어가는 현상을 발견했다.

원인은 Null

Null은 서로 같지 않기 때문에 unique가 걸려 있는 컬럼이라도 Null이 들어가면 서로 다른 것으로 인지된다.
## 해결 방법

몇 가지 해결 방법을 생각했다.

1. Null인 경우 Null이 아닌 특정 문자열(쓰레기 값)을 넣어서 중복을 인지하게 만들자.

생각 후 바로 기각했다. 우선 쓰레기 값을 넣는 게 마음에 안 들었다. 그 값이 무슨 값인지 다른 사람이 보면 알 방법이 없다.

2. partial query를 사용한 Unique index 생성

(참조 - https://stackoverflow.com/questions/8289100/create-unique-constraint-with-null-columns)

이 방법도 기각했다. 아마 Null이 허용되는 컬럼이 하나뿐이었으면 이 방법을 고려했을지도 모르겠다.

3. 테이블 분리

아마 이 방법은 특수한 상황에서만 가능할 것 같다. 대개 2번이 해결방안이 되지 않을까 싶다.

내 경우 null이 있는 컬럼이 여럿이었다. 예를 들어서 a b c d 컬럼이 있을 때, a 컬럼에 따라서 3가지 경우가 있는 것과 같았다.

| a | b | c | d |
| - | - | - | - |
| 1 | O | null | null |
| 2 | O | 0 | null |
| 3 | O | 0 | 0 |

만약 이 경우의 수가 좀 더 랜덤했다면 나는 2번도 쓰지 않고 1번을 최후의 보루로 생각했을 것이다.

그러나 케이스가 좀 깔끔했기 때문에 테이블을 분리하면 더 깔끔한 구조가 될 것이라 생각했다.

결과는 만족.

----

postgres 15 버전부터 `UNIQUE NULLS NOT DISTINCT` 라는 예약어로 유니크를 설정할 경우 NULL이 하나로 취급된다.
