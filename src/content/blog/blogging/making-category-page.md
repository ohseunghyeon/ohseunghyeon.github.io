---
title: Gatsby 블로그에 카테고리 만들기
date: 2019-10-04T12:12:41.390Z
description: Making Category on Gastby blog!
category: blogging
---

## 발단

카테고리가 필요하다. 인덱스 페이지에는 글 목록만 있다. 심지어 글 목록은 너무 길어서 어디에 무슨 글이 있는지도 알 수가 없다. 정리되지 않은 자료는 솔직히 있으나 마나다. 두고 볼 수가 없다.

## 카테고리 리스트 만들기

카테고리를 어떻게 만들까? 우선 Gatsby가 데이터를 가져오는 방법을 참고해서 카테고리에 대한 데이터도 가져올 수 있게 해야한다. 가장 쉬운 방법은 각 게시글 markdown의 frontmatter에 category를 넣은 뒤 graphql query로 카테고리 목록을 가져오는 것이다.

아래와 같이 query로 리스트를 뽑아내면 Nav 정도는 다음과 같이 쉽게 만들 수 있다.

```jsx
query CategoryQuery {
  categories: allMarkdownRemark(limit: 2000) {
    group(field: frontmatter___category) {
      fieldValue
      totalCount
    }
  }
}

<nav>
  {categories.map(category => (<div>{category}</div>))}
</nav>
```

## 카테고리의 글 목록 페이지 만들기

카테고리 별 글 목록은 전체 글 목록 파일을 참조하면 된다. `gatsby-starter-blog`의 전체 글 목록은 `src/pages/index.js` 파일이다. 내 경우엔 `src/templates/category-page.js` 파일을 생성했다.

문제는 이 template 파일로 어떻게 페이지를 만드는가인데, gatsby의 node-api 중 createPage를 사용해야 한다. `gatsby-node.js` 파일을 살펴보면 글 목록을 graphql로 가져와서 posts를 생성하는 부분이 보인다. 해당 graphql query에 category를 가져오게끔 수정을 가하고, 다음과 같이 createPage 함수를 실행하면 된다.

```javascript
// 템플릿 파일을 가져와서
const categoryPage = path.resolve(`./src/templates/category-page.js`)

// 카테고리 페이지를 만든다.
Categories.forEach(
  (category) => {
    createPage({
      path: `/${category}`,
      component: categoryPage,
      context: {
        category: `^/${category}/`
      }
    })
  }
)
```

위의 createPage에서 context로 넘긴 값을 `category-page.js` 에서 받아 사용해야 한다.

graphql query에서는 다음과 같이 가져오면 되고

```js
export const pageQuery = graphql`
  query CategoryPage($category: String) {
    ...
  }
`
```

Componet에서는 다음과 같이 가져오면 된다.

```js
const CategoryPage = ({ data, location, pageContext }) => {
  const category = pageContext.category
  return (
    ...
  )
}
```

## 참고

### 메뉴에 쓴 햄버거 버튼 - https://codepen.io/okawa-h/pen/xxKzLwm

### width 768px 이하에서 상단 Header가 스크롤링에 따라 숨고 나타나게 하는 기능을 가진 JS library -  headroom.js
