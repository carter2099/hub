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

interface OrderBookLevel {
  price: number
  size: number
  formatted_price: string
  formatted_size: string
}

interface OrderBook {
  asks: OrderBookLevel[]
  bids: OrderBookLevel[]
  updated_at: number
}

function Showcase({ onBack }: ShowcaseProps) {
  const [activeTab, setActiveTab] = useState('hyperliquid-sdk')
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  
  // Order book state
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null)
  const [selectedCoin, setSelectedCoin] = useState<string>('BTC')
  const [orderBookLoading, setOrderBookLoading] = useState(true)
  const [orderBookError, setOrderBookError] = useState<string | null>(null)

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

  const fetchOrderBook = async (coin: string, isInitialLoad = false) => {
    try {
      console.log('Fetching order book for:', coin)
      
      // Only show loading on initial load or coin change, not on refresh
      if (isInitialLoad) {
        setOrderBookLoading(true)
      }
      
      const response = await fetch(`http://localhost:3000/api/prices/order_book?coin=${coin}`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Order book data:', data)
      
      if (data.success) {
        setOrderBook(data.order_book)
        setOrderBookError(null)
      } else {
        setOrderBookError(data.message || 'Failed to fetch order book')
      }
    } catch (err) {
      console.error('Error fetching order book:', err)
      if (err instanceof Error) {
        setOrderBookError(`Error: ${err.message}`)
      } else {
        setOrderBookError('Network error: Unable to fetch order book')
      }
    } finally {
      if (isInitialLoad) {
        setOrderBookLoading(false)
      }
    }
  }

  const handleCoinSelect = (coin: string) => {
    setSelectedCoin(coin)
    fetchOrderBook(coin, true) // Show loading when switching coins
  }

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 10000) // Update every 10 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    fetchOrderBook(selectedCoin, true) // Show loading on initial load
    const interval = setInterval(() => fetchOrderBook(selectedCoin, false), 1000) // Update every 1 second
    
    return () => clearInterval(interval)
  }, [selectedCoin])

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
              
              <div className="order-book-section">
                <h3>Live Hyperliquid Order Book</h3>
                
                <div className="coin-selector">
                  {prices.map((priceData) => (
                    <button
                      key={priceData.symbol}
                      className={`coin-button ${selectedCoin === priceData.symbol ? 'active' : ''}`}
                      onClick={() => handleCoinSelect(priceData.symbol)}
                    >
                      {priceData.symbol}
                    </button>
                  ))}
                </div>
                
                {orderBookLoading ? (
                  <div className="loading-state">Loading order book...</div>
                ) : orderBookError ? (
                  <div className="error-state">
                    <p>Error: {orderBookError}</p>
                    <button className="retry-button" onClick={() => fetchOrderBook(selectedCoin, true)}>
                      Retry
                    </button>
                  </div>
                ) : orderBook ? (
                  <div className="order-book-container">
                    <div className="order-book-table">
                      <div className="asks-section">
                        <div className="section-header asks-header">
                          <span>Price</span>
                          <span>Size</span>
                        </div>
                        {orderBook.asks.map((ask, index) => (
                          <div key={`ask-${index}`} className="order-level ask-level">
                            <span className="price">{ask.formatted_price}</span>
                            <span className="size">{ask.formatted_size}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="spread-divider">
                        <span className="spread-label">Spread</span>
                      </div>
                      
                      <div className="bids-section">
                        <div className="section-header bids-header">
                          <span>Price</span>
                          <span>Size</span>
                        </div>
                        {orderBook.bids.map((bid, index) => (
                          <div key={`bid-${index}`} className="order-level bid-level">
                            <span className="price">{bid.formatted_price}</span>
                            <span className="size">{bid.formatted_size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
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
