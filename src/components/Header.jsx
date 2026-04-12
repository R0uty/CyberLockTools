import './Header.css'

export default function Header({ onLogoClick, currentPage, onPageChange }) {
  const handleNavClick = (page) => {
    onPageChange(page)
  }

  const getLinkClass = (page) => {
    return currentPage === page ? 'nav-link active' : 'nav-link'
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1 onClick={() => {
            onLogoClick()
            handleNavClick('home')
          }} className="logo-heading">R0uty's Cyber Lab</h1>
        </div>
        <nav className="nav">
          <a className={getLinkClass('home')} onClick={() => handleNavClick('home')}>Home</a>
          <a className={getLinkClass('tools')} onClick={() => handleNavClick('tools')}>Tools</a>
          <a className={getLinkClass('lab-notes')} onClick={() => handleNavClick('lab-notes')}>Lab Notes</a>
          <a className={getLinkClass('about')} onClick={() => handleNavClick('about')}>About</a>
          <a className={getLinkClass('contact')} onClick={() => handleNavClick('contact')}>Contact</a>
        </nav>
      </div>
    </header>
  )
}
