# Gatsby 2 블로그 → Astro 이전 설계

작성일: 2026-08-03

## 1. 배경 — 무엇이 고장났나

블로그에 글이 올라가지 않는 상태가 4년간 지속됐다. 원인은 두 개다.

### 1-1. 빌드 실패 (근본 원인)

CI 워크플로우 `.github/workflows/continuous-deployment-workflow.yml`이 **Node 버전을 고정하지 않고** `ubuntu-latest`의 기본 Node를 사용한다. 프로젝트 스택은 2020년산으로 Node 14가 상한선이다.

- `node-sass@4.14.1` — Node 14까지만 프리빌트 바이너리 제공
- `sharp@0.25.4` — 동일
- `gatsby@2.24.54` — Node 14 시절 버전

2021년 말 GitHub 러너의 기본 Node가 14 → 16으로 올라가면서 `yarn` 설치 단계의 네이티브 빌드가 깨졌고, 이후 `yarn build`와 배포 스텝이 실행되지 않았다.

**증거 (시점 일치)**
- 배포용 저장소 `ohseunghyeon.github.io` 마지막 push: 2021-07-08
- 마지막 정상 배포 커밋 `f4b428d`: 2021-07-08
- 이후 커밋 2개(2022-01-11, 2022-12-02)는 master에 있으나 사이트에 반영되지 않음

**로컬 재현 확인**: 현재 Node v26.5.1에서 `node-sass@4.14.1` 설치 시 프리빌트가 없어 소스 빌드로 넘어가고, `node-gyp 3.8`이 Python 2를 찾다 실패한다 (`gyp ERR! not ok`).

Actions 실행 기록은 보존 기간이 지나 삭제되어 CI 로그로는 직접 확인할 수 없다. 위 결론은 시점 일치와 로컬 재현에 근거한 것이다.

### 1-2. 배포 인증 (2차 고장, 미확정)

`GH_ACTION_DEPLOY_KEY` 시크릿은 2019년 등록된 채 남아 있으나, 대상 저장소 `ohseunghyeon.github.io`에 등록된 deploy key가 **하나도 없다**. 빌드를 고쳐도 `git clone git@github.com:...` 단계에서 다시 막힐 가능성이 높다. 계정 레벨 SSH 키로 동작 중일 수도 있으나 현재 토큰 권한으로는 확인되지 않았다.

이 설계에서는 저장소 통합으로 크로스 저장소 인증 자체를 제거하므로 이 문제는 검증 대상에서 사라진다.

## 2. 결정 사항

| 항목 | 결정 | 근거 |
|---|---|---|
| 프레임워크 | **Astro로 이전** | Gatsby는 저활동 유지보수 모드(최신 릴리스 2026-02-10, 최근 1년 패치 6개, React 19 정식 지원 없음). Gatsby 5 이전과 작업량이 비슷한데 결과물 수명이 길다. |
| 배포 구조 | **단일 저장소 통합** | `ohseunghyeon.github.io`에서 소스+배포를 모두 처리하고 Pages를 Actions 방식으로 전환. 크로스 저장소 인증 제거. |
| 실행 전략 | **A안 — 현 저장소 브랜치 작업 → 마지막에 통합** | 빌드 검증과 배포 전환을 분리해 실패 원인을 구분 가능. 양쪽 히스토리 보존. |
| Google Analytics | **제거** | `UA-79205503-1`은 Universal Analytics로, 2023-07 종료되어 이미 데이터를 수집하지 않는다. |
| 타이포그래피 | **`typography.js` 출력을 정적 CSS로 굳힘** | 의존성 제거와 렌더링 보존을 동시에 달성. |
| `refernece` 오타 | **수정** | 이미 깨진 페이지를 만들고 있고, 수정해도 글 URL은 안 바뀌어 댓글 영향 없음. 3-3 참조. |

### 버전 목표

| 대상 | 버전 | 비고 |
|---|---|---|
| Astro | 7.1.x (조사 시점 최신 7.1.6, 2026-07-29) | 주 단위 릴리스로 활발히 유지보수 중 |
| Node | 22 LTS | CI 워크플로우와 `package.json` `engines`에 동일하게 고정. 로컬에도 `.nvmrc`로 명시 (현재 `~/.nvm`에 22.13.1 설치돼 있음) |
| React | 18 이상 | `@astrojs/react`가 요구하는 버전을 따름 |

