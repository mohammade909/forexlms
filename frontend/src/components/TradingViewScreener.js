

import { useEffect, useRef } from "react";

const TradingViewScreener = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "600px",
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "BTC",
      colorTheme: "light",
      locale: "en",
      isTransparent: true,
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div ref={containerRef} className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="text-blue-500">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default TradingViewScreener;


