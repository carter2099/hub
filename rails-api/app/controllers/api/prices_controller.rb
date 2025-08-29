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
end