로컬 개발 머신의 기본 Node는 현재 26.5.1이다. `.nvmrc`를 두는 이유는 CI와 로컬의 Node를 일치시키는 것이 이번 고장의 재발 방지책이기 때문이다.

## 3. 최상위 제약 — URL 보존

댓글 시스템 utterances가 `issue-term: pathname`, `repo: ohseunghyeon/ohseunghyeon.github.io`로 설정돼 있다. **URL이 바뀌면 해당 글의 기존 댓글이 떨어져 나간다.** 이것이 이 마이그레이션의 가장 강한 제약이다.

### 3-1. 현재 URL 규칙 (라이브 sitemap 124개 URL로 검증)

**글 URL은 `content/blog/` 기준 파일 경로에서 파생된다** (`gatsby-source-filesystem`의 `createFilePath`). 프론트매터 `category`와 무관하다.

| 파일 | URL |
|---|---|
| `content/blog/lavender/1-year.md` | `/lavender/1-year/` |
| `content/blog/study/APIs-The-Good-The-Bad-The-Ugly/index.md` | `/study/APIs-The-Good-The-Bad-The-Ugly/` |
| `content/blog/algorithm/programmers/큰-수-만들기.md` | `/algorithm/programmers/큰-수-만들기/` |

- 대소문자 보존 (`APIs-The-Good-...`)
- 한글 그대로 (인코딩 없음)
- `index.md`는 디렉터리 URL로 축약

**⚠️ 최우선 검증 항목**: 이 설계는 Astro Content Collections의 `id`가 파일 경로에서 파생되어 위 규칙과 1:1로 맞아떨어진다는 가정 위에 서 있다. 이 가정은 **아직 실제로 확인하지 않았다.** 구현 1단계의 가장 첫 작업으로 최소 스캐폴딩을 만들어 다음 세 가지를 확인해야 한다.

1. 대소문자 보존 — `study/APIs-The-Good-The-Bad-The-Ugly`
2. `index.md`의 디렉터리 URL 축약 — `study/APIs-.../index.md` → `/study/APIs-.../`
3. 한글 경로 처리 — `algorithm/programmers/큰-수-만들기`

세 가지 중 하나라도 어긋나면 `getStaticPaths()`에서 `id`를 직접 가공해 URL을 맞춰야 하며, 그 경우 8-1 검증이 이를 잡아낸다. 가정이 크게 깨지는 경우(예: Astro가 슬러그를 강제로 정규화) 설계를 재검토해야 하므로 **다른 작업보다 먼저 확인한다.**

### 3-2. 카테고리 페이지 URL은 별개 체계

카테고리 페이지는 **프론트매터 `category` 값**에서 생성되며, 중첩 카테고리는 각 단계마다 페이지가 만들어진다 (`algorithm/programmers` → `/algorithm`, `/algorithm/programmers`).

- 글 URL: trailing slash 있음 (`/lavender/1-year/`)
- 카테고리 URL: trailing slash 없음 (`/lavender`, `/algorithm/hackerrank`)

이 비대칭은 `createPage`에 슬래시를 붙이지 않은 결과이며, 정적 호스팅에서는 `/lavender`와 `/lavender/` 모두 `/lavender/index.html`을 서빙한다(`/reference` 요청이 301을 반환하는 것으로 확인). 따라서 **실질적 차이는 sitemap 표기뿐이고 Astro에서 정규화해도 안전하다.**

**설정**: `astro.config.mjs`에 `trailingSlash: 'always'`, `build.format: 'directory'`를 명시한다. 모든 페이지가 `경로/index.html`로 출력되어 글 URL의 현재 형태와 일치하고, 카테고리 페이지는 GitHub Pages의 301 정규화로 흡수된다. sitemap도 이 규칙으로 통일된다.

### 3-3. `refernece` 오타 — 수정 대상

