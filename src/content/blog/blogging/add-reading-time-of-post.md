---
title: Gatsby 블로그에 Reading time 추가하기
date: 2019-09-24T13:36:30.699Z
description: gastby-transformer-remark는 timeToRead를 생성한다
category: blogging
---

## 계기

redux를 만든 Dan Abramov의 [블로그](https://overreacted.io/)에 가면 게시글마다 reading time이 표시되어 있다.
사실 나는 이런 기능을 예전에 어딘가에서 본 적이 있지만, 어디가 원조였는지도 모르고, 어떻게 구현하는지도 모르며, 알고 싶지도 않다.

중요한 건 저게 쿨해보였다는 거다.

## 적용해보기

혹시 plugin이 있나? 하고 찾아봤더니 다음과 같은 플러그인이 있었다.

> [gatsby-remark-reading-time](https://www.gatsbyjs.org/packages/gatsby-remark-reading-time)

이걸 발견한 나는 곧바로 설치하고 블로그에 적용했다. 저 이모지는 배껴왔고, 로직은 만들었다가 더 나은 로직이 보여서 그대로 배껴왔다.

그런데 이상한 점은, Abramov의 블로그 소스에서는 나와 다른 방식으로 reading time을 가져오고 있었는데, 심지어 reading time을 가져오는 plugin이 없었다.

**이게 어떻게 된 일이지?**

대신 timeToRead가 있다. 얘는 plugin으로 추가하는 게 아닌가?
곧장 **graphiql 도구**로 가서 다음 쿼리를 실행했다.

```graphql
  query {
    allMarkdownRemark(...) {
      edges {
        node {
          // highlight-next-line
          timeToRead
        }
      }
    }
  }
```

그랬더니 *분*에 해당하는 number가 고스란히 출력되는 걸 확인할 수 있었다.

## 따라해보기

query에 timeToRead를 추가한 파일은 다음과 같다

1. /src/pages/index.js

```graphql
  query BlogPostBySlug($slug: String!) {
    ...
    markdownRemark(...) {
      ...
      timeToRead
      ...
    }
  }
```

2. /src/templates/blog-post.js

```graphql
query {
    ...
    allMarkdownRemark(...) {
      edges {
        node {
          ...
          timeToRead
          ...
        }
      }
    }
  }
```

그러면 각각 **1. post.timeToRead**와 **2. node.timeToRead**로 값에 접근할 수 있다.

이 값을 이쁜 커피잔과 도시락으로 변경하는 로직은 overreacted.io 저장소의 [/src/utils/helpers.js](https://github.com/gaearon/overreacted.io/blob/efdf124152fa5cd5eae44f62e3ba73c27d4a3e38/src/utils/helpers.js#L1)에서 확인하면 된다.
