import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchStockSymbols, fetchIntradayData, fetchCurrentPrice, fetchIntradayWeeklyData, fetchSentimentData, fetchCryptoSymbols } from './IntradayViewerAPI';

interface IntradayViewerState {
  sentimentData: any;
  chartData: any;
  chartDataWeekly: any;
  errorDaily: boolean;
  symbol: string;
  symbolCrypto: string;
  symbolStatus: string;
  currentPrice: number | null;
  priceChangeColor: string;
  stockSymbols: any[];
  cryptoSymbols: any[];
  marketStatus: string;
  loading: {
    stockSymbols: boolean;
    cryptoSymbols: boolean;
    intradayData: boolean;
    currentPrice: boolean;
    sentimentData: boolean;
  };
}

const initialState: IntradayViewerState = {
  sentimentData: null,
  chartData: null,
  chartDataWeekly: null,
  errorDaily: false,
  symbol: 'TSLA',
  symbolCrypto: 'BTC',
  symbolStatus: 'TSLA',
  currentPrice: null,
  priceChangeColor: '',
  stockSymbols: [],
  cryptoSymbols: [],
  marketStatus: '',
  loading: {
    stockSymbols: false,
    cryptoSymbols: false,
    intradayData: false,
    currentPrice: false,
    sentimentData: false,
  },
};




export const fetchStockSymbolsAsync = createAsyncThunk(
  'intradayViewer/fetchStockSymbols',
  async (_, { dispatch }) => {
    try {
      const symbols = await fetchStockSymbols();
      dispatch(intradayViewerSlice.actions.setStockSymbols(symbols));
    } catch (error) {
      // Handle error
    }
  }
);

export const fetchCryptoSymbolsAsync = createAsyncThunk(
  'intradayViewer/fetchCryptoSymbols',
  async (_, { dispatch }) => {
    try {
      const symbols = await fetchCryptoSymbols();
      dispatch(intradayViewerSlice.actions.setCryptoSymbols(symbols));
    } catch (error) {
      // Handle error
    }
  }
);

export const fetchDataAsync = createAsyncThunk(
  'intradayViewer/fetchData',
  async (symbol: string, { dispatch }) => {
    try {
      const data = await fetchIntradayData(symbol);
      // Handle data
      dispatch(intradayViewerSlice.actions.setChartData(data));
    } catch (error) {
      // Handle error
    }
  }
);

export const fetchDataWeeklyAsync = createAsyncThunk(
  'intradayViewer/fetchDataWeekly',
  async (symbol: string, { dispatch }) => {
    try {
      const data = await fetchIntradayWeeklyData(symbol);
      // Handle data
      dispatch(intradayViewerSlice.actions.setChartDataWeekly(data));
    } catch (error) {
      // Handle error
    }
  }
);
// export const fetchDataWeeklyAsync = createAsyncThunk(
//   'intradayViewer/fetchDataWeekly',
//   async (symbol: string, { dispatch }) => {
//     try {
//       const data = await fetchIntradayData(symbol, true);
//       // Handle data
//       dispatch(intradayViewerSlice.actions.setChartDataWeekly(data));
//     } catch (error) {
//       // Handle error
//     }
//   }
// );

export const fetchCurrentPriceAsync = createAsyncThunk(
  'intradayViewer/fetchCurrentPrice',
  async (symbol: string, { dispatch }) => {
    try {
      const price = await fetchCurrentPrice(symbol);
      dispatch(intradayViewerSlice.actions.setCurrentPrice(price));
    } catch (error) {
      // Handle error
    }
  }
);


export const fetchSentimentAsync = createAsyncThunk(
  'intradayViewer/fetchSentimentData',
  async (symbol: string, { dispatch }) => {
    try {
      const data = await fetchSentimentData(symbol);
      // Handle data
      dispatch(intradayViewerSlice.actions.setSentimentData(data));
    } catch (error) {
      // Handle error
    }
  }
);