- 글 파일: `content/blog/reference/npm-모듈-설치-시-node-gyp-rebuild-에러.md`
- 글 URL: `/reference/npm-모듈-설치-시-node-gyp-rebuild-에러/` (파일 경로 기반)
- 프론트매터: `category: refernece` (오타)
- 결과: 카테고리 페이지가 `/refernece`로 생성되고, `^/refernece/` 정규식으로 글을 찾으나 실제 슬러그는 `/reference/`라 **매칭 0건. 라이브에서 확인한 글 목록: 0개.**

오타를 `reference`로 고치면 글 URL은 그대로이고(댓글 안전), 카테고리 페이지가 `/reference`로 옮겨가며 정상 동작한다. 사라지는 `/refernece`는 빈 페이지이고 카테고리 페이지에는 댓글이 없다.

### 3-4. 헤딩 앵커

`gatsby-remark-autolink-headers`와 `rehype-slug`(github-slugger)의 한글 헤딩 id 생성 규칙이 다를 수 있다. 목차는 같은 slugger로 빌드타임에 생성되므로 **내부 일관성은 보장**되며, 영향받는 것은 외부에서 특정 헤딩으로 직접 걸어둔 딥링크뿐이다. 허용 가능한 손실로 판단한다.

## 4. 콘텐츠 인벤토리

글 113개, 이미지 등 첨부 파일 53개.

### 프론트매터 스키마 (전수 조사)

| 키 | 빈도 | 비고 |
|---|---|---|
| `title` | 113 | 필수 |
| `date` | 113 | 필수, ISO 8601 |
| `category` | 113 | 필수 |
| `description` | 112 | **선택** — 1개 글에 없음 |
| `creator` | 11 | `report` 카테고리 전용 |
| `created_at` | 11 | `report` 카테고리 전용 |
| `link` | 11 | `report` 카테고리 전용 |
| `todo` | 1 | 선택, boolean |

### 카테고리 분포

`report` 30, `algorithm/programmers` 28, `lavender` 13, `essay` 11, `algorithm/hackerrank` 10, `blogging` 9, `study` 7, `algorithm/reference` 4, `refernece` 1 (→ `reference`로 수정)

## 5. 목표 구조

```
ohseunghyeon.github.io/
├─ src/
│  ├─ content.config.ts            Zod 스키마 (4절 기준)
│  ├─ content/blog/                113개 .md — 프론트매터 무수정 이동
│  ├─ layouts/BaseLayout.astro     <head> + 다크모드 초기화 + Header + Container/Content
│  ├─ pages/
│  │  ├─ index.astro               algorithm·report 제외 전체 목록
│  │  ├─ [...slug].astro           글 상세 (카테고리 내 prev/next)
│  │  ├─ [...category].astro       카테고리 페이지 (중첩 단계별)
│  │  ├─ about.astro
│  │  ├─ 404.astro
│  │  └─ rss.xml.ts
│  ├─ components/
│  │  ├─ Header/                   React 아일랜드 (headroom.js)
│  │  ├─ Toggle.jsx                React 아일랜드 (다크모드)
│  │  ├─ Bio.astro
│  │  ├─ PostFrontmatter.astro
│  │  ├─ PostFrontmatterTIL.astro
│  │  ├─ PostListTitle.astro
│  │  ├─ PostTableOfContent.astro
│  │  └─ PostComment.astro         utterances 스크립트 주입
│  ├─ styles/
│  │  ├─ typography.css            ★ 굳힌 9.4KB (6-1 참조)
│  │  ├─ global.scss               기존 그대로
│  │  ├─ variables.scss            기존 그대로
│  │  └─ header/*.scss             기존 3개 그대로
│  └─ utils/
│     ├─ helpers.js                formatReadingTime — 그대로
│     └─ posts.js                  groupByCategory / categoryPaths
├─ public/
│  ├─ manifest.webmanifest
│  └─ sw.js                        ★ 서비스 워커 묘비 (6-2 참조)
├─ scripts/new-post.mjs            npm run post 대체
├─ scripts/verify-urls.mjs         ★ URL 동일성 검증 (8-1 참조)
└─ .github/workflows/deploy.yml
```

`report` 카테고리는 전용 레이아웃(`read-list`)을 쓰므로 `[...category].astro` 안에서 분기한다. 별도 페이지 파일을 두지 않는 이유는 카테고리 URL 생성 로직이 한곳에 있어야 중복이 없기 때문이다.

### 데이터 흐름

