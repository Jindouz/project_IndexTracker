import React, { useEffect, useRef } from 'react';

const HeatMap: React.FC = () => {
  // Use `HTMLDivElement` to type the ref
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the container is present and the script is not already in the DOM
    if (containerRef.current && !containerRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        exchanges: [
          "NASDAQ"
        ],
        dataSource: "SPX500",
        grouping: "no_group",
        blockSize: "market_cap_basic",
        blockColor: "change",
        locale: "en",
        symbolUrl: "",
        colorTheme: "dark",
        hasTopBar: false,
        isDataSetEnabled: false,
        isZoomEnabled: true,
        hasSymbolTooltip: true,
        width: "100%",
        height: "100%"
      });
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container" style={{ width: '100%', height: '600px',pointerEvents: 'none' }} ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow noreferrer" target="_blank">
          <span className="blue-text"></span>
        </a>
      </div>
    </div>
  );
};

export default HeatMap;