export const intradayViewerSlice = createSlice({
  name: 'intradayViewer',
  initialState,
  reducers: {
    setSentimentData: (state, action: PayloadAction<any>) => {
      state.sentimentData = action.payload;
    },
    setChartData: (state, action: PayloadAction<any>) => {
      state.chartData = action.payload;
    },
    setChartDataWeekly: (state, action: PayloadAction<any>) => {
      state.chartDataWeekly = action.payload;
    },
    setErrorDailyChart: (state, action: PayloadAction<boolean>) => {
      state.errorDaily = action.payload;
    },
    setSymbol: (state, action: PayloadAction<string>) => {
      state.symbol = action.payload;
    },
    setSymbolCrypto: (state, action: PayloadAction<string>) => {
      state.symbolCrypto = action.payload;
    },
    setSymbolStatus: (state, action: PayloadAction<string>) => {
      state.symbolStatus = action.payload;
    },
    setCurrentPrice: (state, action: PayloadAction<number | null>) => {
      state.currentPrice = action.payload;
    },
    setPriceChangeColor: (state, action: PayloadAction<string>) => {
      state.priceChangeColor = action.payload;
    },
    setStockSymbols: (state, action: PayloadAction<any[]>) => {
      state.stockSymbols = action.payload;
    },
    setCryptoSymbols: (state, action: PayloadAction<any[]>) => {
      state.cryptoSymbols = action.payload;
    },
    setMarketStatus: (state, action: PayloadAction<string>) => {
      state.marketStatus = action.payload;
    },
    setLoading: (state, action: PayloadAction<{ key: keyof IntradayViewerState['loading']; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockSymbolsAsync.pending, (state) => {
        state.loading.stockSymbols = true;
      })
      .addCase(fetchStockSymbolsAsync.fulfilled, (state) => {
        state.loading.stockSymbols = false;
      })
      .addCase(fetchCryptoSymbolsAsync.pending, (state) => {
        state.loading.cryptoSymbols = true;
      })
      .addCase(fetchCryptoSymbolsAsync.fulfilled, (state) => {
        state.loading.cryptoSymbols = false;
      })
      .addCase(fetchDataAsync.pending, (state) => {
        state.loading.intradayData = true;
      })
      .addCase(fetchDataAsync.fulfilled, (state) => {
        state.loading.intradayData = false;
      })
      .addCase(fetchCurrentPriceAsync.pending, (state) => {
        state.loading.currentPrice = true;
      })
      .addCase(fetchCurrentPriceAsync.fulfilled, (state) => {
        state.loading.currentPrice = false;
      })
      .addCase(fetchSentimentAsync.pending, (state) => {
        state.loading.sentimentData = true;
      })
      .addCase(fetchSentimentAsync.fulfilled, (state) => {
        state.loading.sentimentData = false;
      });
  },
});

export const { setSymbol } = intradayViewerSlice.actions;
export const { setSymbolCrypto } = intradayViewerSlice.actions;
export const { setChartData } = intradayViewerSlice.actions;
export const { setChartDataWeekly } = intradayViewerSlice.actions;
export const { setErrorDailyChart } = intradayViewerSlice.actions;
// Selectors
export const selectChartData = (state: RootState) => state.intradayViewer.chartData;
export const selectChartDataWeekly = (state: RootState) => state.intradayViewer.chartDataWeekly;
export const selectSymbol = (state: RootState) => state.intradayViewer.symbol;
export const selectSymbolCrypto = (state: RootState) => state.intradayViewer.symbolCrypto;
export const selectCurrentPrice = (state: RootState) => state.intradayViewer.currentPrice;
export const selectStockSymbols = (state: RootState) => state.intradayViewer.stockSymbols;
export const selectCryptoSymbols = (state: RootState) => state.intradayViewer.cryptoSymbols;
export const selectMarketStatus = (state: RootState) => state.intradayViewer.marketStatus;
export const selectLoading = (state: RootState) => state.intradayViewer.loading;
export const selectSentimentData = (state: RootState) => state.intradayViewer.sentimentData;
export const selectErrorDailyChart = (state: RootState) => state.intradayViewer.errorDaily;

export default intradayViewerSlice.reducer;