GraphQL이 사라진다. `getCollection('blog')` → JS 필터/정렬 → `getStaticPaths()`.

`gatsby-node.js`의 "카테고리별 그룹핑 후 카테고리 내에서 prev/next 계산" 로직은 의미를 그대로 옮긴다. 이 로직은 카테고리 페이지 URL 목록 생성과 글 페이지의 prev/next 두 곳에서 쓰이므로, `src/utils/posts.js`에 다음 두 함수로 분리한다.

- `groupByCategory(entries)` → `Map<category, entry[]>` (날짜 역순 정렬 포함)
- `categoryPaths(categories)` → 중첩 단계별 카테고리 경로 배열

이렇게 나누면 각각 독립적으로 테스트 가능하고, 페이지 파일은 데이터 조립만 담당한다.

### 아일랜드 경계

`client:load` React 아일랜드로 남기는 것은 **`Header`(headroom.js)와 `Toggle`(다크모드)뿐**이다. 나머지는 `.astro`로 전환해 클라이언트 JS를 0으로 만든다. `PostComment`는 스크립트 주입만 하므로 `.astro` + 인라인 `<script>`로 충분하다.

## 6. 플러그인 매핑

콘텐츠를 실제로 조사한 결과 플러그인 상당수가 불필요하다.

| 현재 | 실제 사용량 | 처리 |
|---|---|---|
| `gatsby-remark-embed-video` | `youtube:` 문법 3곳 | 제거. 3곳을 반응형 iframe HTML로 치환 (아래) |
| `gatsby-remark-responsive-iframe` | 위 3곳 전용 | 제거 (CSS로 처리) |
| `gatsby-remark-emojis` | `:emoji:` 문법 4곳 | 제거. 리터럴 이모지로 치환 |
| `gatsby-remark-images` | 로컬 이미지 50곳 | Astro 내장 이미지 최적화 (상대경로 유지) |
| `gatsby-remark-prismjs` | 코드블록 다수 | **Shiki 내장** — 빌드타임 처리, 런타임 JS 0KB |
| `gatsby-remark-autolink-headers` | 헤딩 앵커 | `rehype-slug` + `rehype-autolink-headings` |
| `gatsby-remark-external-links` | 외부 링크 `target=_blank` | `rehype-external-links` |
| `gatsby-remark-smartypants` | 따옴표 변환 | `remark-smartypants` |
| `gatsby-remark-images-medium-zoom` | 이미지 확대 | `medium-zoom` 직접 초기화 |
| `gatsby-remark-copy-linked-files` | 비이미지 링크 파일 | Astro `public/`·상대경로로 대체 |
| `timeToRead` (Gatsby 내장) | `formatReadingTime()` | `remark-reading-time` |
| `tableOfContents` (Gatsby 내장) | `PostTableOfContent` | `render()`의 `headings` |
| `gatsby-plugin-typography` | `rhythm()` 13곳 | 6-1 참조 |
| `gatsby-plugin-web-font-loader` | Nanum Gothic | `<link rel="preconnect">` + 스타일시트 |
| `gatsby-plugin-manifest` | PWA 매니페스트 | 정적 `manifest.webmanifest` + 아이콘 |
| `gatsby-plugin-sitemap` | sitemap | `@astrojs/sitemap` |
| `gatsby-plugin-feed` | rss.xml | `@astrojs/rss` (필터 규칙 유지) |
| `gatsby-plugin-sass` + `node-sass` | SCSS 6개 파일 | Astro 내장 (dart-sass) |
| `gatsby-plugin-react-helmet` | `Seo.js` | 레이아웃 `<head>` |
| `gatsby-plugin-google-analytics` | 죽은 UA 코드 | 제거 |
| `gatsby-plugin-offline` | 서비스 워커 | 6-2 참조 |
| `@mdx-js/mdx`, `yarn`(의존성에 있음), `react-typography` | 미사용 | 제거 |

`styled-components`는 `Layout.js`에서만 쓰이며, Astro 전환 시 `.astro`의 스코프 스타일로 대체되어 의존성이 사라진다.

**유튜브 임베드 치환 형태** (해당 3곳: `lavender/6-months-of-babysitting.md`, `study/APIs-The-Good-The-Bad-The-Ugly/index.md`, `blogging/deploying-github-pages-with-github-actions/index.md`)

