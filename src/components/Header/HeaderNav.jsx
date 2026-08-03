import './HeaderNav.scss'

const Nav = ({ pathname, categories }) => {
  const slug = pathname.replace(/^\//, '')

  // 원본은 ~slug.indexOf(next.slug)로 부분 문자열 포함을 검사했다.
  // 그러면 /reference/... 가 algorithm/reference 와도 교차 매칭된다.
  // 접두사 매칭으로 바꾸고, 더 긴 경로가 이기도록 마지막 일치를 택한다.
  const currentCategory = categories.reduce(
    (current, next) => (slug.indexOf(next.slug) === 0 ? next.slug : current),
    ''
  )

  return (
    <nav className="nav" role="navigation">
      <ol className="nav-links">
        {categories.map(({ slug, cat, count, depth }) => (
          <li
            className={`nav-link ${depth ? 'sub' : ''} ${
              currentCategory === slug ? 'current' : ''
            }`}
            key={slug}
          >
            <a href={`/${slug}/`}>
              {cat}
              <small>({count})</small>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Nav
