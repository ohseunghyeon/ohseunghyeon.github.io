import { useState, useEffect } from 'react'
import ReactToggleModule from 'react-toggle'

import sun from '../../assets/sun.png'
import moon from '../../assets/moon.png'

import './Toggle.scss'

// react-toggle은 __esModule: true인 CJS 패키지다. 번들러는 이 표시를 보고
// default를 풀어주지만 Node의 CJS interop은 그러지 않아 SSR에서는
// 네임스페이스 객체가 들어온다. 양쪽 모두를 처리한다.
const ReactToggle = ReactToggleModule.default ?? ReactToggleModule

const Toggle = () => {
  const [theme, setTheme] = useState()

  useEffect(() => {
    setTheme(window.__theme)
    window.__onThemeChange = () => {
      setTheme(window.__theme)
    }
  }, [])

  return (
    <ReactToggle
      icons={{
        checked: (
          <img
            src={moon.src ?? moon}
            width="16"
            height="16"
            alt="presentation"
            style={{ pointerEvents: 'none' }}
          />
        ),
        unchecked: (
          <img
            src={sun.src ?? sun}
            width="16"
            height="16"
            alt="presentation"
            style={{ pointerEvents: 'none' }}
          />
        ),
      }}
      checked={theme === 'dark'}
      onChange={e => window.__setPreferredTheme(e.target.checked ? 'dark' : 'light')}
    />
  )
}

export default Toggle
