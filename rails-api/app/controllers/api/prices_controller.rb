class Api::PricesController < ApplicationController
  def current
    # Target cryptocurrencies
    target_coins = %w[BTC ETH BNB SOL HYPE]
    
    begin
      # Initialize Hyperliquid SDK
      sdk = Hyperliquid.new
      
      # Get all market mid prices
      all_prices = sdk.info.all_mids
      
      # Filter for our target coins and format response
      filtered_prices = target_coins.filter_map do |coin|
        price = all_prices[coin]
        next unless price
        
        {
          symbol: coin,
          price: price.to_f,
          formatted_price: format_price(price.to_f),
          updated_at: Time.current.iso8601
        }
      end
      
      render json: {
        success: true,
        prices: filtered_prices,
        timestamp: Time.current.iso8601
      }
      
    rescue StandardError => e
      Rails.logger.error "Error fetching prices: #{e.message}"
      
      render json: {
        success: false,
        error: "Failed to fetch prices",
        message: e.message
      }, status: :internal_server_error
    end
  end
  
  def order_book
    coin = params[:coin] || 'BTC'
    
    # Validate coin parameter
    valid_coins = %w[BTC ETH BNB SOL HYPE]
    unless valid_coins.include?(coin)
      return render json: {
        success: false,
        error: "Invalid coin. Must be one of: #{valid_coins.join(', ')}"
      }, status: :bad_request
    end
    
    begin
      # Initialize Hyperliquid SDK
      sdk = Hyperliquid.new
      
      # Get L2 order book for the specified coin
      book_data = sdk.info.l2_book(coin)
      
      # Format the order book data
      formatted_book = format_order_book(book_data)
      
      render json: {
        success: true,
        coin: coin,
        order_book: formatted_book,
        timestamp: Time.current.iso8601
      }
      
    rescue StandardError => e
      Rails.logger.error "Error fetching order book for #{coin}: #{e.message}"
      
      render json: {
        success: false,
        error: "Failed to fetch order book",
        message: e.message
      }, status: :internal_server_error
    end
  end

  private
  
  def format_price(price)
    if price >= 1000
      "$#{price.round(0).to_s.reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse}"
    elsif price >= 1
      "$#{price.round(2)}"
    else
      "$#{price.round(6)}"
    end
  end
  
  def format_order_book(book_data)
    # Extract asks and bids from the response
    levels = book_data['levels'] || [[], []]
    asks = levels[0] || []
    bids = levels[1] || []
    
    # Format asks (sell orders) - take top 10
    formatted_asks = asks.first(10).map do |ask|
      {
        price: ask['px'].to_f,
        size: ask['sz'].to_f,
        formatted_price: format_book_price(ask['px'].to_f),
        formatted_size: format_size(ask['sz'].to_f)
      }
    end.reverse # Reverse so highest price is at top
    
    # Format bids (buy orders) - take top 10
    formatted_bids = bids.first(10).map do |bid|
      {
        price: bid['px'].to_f,
        size: bid['sz'].to_f,
        formatted_price: format_book_price(bid['px'].to_f),
        formatted_size: format_size(bid['sz'].to_f)
      }
    end
    
    {
      asks: formatted_asks,
      bids: formatted_bids,
      updated_at: book_data['time']
    }
  end
  
  def format_book_price(price)
    if price >= 1000
      price.round(2).to_s.reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse
    elsif price >= 1
      price.round(4).to_s
    else
      price.round(6).to_s
    end
  end
  
  def format_size(size)
    if size >= 1000
      size.round(1).to_s.reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse
    else
      size.round(4).to_s
    end
  end
end
