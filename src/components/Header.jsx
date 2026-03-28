export default function Header({ onLogoClick }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1 onClick={onLogoClick} style={{ cursor: 'pointer' }}>🔒 CyberLock Tools</h1>
        </div>
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#tools">Tools</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  )
}
