---
title: gatsby-starter-blog 새로운 글 생성 스크립트 만들기
date: 2019-09-24T09:39:24.575Z
description: inquirer로 스크립트 만들기
category: blogging
---

## Gatsby는 새로운 post를 만드는 스크립트가 없다

예전에 Jekyll이나 hexo를 사용해본 바 둘 다 **새로운 포스트 생성 명령어**가 있었다. 그런데 왜 Gatsby에는 없을까? 아마 Gatsby는 블로그 생성이 툴의 주 목적이 아니기 때문으로 보인다.

왜 있는지 없는지는 사실 중요하지 않다. 없다는 점. 그리고 그 사실이 나에게 주는 귀차니즘이 작지 않다는 점이 중요하다. 파일을 만들고, 새로운 frontmatter를 복사하거나 적을 때 오는 상실감(상실감까지야..)은 이루 말할 수 없다.

그래서 만들기로 했다. 이전에 [Jbee](https://jbee.io/)님의 [gatsby-starter-bee](https://github.com/JaeYeopHan/gatsby-starter-bee)에서 포스트를 만드는 스크립트를 본 적이 있다. 그걸 따라서 만들기로 했다.

## 스크립트의 로직

Jbee 님의 스크립트는 다음과 같이 동작한다.

1. 카테고리 입력: content/blog 내의 .md 파일을 다 찾아서 frontmatter의 category를 모아 그 중에서 하나를 선택하거나, 새로 입력하게 한다
2. 타이틀 입력

생각보다 간단하다. 다만 카테고리를 선택하는 부분을 어떻게 해야하나 고민했는데, 이 부분을 Jbee 님은 [inquirer](https://www.npmjs.com/package/inquirer)라는 라이브러리로 해결하셨더라. 그래서 나도 저걸 사용하기로 했다.

내 스크립트는 다음과 같이 동작한다.

1. 카테고리 입력: content/blog 내의 디렉토리만 찾아와서 category로 인식한다.
2. 타이틀 입력
3. 폴더와 파일 타입 선택

Jbee 님의 스크립트와 비교해서 딱 한 부분이 차이난다. 3번이 추가로 이루어지는 점인데, 이는 내가 블로그 포스트를 관리해온 방법에서 차이가 있기 때문이다.

나는 게시글에 image가 없으면 파일 하나를 생성하고

```
blogging
  └── making-new-post-script.md
```

image가 있으면 디렉토리를 만들어서 아래와 같이 저장한다.

```
blogging
  ├── making-new-post-script
  │   ├── index.md
  │   └─── image.png
```

Jbee님 같은 경우 다음과 같이 image를 디렉토리에 따로 관리하시는 걸 볼 수 있었다.

```
essay
  ├── images
  │   ├── a.png
  │   ├── b.png
  │   └── c.png
  ├── a.md
  └── b.md
```

이런 차이로 인해 나는 file로만 생성할지, 디렉토리를 생성하고 index.md를 생성할지를 선택하는 부분을 추가했다.

잠깐동안 'Jbee님처럼 할까?' 생각을 했는데, 아무래도 내 스타일은 '한 주제에 대해서는 한 곳에 모아서 보관한다' 이기에 그대로 두기로 했다. 만약 공예용 가위와 주방용 가위가 있을 때 둘은 가위라서 같이 둘 수도 있지만 내 경우엔 주방용이면 주방에 두고, 공예용이면 공예도구상자에 둔다는 뜻이다. 그래서 어떤 포스트가 있다면 이 포스트와 관련된 자료는 같은 디렉토리에 담아두는 것이다.

(이에 대해 Jbee 님은 images 디렉토리에서 포스트 별로 이미지를 분리하는 방법을 택하셨다.)

원본 소스는 [여기](https://github.com/ohseunghyeon/gatsby-blog/blob/master/cli/create-new-post.js)에서 확인할 수 있다.
