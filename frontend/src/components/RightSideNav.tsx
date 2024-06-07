// import React, { useState } from 'react'
import TradingViewMarketNews from './TradingViewMarketNews';
import HeatMap from './HeatMap';

const LeftSideNav = () => {

    // const [showTradingView, setShowTradingView] = useState(true);

    const getRandomNumber = (num: number) => {
        return Math.floor(Math.random() * 999) + num;
    };

    const generatePicsumUrl = (seed: number) => {
        return `https://picsum.photos/seed/${seed}/500/200`;
    };
    // const randomSeed = getRandomNumber();

    return (
        <div className="card animate__animated animate__fadeInRight">
            <br />
            <div className="card">
                <div style={{ borderRadius: '3px', border: '1px solid #808080', margin: '5px' }}>
                    <TradingViewMarketNews
                        feedMode="market"
                        market='stock'
                        isTransparent={true}
                        displayMode="regular"
                        width={'90%'}
                        height={550}
                        colorTheme="dark"
                        locale="en"
                    />
                </div>

            </div>
            <br />
            <div className="card custom-well" style={{ height: "300px" }}>
                <HeatMap />
            </div>
            <br />
            <div className="card custom-well">
                <img
                    src={generatePicsumUrl(getRandomNumber(2))}
                    className="img-responsive"
                    style={{ width: "100%" }}
                    alt=''
                />
                (Ad 1)
            </div>
            <div className="card custom-well" style={{ height: "500px" }}>
            </div>
        </div>
    )
}

export default LeftSideNav