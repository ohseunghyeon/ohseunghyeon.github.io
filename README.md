# ohseunghyeon.github.io의 정적 사이트 생성기

[Astro](https://astro.build)로 만든 블로그. 결과물은 `ohseunghyeon.github.io`로 배포된다.

## 요구사항

Node 22 LTS. `.nvmrc`가 있으므로 `nvm use`로 맞출 수 있다.

CI와 로컬의 Node 버전을 일치시키는 것이 중요하다. 이 프로젝트는 과거에
CI가 Node 버전을 고정하지 않아, GitHub 러너의 기본 Node가 올라갔을 때
네이티브 의존성 빌드가 깨지면서 4년간 배포가 멈춘 적이 있다.

## 명령어

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | `dist/`로 정적 빌드 |
| `npm run preview` | 빌드 결과 로컬 서빙 |
| `npm test` | 단위 테스트 (`node:test`) |
| `npm run verify:urls` | **URL 동일성 검증** — 아래 참조 |
| `npm run post` | 새 글 껍데기 생성 |

## URL 동일성 검증

댓글 시스템(utterances)이 URL 경로(`issue-term: pathname`)로 댓글을 찾는다.
**글의 URL이 바뀌면 그 글의 댓글이 영구히 떨어진다.**

`npm run verify:urls`는 빌드 결과의 URL 집합을 `scripts/live-sitemap.txt`
(배포된 사이트의 sitemap 스냅샷)와 대조한다. 의도된 차이는 스크립트 안에
명시적으로 기록돼 있고, 그 외의 차이는 실패로 처리한다. CI가 배포 전에
이 검증을 실행하므로, 글 파일을 옮기면 배포가 막힌다.

의도적으로 URL을 바꿔야 한다면 `scripts/verify-urls.mjs`의
`EXPECTED_REMOVED` / `EXPECTED_ADDED`에 이유와 함께 추가한다.

## 구조

```
src/
├─ content/blog/         글 (마크다운)
├─ content.config.ts     Content Collections 스키마
├─ layouts/              BaseLayout
├─ pages/                라우트
├─ components/           .astro (정적) + .jsx (React 아일랜드)
├─ styles/               global.scss, variables.scss, typography.css
└─ utils/posts.js        슬러그·카테고리·읽기시간 (테스트 있음)
public/
├─ sw.js                 서비스 워커 묘비 — 삭제 금지, 아래 참조
└─ manifest.webmanifest
```

### 글 URL 규칙

URL은 `src/content/blog/` 기준 파일 경로에서 나온다. 프론트매터의
`category`와는 무관하다.

| 파일 | URL |
|---|---|
| `lavender/1-year.md` | `/lavender/1-year/` |
| `study/APIs-The-Good/index.md` | `/study/APIs-The-Good/` |

**URL은 항상 `slugFromFilePath()`를 거쳐 만들어야 한다.** Astro의 glob
로더는 `entry.id`를 소문자로 정규화하므로, `id`를 URL에 직접 쓰면 대문자를
포함한 글의 URL이 조용히 바뀐다.

### `public/sw.js`를 삭제하지 말 것

이전 스택(`gatsby-plugin-offline`)이 방문자 브라우저에 서비스 워커를
등록해뒀다. 등록된 서비스 워커는 서버에서 파일이 사라져도 스스로
사라지지 않으므로, 그냥 지우면 기존 방문자는 캐시된 옛 사이트를 계속
보게 된다. `public/sw.js`는 자기 자신을 등록 해제하고 캐시를 비우는
묘비이며, 기존 방문자가 모두 정리될 때까지 유지해야 한다.

## 배포

`master`에 push하면 GitHub Actions가 빌드해 GitHub Pages로 배포한다.
`GITHUB_TOKEN`만 사용하므로 별도 시크릿이 필요 없다.
