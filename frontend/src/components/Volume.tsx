import React, { useEffect, useRef } from 'react';

interface VolumeProps {
  symbol: string;
}

const Volume: React.FC<VolumeProps> = ({ symbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol,
        timezone: 'Asia/Jerusalem',
        theme: 'dark',
        style: '1',
        locale: 'en',
        enable_publishing: false,
        backgroundColor: '#1e222d',
        hide_top_toolbar: true,
        range: '1D',
        calendar: false,
        studies: ['STD;24h%Volume'],
        support_host: 'https://www.tradingview.com'
      });
      containerRef.current.appendChild(script);
    }
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" style={{ height: '600px', width: '95%' , margin: '0 auto',pointerEvents: 'none'  }}>
      <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }} ref={containerRef}></div>
      <div className="tradingview-widget-copyright">
        {/* <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text"></span>
        </a> */}
      </div>
    </div>
  );
};

export default Volume;
