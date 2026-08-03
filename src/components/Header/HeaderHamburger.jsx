import { useCallback, useRef } from 'react'

import './HeaderHamburger.scss'

const NavToggle = () => {
  const refButton = useRef(null)
  const handleToggle = useCallback(() => {
    refButton.current.classList.toggle('active')
  }, [])

  return (
    <button
      className="nav-toggle"
      ref={refButton}
      onClick={handleToggle}
      aria-label="nav-toggle"
    />
  )
}

export default NavToggle
