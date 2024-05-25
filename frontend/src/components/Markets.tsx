import React, { useEffect, useRef, memo } from 'react';


function Markets() {
    const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.querySelector('script')) {
        const script = document.createElement('script');
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
            "symbols": [
              [
                "FRED:SP500|1D"
              ],
              [
                "FRED:NDQ100|1D"
              ],
              [
                "BLACKBULL:US30|1D"
              ]
            ],
            "chartOnly": false,
            "width": 345,
            "height": 199,
            "locale": "en",
            "colorTheme": "dark",
            "autosize": true,
            "showVolume": false,
            "showMA": false,
            "hideDateRanges": true,
            "hideMarketStatus": true,
            "hideSymbolLogo": false,
            "scalePosition": "right",
            "scaleMode": "Normal",
            "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
            "fontSize": "10",
            "noTimeScale": false,
            "valuesTracking": "1",
            "changeMode": "price-and-percent",
            "chartType": "area",
            "lineWidth": 2,
            "lineType": 0,
            "isTransparent": true,
            "dateRanges": [
              "1d"
            ]
          } `;
          containerRef.current.appendChild(script);
        }
  }, []);

  return (
    <div className="tradingview-widget-container"  style={{ margin: '0 auto' }} ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        {/* <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a> */}
      </div>
    </div>
  );
}

export default memo(Markets);
