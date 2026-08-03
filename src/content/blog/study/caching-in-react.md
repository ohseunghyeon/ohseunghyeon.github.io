---
title: "[번역] Caching in react"
date: 2019-10-28T05:24:01.729Z
description: From Isomorphic Web Applications by Elyse Kolker Gordon
category: study
---

원글: [Caching in React](https://freecontent.manning.com/caching-in-react/)

## Cashing

캐싱은 서버의 성능 향상을 위한 강력한 도구이다. 나는 edge caching, in-memory caching 그리고 persisted caching(Redis와 같이 NoSQL DB에 저장) 등 여러 형태의 캐싱을 사용해왔다. 각각의 전략은 tradeoffs가 있으니 이런 점들을 잘 이해하고 당신의 유즈케이스에 맞는 전략을 선택해야 한다.

||SEO|User Sessions|
|-|-|-|
|In memory|√|√|
|Persisted storage|√|(higher overhead, but possible)|
|Edge caching|√||

<center>Table 1 Comparing caching options.</center>

## Cashing on the server: In-memory caching

가장 쉬운(가장 naive 한) 방법은 메모리에 직접 컴포넌츠를 저장하는 것이다. 간단한 앱의 경우 기본적인 LRU 캐싱(size-limitied)과 렌더링된 컴포넌츠를 직렬화하는 방법으로 구현할 수 있다. Figure 1은 in-memory 캐시를 사용하는 타임라인을 나타낸다. 첫 번째 유저는 완전히 렌더된 페이지(조금 더 느린)를 얻는다. 그리고 이 페이지는 in-memory 캐시에 저장된다. 그 이후의 유저들은 캐시된 페이지를 얻는다.(캐시가 가득차서 해당 페이지가 캐시에서 밀려나기 전까지)

![Figure 1 In-memory caching allows some requests to benefit from faster response times.](https://freecontent.manning.com/wp-content/uploads/Gordon_CiR_01.png)

*<center>Figure 1 In-memory 캐싱은 어떤 요청이 더 빠른 응답 속도를 갖게 한다</center>*

Listing 1은 간단한 캐싱 모듈을 구현하고 있다.

```javascript
// highlight-next-line
Listing 1: Add an LRU in memory cache – src/shared/cache.es6

import lru from 'lru-cache';                                    ❶
  
 // maxAge is in ms
 const cache = lru({                                            ❷
   maxAge: 300000,                                              ❸
   max: 500000000000,                                           ❹
   length: (n) => {                                             ❺
     // n = item passed in to be saved (value)
     return n.length * 100;
   }
 });
  
 export const set = (key, value) => {                           ❻
   cache.set(key, value);
 };
  
 export const get = (key) => {                                  ❼
   return cache.get(key);
 };
  
 export default {
   get,
   set
 };
```

1. LRU 캐시를 Import
2. LRU 캐시 생성
3. maxAge는 시간에 기반하여 캐시에 저장된 값의 만기를 설정한다.
4. max는 캐시에 저장된 모든 아이템의 총 길이이다.
5. length는 각 아이템이 가질 수 있는 최대 길이이다.
6. cache에 키/밸류를 set할 수 있는 public set 메서드이다.
7. cache로부터 키에 기반하여 값을 가져올 수 있는 public get 메서드이다.

Listing 2는 캐싱 모듈을 renderView.jsx에서 사용한 모습이다. 캐싱 로직이나 스티리밍 로직 중 하나를 사용할 것을 권장하며, 둘을 동시에 사용하지는 마라. 캐시와 스트림을 원한다면, 이 글에 나온 것과는 다른 스트리밍 구현이 필요할 것이다.

```javascript
// highlight-next-line
Listing 2: Save and fetch cached pages – src/middleware/renderView.jsx

 const cachedPage = cache.get(req.url);                         ❶
 if (cachedPage) {                                              ❷
   return res.send(cachedPage);                                 ❷
 }
  
 const store = initRedux();
 //...more code
 Promise.all(promises).then(() => {
   //...more code
   cache.set(req.url, `<!DOCTYPE html>${html}`);                ❸
   return res.send(`<!DOCTYPE html>${html}`);
 })
```

1. 캐시로부터 값을 가져올 수 있나 보자.
2. 값이 있다면 이를 응답으로 사용하자.
3. 만약 렌더링이 필요하다면, 렌더링의 결과를 응답하기 전에 캐시에 저장하자.

이 방법은 작동한다. 그러나 몇가지 문제가 있다.

1. 이 방법은 너무 간단하다. 만약 유즈케이스가 더 복잡해지거나, 사용자들을 더하기 시작하거나(역자: 이해 못함), 여러 언어를 지원해야 하거나, 엄청나게 많은 페이지가 있다면 어떻게 될까? 이 방법은 그런 유즈케이스를 잘 감당할만큼 확장될 수 없다.
2. 메모리에 쓰는 것은 Node.js에서 동기적인 작업이다. 즉 캐시를 사용함으로써 성능을 최적화하려 하는데, 하나의 문제점을 해결하는 동시에 다른 문제를 갖게 된다는 것이다.
3. 마지막으로 서버가 분산화된 스케일링 전략을 갖고 있다면, 캐시는 각각의 서버나 컨테이너(도커를 쓴다면)에만 적용되고 이는 공통의 캐시를 공유할 수 없다는 뜻이다.

다음으로 레디스를 사용하여 캐싱하는 방법을 살펴볼 것이다. 이는 비동기적이고 논블로킹인 캐싱을 하게 해준다. 우리는 그리고 더욱 똑똑한 캐싱의 구현을 살펴볼 것인데, 각각의 컴포넌츠를 캐싱하여 더 복잡한 어플리케이션을 위한 스케일링에 용이한 방법이다.

## Caching on the server: Persisted Storage

내가 첫 번째로 작업했던 isomorphic 리액트 앱은 리덕스나 리액트 라우터가(community best-choice libraries) 안정화되기 전에 작성됐다. 그래서 우리는 많은 코드들을 home-roll하기로 결심했다.(역자: home-roll 이해 못함) 이런 결심과 서버상에서 느린 리액트로 인해, 우리는 서버 렌더를 더 빠르게 할 솔루션이 필요했다.

우리는 레디스에 스트링 저장소를 구현하여 모든 페이지 스트링으로 저장할 수 있게 했다. 레디스에 모든 페이지를 저장하는 건 더 큰 사이트에 대해서 중요한 트레이드오프를 가지고 있다. 우리는 수백만의 다른 진입점들을 레디스에 저장할 수 있었고, 모두 스트링화 된 HTML 페이지들은 상당히 빠른 속도로 추가되어 공간을 꽤나 차지했다.

고맙게도, 커뮤니티가 이보다 향상된 방법을 생각해냈다. Walmart Labs는 [electrode-react-ssr-caching](https://github.com/electrode-io/electrode-react-ssr-caching)라는 서버 사이드 렌더링의 캐싱을 사용하기 쉬운 라이브러리를 내놓았다. 이 라이브러리는 두 가지 이유로 인해 강력하다.

1. 이 라이브러리는 profiler를 갖고 있어서 서버상에서 어떤 컴포넌트가 가장 비싼지 알려줌으로써, 당신이 필요로하는 컴포넌츠만 캐시할 수 있게 해준다.
2. 이 라이브러리는 렌더링 된 컴포넌츠를 캐시하기 위해서 컴포넌츠를 템플릿화 하여 이후에 props를 넣을 수 있게 해준다.

우리는 장기적인 측면을 봤을 때, 페이지들의 숫자와 이 페이지들이 100% public-facing content라는 점으로 인해서, edge 캐싱 전략으로 옮겨가게 되었다. 당신의 유즈케이스는 Walmart Labs의 접근법에서 이점을 찾을 수도 있다.

## CDN/Edge strategies

Edge caching은 우리가 현재 직장에서 isomorphic 리액트 앱을 위해 사용하는 방법이다. 이는 (CMS 도구에서와 같이, 시스템 상에서 어떤 시점에 변화가 생길 때) 필요에 따라 컨텐츠가 만기되게 만드는 방법이 필요하기 때문이다. Fastly와 같은 현대의 CDN들은 이런 능력을 바로 사용할 수 있게끔 제공하며 이는 TTL(time to live)를 더 쉽게 관리할 수 있고 웹 페이지가 만기되게(expire) 해준다. Figure 2는 이런 작동 방식을 설명한다.

![Figure 2 Adding an edge server moves the caching in front of the server.](https://freecontent.manning.com/wp-content/uploads/Gordon_CiR_02.png)
*<center>Figure 2 edge server는 캐싱이 서버의 앞단에 위치하게 한다.</center>*

이걸 구현하는 방법은 이 글의 범위를 벗어난다. 만약에 당신이 SEO(ecommerce, video sites, blogs, etc)가 필요한 public-facing content를 가지고 있다면, 당연히 CDN을 기술 스택에 넣고 싶어할 것이다.

이 방법에 대해 하나 경고할 게 있다면, 유저의 세션 관리를 복잡하게 만든다는 점이다. 다음 섹션은 유저 세션에 대해 살펴보고 다양한 캐싱 전략들이 가진 트레이드오프들을 다룰 것이다.

## User Session Management

최근의 웹 어플리케이션들은 거의 다 브라우저에서 쿠키를 사용한다. 심지어 당신의 메인 프로덕트가 쿠키를 직접적으로 사용하는 게 아니더라도 당신이 사이트 상에서 사용하는 광고, 트래킹, 다른 써드파티 도구가 쿠키의 이점을 얻고 있을 것이다. 쿠키는 웹앱에게 같은 사람이 매번 오는 것을 알게 해준다. Figure 3은 이를 설명한다.

![Figure 3 Repeat visits by the same user on the server. Saving cookies lets you store information about the user that can be retrieved during future sessions.](https://freecontent.manning.com/wp-content/uploads/Gordon_CiR_03.png)

*<center>Figure 3 서버에 한 유저가 반복적으로 방문. 쿠키를 저장하여 그 유저에 대한 정보를 저장하여 미래에 이를 참조할 수 있다.</center>*

Listing 3은 브라우저와 서버 양측의 쿠키를 파싱하는 모듈의 예이다. universal cookie를 사용하여 두 환경(client and server)에서의 쿠키 관리를 용이하게 한다.

```bash
$ npm install --save universal-cookie
```

```javascript
// highlight-next-line
Listing 3 Using Isomorphic Cookie Module – src/shared/cookies.es6

import Cookie from 'universal-cookie';                          ❶
  
 const initCookie = (reqHeaders) => {
   let cookies;
   if (process.env.BROWSER) {                                   ❷
     cookies = new Cookie();
   } else if (reqHeaders.cookie) {
     cookies = new Cookie(reqHeaders.cookie);                   ❸
   }
   return cookies;
 };
  
 export const get = (name, reqHeaders = {}) => {
   const cookies = initCookie(reqHeaders);                      ❹
   if (cookies) {
     return cookies.get(name);                                  ❺
   }
 };
  
 export const set = (name, value, opts, reqHeaders = {}) => {
   const cookies = initCookie(reqHeaders);                      ❹
   if (cookies) {
     return cookies.set(name, value, opts);                     ❻
   }
 };
  
 export default {
   get,
   set
 };
```

1. universal cookie library를 임포트하여, 클라이언트와 서버에서 쿠키를 다루는 법의 차이를 쟤가 알아서 하게 하자.
2. reqHeaders가 필요한지 결정하기 위해 환경을 체크하자.
3. 헤더에 쿠키가 있으면, 쿠키 생성자로 넘기자.
4. 게터와 세터 함수에서, 쿠키 오브젝트를 init하며 reqHeaders를 넘겨서 서버상에서 이게 작동하는지 확인하자.
5. 찾은 쿠키를 반환.
6. 쿠키 세팅의 결과를 반환. name과 value에 추가로 standard cookie options를 넘길 수 있다. 대부분의 경우 브라우저에서 set을 호출할 것이다.

이제 쿠키를 두 환경에서 get, set할 방법을 추가했다. 이제 당신의 앱에서 이에 지속적으로 접근하기 위해서 app state 상에 이 정보를 저장할 필요가 있다.

## Accessing cookies universally

action으로 쿠키를 가지고 오게 하여, 당신의 앱이 쿠키과 상호 작용하게 있게끔 할 수 있다. Listing 4는 user id를 저장하고 가져오기 위핸 storeUserId action을 추가하는 방법을 보여준다.

```javascript
// highlight-next-line
Listing 4: accessing cookies on the server – src/shared/app-action-creators.es6

import UAParser from 'ua-parser-js';
import cookies from './cookies.es6';                            ❶

export const PARSE_USER_AGENT = 'PARSE_USER_AGENT';
export const STORE_USER_ID = 'STORE_USER_ID';                   ❷

export function parseUserAgent(requestHeaders) {}

export function storeUserId(requestHeaders) {                   ❸
  const userId = cookies.get('userId', requestHeaders);         ❹
  return {
    userId,                                                     ❺
    type: STORE_USER_ID                                         ❷
  };
}

export default {
  parseUserAgent,
  storeUserId
};
```

1. 쿠키 모듈을 임포트한다.
2. 새로운 액션을 위한 타입을 추가한다.
3. requestHeaders를 받아서 서버에서 작동하는지 확인하는 액션을 추가한다.
4. 쿠키 이름과 requestHeaders를 쿠키 모듈에 넘긴다.
5. 액션에 userId 값을 넣는다.

이제 당신의 어플리케이션에서 userId에 접근할 수 있다. 이는 서버상에서 불러와지고 브라우저에서 필요에 따라 업데이트 될 수 있다. 당신은 이런 컨셉을 어떤 유저 세션 정보에든지 적용할 수 있다. 그러나, 모든 유저 세션을 관리하는 건 이 글의 범위를 벗어난다.

## Edge caching + Users

내가 처음 isomorphic 어플리케이션을 만들기 시작했을 때, 유저 관리는 간단해보였다. single-page-application처럼 브라우저상에서 쿠키를 사용해 유저 세션을 추적하는 것이다. 서버를 포함하는 건 이를 복잡하게 만들지만, 쿠키를 서버에서 읽을 수 있다. 당신이 캐싱 전략을 사용함으로써 이것은 좀 덜 straightforward해질 수 있다.

in-memory와 persisted storage 캐싱 전략은 둘 다 유저 세션에 대해 잘 작동한다. 매 유저 요청이 여전히 서버로 가서 유저의 정보가 수집되기 때문이다. 당신은 유저를 식별하는 정보를 캐시의 키로 사용할 수 있다.

불행히도, edge caching은 잘 작동하지 않는다. 왜냐면, 각각의 유저들에 대해 당신은 각 유저의 데이터를 담은 유니크한 페이지 사본을 유지해야 하기 때문이다. 만약 그렇지 않으면 유저 2에게 유저 1의 정보를 보여주게 될 수도 있다. 그건 나쁠 것이다. Figure 4는 이런 컨셉에 대해 설명한다.

![Figure 4 When the edge has to cache pages per user, the benefit of overlapping requests is lost.](https://freecontent.manning.com/wp-content/uploads/Gordon_CiR_04.png)
*<center>edge가 각 유저의 페이지를 캐시해야 한다면, 같은 페이지라도 다른 페이지이기 때문에 이점을 상실하게 된다.</center>*

만약 edge caching이 필요하다면, 당신은 유저의 데이터를 가지고 다음의 전략 중 하나 또는 그 이상을 수용해야 한다. (content type과 traffic patterns에 따라서 다르다.)

- 유저의 컨텐츠를 지닌 페이지나 일반적인 콘텐트(public)의 페이지를 생성해라. 그리고 public 페이지만 edge server에 캐시해라.
- 만약 유저가 액티브한 유저 세션 상태라면 edge server에게 캐시된 페이지를 제공할지, 서버에게 요청을 보낼지(pass through) 알릴 수 있는 쿠키를 저장하라.
- placeholder content가 있는 페이지를 제공하라(solid shapes that show where content will load). 그리고 브라우저에서 어떤 컨텐츠를 보여줄지 결정되게 하라.

이제 당신은 캐싱에 대해 약간 더 알게 되었다.