마크다운 안의 인라인 코드 `` `youtube:URL` ``을 아래 HTML로 바꾼다. `.md`에서 원시 HTML은 그대로 통과한다.

```html
<div class="video-embed">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" title="..."
          loading="lazy" allowfullscreen></iframe>
</div>
```

`.video-embed`는 `global.scss`에 `aspect-ratio: 16 / 9`로 정의한다. 기존 `gatsby-remark-responsive-iframe`의 padding-bottom 방식을 대체하며, 세 곳의 URL 형태가 서로 다르므로(`youtu.be/`, `watch?v=`, `embed/`) 각각 video ID를 추출해 `embed/` 형태로 통일한다.

**결과**: 네이티브 빌드가 필요한 패키지가 `sharp`(Astro 내장, 현행 프리빌트 제공) 하나로 줄고 `node-sass`는 완전히 사라진다. 이번 고장의 원인이 설계상 제거된다.

### 6-1. 타이포그래피 보존

`typography.js` + `typography-theme-github`는 순수 JS로 Node 26에서도 실행되며, 출력이 **결정론적인 9,471 byte CSS 한 덩이**다(normalize.css 포함). 일회성 스크립트로 생성해 `src/styles/typography.css`로 커밋하고 레이아웃에서 import한다. 의존성은 제거하면서 렌더링은 보존된다.

`rhythm()` 호출 13곳(`Layout`, `Bio`, `PostFrontmatter`, `PostFrontmatterTIL`, `blog-post`, `category-page`, `read-list`, `index`)은 추출한 리터럴 값으로 치환한다.

```
rhythm(1/4) = 0.40625rem     rhythm(1)   = 1.625rem
rhythm(1/2) = 0.8125rem      rhythm(1.5) = 2.4375rem
rhythm(3/4) = 1.21875rem     rhythm(2)   = 3.25rem
```

가독성을 위해 `variables.scss`에 `--rhythm-*` 커스텀 프로퍼티로 정의하고 참조한다.

### 6-2. 서비스 워커 묘비 — 놓치면 안 되는 함정

`gatsby-plugin-offline`이 방문자 브라우저에 서비스 워커를 등록해뒀다. 그냥 제거하면 **기존 방문자는 캐시된 낡은 사이트를 계속 본다.** 등록된 SW는 서버에서 파일이 사라져도 스스로 사라지지 않는다.

대응: 같은 경로(`/sw.js`)에 자기 자신을 등록 해제하고 캐시를 비우는 묘비 SW를 배포한다.

```js
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', async () => {
  await Promise.all((await caches.keys()).map(k => caches.delete(k)))
  await self.registration.unregister()
  const clients = await self.clients.matchAll({ type: 'window' })
  clients.forEach(c => c.navigate(c.url))
})
```

이 파일은 기존 방문자가 모두 정리될 때까지 유지해야 하므로 즉시 삭제하지 않는다.

## 7. CI · 배포

`ohseunghyeon.github.io/.github/workflows/deploy.yml`

```
checkout@v4
→ setup-node@v4 (node-version: 22, cache: npm)
→ npm ci
→ npm run build
→ configure-pages@v5
→ upload-pages-artifact@v3
→ deploy-pages@v4
```

`GITHUB_TOKEN`의 `pages: write` + `id-token: write` 권한만 사용하므로 **시크릿이 필요 없다.**

**재발 방지**: 이번 고장의 직접 원인이 Node 버전 미고정이었으므로, 워크플로우에 버전을 명시하고 `package.json`의 `engines` 필드에도 동일하게 박아둔다.

Pages 설정을 `build_type: legacy`(현재, `master` 브랜치 서빙)에서 workflow 방식으로 전환한다. 이는 `gh api`로 수행 가능하다.

`package.json`의 로컬 `deploy` 스크립트(`cd ../ohseunghyeon.github.io && ... && rm -rf ./ohseunghyeon.github.io/*`)는 삭제한다. 형제 디렉터리를 가정하고 `rm -rf`를 수행하는 위험한 스크립트이며, 통합 후 존재 이유가 없다.

## 8. 검증 전략

이 마이그레이션의 핵심 안전장치다.

