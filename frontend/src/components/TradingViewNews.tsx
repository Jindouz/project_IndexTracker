import React, { useEffect, useRef } from 'react';

interface TradingViewNewsProps {
  feedMode: string;
  symbol: string;
  isTransparent: boolean;
  displayMode: string;
  width: number | string;
  height: number | string;
  colorTheme: string;
  locale: string;
}

const TradingViewNews: React.FC<TradingViewNewsProps> = ({
  feedMode,
  symbol,
  isTransparent,
  displayMode,
  width,
  height,
  colorTheme,
  locale,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the container is present and the script is not already in the DOM
    if (containerRef.current && !containerRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        feedMode,
        symbol,
        isTransparent,
        displayMode,
        width,
        height,
        colorTheme,
        locale,
      });
      containerRef.current.appendChild(script);
    }
  }, [feedMode, symbol, isTransparent, displayMode, width, height, colorTheme, locale]);

  return (
    <div className="tradingview-widget-container" style={{ margin: '0 auto' }} ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
      {/* <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener noreferrer" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div> */}
    </div>
  );
};

export default TradingViewNews;
