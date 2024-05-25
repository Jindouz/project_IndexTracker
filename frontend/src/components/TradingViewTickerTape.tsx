import React, { useEffect, useRef } from 'react';

const TradingViewTickerTape: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the container is present and the script is not already in the DOM
    if (containerRef.current && !containerRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        symbols: [
          { description: "", proName: "NASDAQ:TSLA" },
          { description: "", proName: "NASDAQ:NVDA" },
          { description: "", proName: "NASDAQ:AAPL" },
          { description: "", proName: "NASDAQ:AMD" },
          { description: "", proName: "NASDAQ:AMZN" },
          { description: "", proName: "NASDAQ:MSFT" },
          { description: "", proName: "NASDAQ:NFLX" },
          { description: "", proName: "NASDAQ:META" },
          { description: "", proName: "NASDAQ:INTC" }
        ],
        showSymbolLogo: true,
        isTransparent: false,
        displayMode: "adaptive",
        colorTheme: "dark",
        locale: "en"
      });
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container" style={{ width: '100%', marginTop: '-20px',pointerEvents: 'none' }} ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="/" rel="noopener noreferrer" target="_blank">
          <span className="blue-text"></span>
        </a>
      </div>
    </div>
  );
};

export default TradingViewTickerTape;
