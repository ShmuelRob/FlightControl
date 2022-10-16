import React from 'react'

function Header() {
  return (
    <header>
      <div>Header</div>
      {/* <Logo /> */}
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/getData">getData</a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
