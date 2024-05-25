import React, { useEffect, useState } from 'react'
import TradingViewNews from './TradingViewNews';
import { useAppSelector } from '../app/hooks';
import { selectSymbol } from '../features/intraday/IntradayViewerSlice';
import TradingViewCurrency from './TradingViewCurrency';
import Markets from './Markets';

const RightSideNav = () => {

    const symbol = useAppSelector(selectSymbol);
    const [showTradingView, setShowTradingView] = useState(true);

    const getRandomNumber = (num: number) => {
        return Math.floor(Math.random() * 999) + num;
    };

    useEffect(() => {
        // Hide TradingViewNews component when symbol changes
        setShowTradingView(false);
        setTimeout(() => {
            setShowTradingView(true);
        }, 200);
    }, [symbol]);

    const generatePicsumUrl = (seed: number) => {
        return `https://picsum.photos/seed/${seed}/500/200`;
    };
    // const randomSeed = getRandomNumber();

    return (
        <div className="card animate__animated animate__fadeInLeft">
            <br />
            {showTradingView && (
                <div>
                    <TradingViewNews
                        feedMode="symbol"
                        symbol={`NASDAQ:${symbol ? symbol : 'TSLA'}`}
                        isTransparent={false}
                        displayMode="regular"
                        width={'90%'}
                        height={550}
                        colorTheme="dark"
                        locale="en"
                    />
                </div>
            )}
            <br />
            <div className="card custom-well">
                <Markets />
                </div>
            <div className="card custom-well">
                <TradingViewCurrency symbol="FX_IDC:USDILS" isTransparent={false} width={'100%'} colorTheme={'dark'} locale={'en'} />
            </div>
            <br />
            <div className="card custom-well">
                <img
                    src={generatePicsumUrl(getRandomNumber(4))}
                    className="img-responsive"
                    style={{ width: "100%" }}
                    alt=''
                />
                (Ad 2)
            </div>
        </div>
    )
}

export default RightSideNav