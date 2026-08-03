import { useEffect, useRef } from 'react'
import Headroom from 'headroom.js'

import Hamburger from './HeaderHamburger.jsx'
import Nav from './HeaderNav.jsx'
import Toggle from './Toggle.jsx'

import './index.scss'

const Header = ({ title, pathname, categories }) => {
  const refHeader = useRef()

  useEffect(() => {
    const headroom = new Headroom(refHeader.current)
    headroom.init()

    return () => headroom.destroy()
  }, [])

  return (
    <header ref={refHeader} className="header">
      <Hamburger />
      <a style={{ color: 'var(--textTitle)' }} className="header-logo" href="/">
        {title}
      </a>
      <Nav pathname={pathname} categories={categories} />
      <Toggle />
    </header>
  )
}

export default Header
