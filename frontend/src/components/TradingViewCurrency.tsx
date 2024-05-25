import React, { useEffect, useRef } from 'react';

interface TradingViewCurrencyProps {
  symbol: string;
  isTransparent: boolean;
  width: string;
  colorTheme: 'light' | 'dark';
  locale: string;
}

const TradingViewCurrency: React.FC<TradingViewCurrencyProps> = ({
  symbol,
  isTransparent,
  width,
  colorTheme,
  locale,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        symbol,
        isTransparent,
        width,
        colorTheme,
        locale,
      });
      containerRef.current.appendChild(script);
    }
  }, [symbol, isTransparent, width, colorTheme, locale]);

  return (
    <div className="tradingview-widget-container" style={{ margin: '0 auto',pointerEvents: 'none' }} ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
      {/* <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div> */}
    </div>
  );
};

export default TradingViewCurrency;
