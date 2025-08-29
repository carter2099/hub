import { useState, useEffect } from 'react'
import './Showcase.css'

interface ShowcaseProps {
  onBack: () => void
}

interface Price {
  symbol: string
  price: number
  formatted_price: string
  updated_at: string
}

function Showcase({ onBack }: ShowcaseProps) {
  const [activeTab, setActiveTab] = useState('hyperliquid-sdk')
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const fetchPrices = async () => {
    try {
      console.log('Fetching prices from:', 'http://localhost:3000/api/prices/current')
      
      const response = await fetch('http://localhost:3000/api/prices/current', {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.success) {
        setPrices(data.prices)
        setLastUpdated(new Date().toLocaleTimeString())
        setError(null)
      } else {
        setError(data.message || 'Failed to fetch prices')
      }
    } catch (err) {
      console.error('Detailed error:', err)
      if (err instanceof Error) {
        setError(`Error: ${err.message}`)
      } else {
        setError('Network error: Unable to fetch prices')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 10000) // Update every 10 seconds
    
    return () => clearInterval(interval)
  }, [])

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
              
              <div className="live-prices-section">
                <h3>Live Hyperliquid Market Prices</h3>
                {loading ? (
                  <div className="loading-state">Loading prices...</div>
                ) : error ? (
                  <div className="error-state">
                    <p>Error: {error}</p>
                    <button className="retry-button" onClick={fetchPrices}>
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="prices-container">
                    <div className="prices-grid">
                      {prices.map((priceData) => (
                        <div key={priceData.symbol} className="price-card">
                          <div className="price-symbol">{priceData.symbol}</div>
                          <div className="price-value">{priceData.formatted_price}</div>
                        </div>
                      ))}
                    </div>
                    {lastUpdated && (
                      <div className="last-updated">
                        Last updated: {lastUpdated}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
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