### 8-1. URL 동일성 자동 검증 (필수 게이트)

라이브 사이트의 `sitemap.xml`(124개 URL)을 정답지로 저장하고, 빌드 산출물 `dist/**/index.html`의 경로 집합과 비교하는 스크립트(`scripts/verify-urls.mjs`)를 만든다. **하나라도 어긋나면 실패로 처리한다.** 댓글 유실과 SEO 손실을 막는 결정적 검증이다.

예상되는 정당한 차이는 다음 두 건뿐이며, 스크립트에 명시적 예외로 기록한다.

- `/refernece` 제거, `/reference` 추가 (3-3의 오타 수정)
- 홈 `/` 추가 — 현재 sitemap에 누락되어 있음 (Gatsby sitemap 플러그인이 빠뜨린 것)

trailing slash 차이는 3-2에 따라 정규화 후 비교한다.

### 8-2. 콘텐츠 완전성

- 글 113개 전부 렌더링 확인
- Zod 스키마가 프론트매터 이상을 빌드타임에 잡는다 (4절 스키마, `description`은 선택)

### 8-3. 기능 검증

- RSS: `algorithm`·`report` 카테고리 제외 규칙 유지 확인
- `report` 카테고리: `creator`/`created_at`/`link` 필드 렌더링 확인
- 목차 앵커 링크 동작 확인
- 코드 하이라이팅, 이미지 확대, 유튜브 임베드 3곳

### 8-4. 시각 대조

로컬 빌드를 띄우고 라이브 사이트와 나란히 비교한다: 홈, 글 상세, 카테고리 페이지, `report` 목록, 다크모드 토글.

### 8-5. 롤백 경로

`ohseunghyeon.github.io`의 현재 상태를 태그로 찍어둔다. Pages 설정을 legacy로 되돌리면 즉시 원복된다.

## 9. 함께 처리하는 정리 대상

- **`html.js`의 `alert()` 버그**: 다크모드 초기화 스크립트의 `matchMedia` 리스너 안에 `alert(e.matches)`가 남아 있다. 방문자가 페이지를 열어둔 상태에서 OS 테마가 바뀌면 경고창이 뜬다. 제거한다.
- **`refernece` → `reference`** (3-3)
- **방치 파일**: `src/pages/using-typescript.tsx.backup`, `content/blog/blogging/making-table-of-contents-on-gatsby-starter-blog.md.backup`
- **`cli/create-new-post.js` → `scripts/new-post.mjs`**: 현재 CommonJS + `inquirer@7`. 현행 `inquirer`는 ESM이므로 `@inquirer/prompts` 기반으로 다시 쓴다. 동작(카테고리 선택, 신규 카테고리 입력, 파일/디렉터리 선택, 프론트매터 생성)은 그대로 유지하고 `report` 카테고리의 추가 필드 처리도 보존한다.

## 10. 단계 구분

빌드 검증과 배포 전환을 분리해 실패 시 원인을 구분할 수 있게 한다.

**1단계 — `gatsby-blog` 브랜치에서 Astro 재작성**
로컬 빌드 성공과 8-1 URL 검증 통과까지. 이 시점에 배포는 건드리지 않는다.

**2단계 — 저장소 통합 및 배포 전환**
`ohseunghyeon.github.io`에 `--allow-unrelated-histories`로 병합해 소스를 이관하고, 기존 정적 파일을 정리하고, Pages를 Actions 방식으로 전환한다. 사전에 롤백 태그를 찍는다.

**3단계 — 미배포 글 반영 확인**
4년간 배포되지 못한 글 2개가 사이트에 올라오는지 확인한다.
- `content/blog/lavender/21-month-baby.md` (2022-01-11)
- `content/blog/reference/...unique-index-by-null.md` 수정 (2022-12-02)

## 11. 명시적 비목표

- 디자인 개선 및 리뉴얼 — 시각적 결과 보존이 목표다
- TypeScript 전면 도입 — `content.config.ts`만 TS로 두고 나머지는 JS/JSX 유지
- 글 내용 수정 — 6절의 `youtube:` 3곳, `:emoji:` 4곳 치환은 예외
- 새 기능 추가 (검색, 태그, 페이지네이션 등)
