import axios from 'axios';

// export const baseURL = 'http://localhost:5000'; // flask
// export const baseURL = 'https://deploy-intraday-stocks.onrender.com'; // render_old

export const baseURL = 'http://127.0.0.1:8000'; // django
// export const baseURL = 'https://project-stocks-django.onrender.com'; // render
// export const baseURL = 'https://docker-django-stocks.onrender.com'; // render docker (it exceeds the 512mb ram render limit on free tier so can't use that for now)

export const fetchStockSymbols = async () => {
    try {
        const response = await axios.get(`${baseURL}/stock_symbols`);
        return response.data.Symbols;
    } catch (error) {
        console.error('Error fetching stock symbols:', error);
        throw error;
    }
};

export const fetchCryptoSymbols = async () => {
    try {
        const response = await axios.get(`${baseURL}/crypto_symbols`);
        return response.data.Symbols;
    } catch (error) {
        console.error('Error fetching crypto symbols:', error);
        throw error;
    }
};

export const fetchIntradayData = async (symbol: string) => {
    try {
        const response = await axios.post(`${baseURL}/intraday_data`, { symbol });
        return response.data;
    } catch (error) {
        console.error('Error fetching intraday data:', error);
        throw error;
    }
};

// export const fetchIntradayData = async (symbol: string, weekly?: boolean) => {
//     try {
//         const response = await axios.post(`${baseURL}/intraday_data`, { symbol, weekly });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching intraday data:', error);
//         throw error;
//     }
// };

export const fetchIntradayWeeklyData = async (symbol: string, weekly?: boolean) => {
    try {
        const response = await axios.post(`${baseURL}/intraday_data_weekly`, { symbol });
        return response.data;
    } catch (error) {
        console.error('Error fetching intraday data:', error);
        throw error;
    }
};


export const fetchCurrentPrice = async (symbol: string) => {
    try {
        const response = await axios.post(`${baseURL}/current_price`, { symbol });
        return response.data.current_price;
    } catch (error) {
        console.error('Error fetching current price:', error);
        throw error;
    }
};


export const fetchSentimentData = async (symbol: string) => {
    try {
        const response = await axios.post(`${baseURL}/sentiment`, { symbol });
        return response.data;
    } catch (error) {
        console.error('Error fetching sentiment data:', error);
        throw error;
    }
};