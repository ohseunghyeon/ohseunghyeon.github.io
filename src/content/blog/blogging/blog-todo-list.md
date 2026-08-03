---
title: Blog 꾸미기
date: "2019-09-03T09:19:59.297Z"
description: 새로 만든 Gatsby 블로그를 내 마음대로 뜯어 고치기 위한 여정
category: blogging
---

본격적인 일기를 쓰기 위해서 블로그를 새로 만들었다.

블로그를 만들기 위해서 사용한 도구는 Gatsby이다. Gatsby는 `정적 사이트 생성기`이고, React를 기반으로 작동한다. 최근에 React를 공부하고 있기 떄문에, 이 도구를 쓰는 게 도움이 되지 않을까 생각했다.

블로그를 생성하기 위한 기본 틀은 [gatsby-starter-blog](https://www.gatsbyjs.org/starters/gatsbyjs/gatsby-starter-blog/)를 사용했다. gatsby에서 제공하는 템플릿인데, starter라는 이름에 맞게 레이아웃이나 스타일이 정말 기본적이고, 아무것도 없다.

그래서 나는 고치고 싶은 부분들을 리스트로 정리해서 하나하나 하기로 했다.

- [x] emoji 적용하기 :cat: - [gatsby-remark-emojis](https://www.gatsbyjs.org/packages/gatsby-remark-emojis/) 2019.9.3
- [x] font 가독성 좋게 바꾸기
- [x] now 연동해서 풀 리퀘스트 자동 배포하기
- [x] [code block theme 설정](https://www.gatsbyjs.org/packages/gatsby-remark-prismjs/) - gatsby-browser.js - import "prismjs/themes/prism-tomorrow.css"
- [x] [이미지 클릭 시 새 창이 아닌 블로그 내에서 띄우기](https://www.gatsbyjs.org/packages/gatsby-remark-images-medium-zoom/)
- [x] [github actions로 자동 배포하기](/blogging/deploying-github-pages-with-github-actions/)
- [x] [excluding draft blog on build](/blogging/add-draft-feature/)
- [x] [about 페이지 만들기](/blogging/making-about-pages/)
- [x] [새로운 게시글을 만드는 script 생성](/blogging/making-new-post-script/) - [Jbee](https://jbee.io/) 님의 스크립트를 참고하여 생성 (감사합니다)
- [x] [몇 분짜리 글인지 표시](/blogging/add-reading-time-of-post) - [gatsby-remark-reading-time](https://www.gatsbyjs.org/packages/gatsby-remark-reading-time)
- [x] [카테고리 넣기](/blogging/making-category-page/)
- [x] 댓글 달기 - https://utteranc.es/
- [x] [Light/Dark Theme 넣기](/blogging/applying-dark-mode-on-gatsby-blog/)
- [x] 글 내의 목차
