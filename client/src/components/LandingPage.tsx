import './LandingPage.css'

interface LandingPageProps {
  onEnterClick: () => void
}

function LandingPage({ onEnterClick }: LandingPageProps) {
  return (
    <div className="landing-container">
      <h1 className="site-title">carter2099.com</h1>
      
      <button className="enter-button" onClick={onEnterClick}>
        Enter
      </button>
      
      <div className="cards-container">
        <div className="card">
          <a href="https://blog.carter2099.com" target="_blank" rel="noopener noreferrer">
            <h2>Blog</h2>
            <p>Personal thoughts and technical writing</p>
          </a>
        </div>
        
        <div className="card">
          <a href="https://github.com/carter2099" target="_blank" rel="noopener noreferrer">
            <h2>GitHub</h2>
            <p>Code repositories and open source projects</p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
