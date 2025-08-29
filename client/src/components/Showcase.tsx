import { useState } from 'react'
import './Showcase.css'

interface ShowcaseProps {
  onBack: () => void
}

function Showcase({ onBack }: ShowcaseProps) {
  const [activeTab, setActiveTab] = useState('hyperliquid-sdk')

  return (
    <div className="showcase-container">
      <div className="showcase-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1 className="showcase-title">Projects</h1>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab ${activeTab === 'hyperliquid-sdk' ? 'active' : ''}`}
            onClick={() => setActiveTab('hyperliquid-sdk')}
          >
            Hyperliquid Ruby SDK
          </button>
          <button 
            className={`tab ${activeTab === 'more-coming' ? 'active' : ''}`}
            onClick={() => setActiveTab('more-coming')}
            disabled
          >
            More Coming Soon
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'hyperliquid-sdk' && (
            <div className="tab-panel">
              <h2>Hyperliquid Ruby SDK</h2>
              <p>Ruby SDK for interacting with Hyperliquid's API</p>
              
              <div className="repository-links">
                <div className="repo-item">
                  <strong>This Application:</strong>{' '}
                  <a href="https://github.com/carter2099/hub" target="_blank" rel="noopener noreferrer">
                    github.com/carter2099/hub
                  </a>
                  <span className="repo-description">Code running on this page</span>
                </div>
                
                <div className="repo-item">
                  <strong>SDK Repository:</strong>{' '}
                  <a href="https://github.com/carter2099/hyperliquid" target="_blank" rel="noopener noreferrer">
                    github.com/carter2099/hyperliquid
                  </a>
                  <span className="repo-description">The actual Ruby SDK</span>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'more-coming' && (
            <div className="tab-panel">
              <h2>More Projects</h2>
              <p>Additional projects will be added as they're built</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Showcase
