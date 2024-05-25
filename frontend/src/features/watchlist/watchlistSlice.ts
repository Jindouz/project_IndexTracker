import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../app/store';
import { removeFromWatchlist, addToWatchlist } from './watchlistAPI';


interface WatchlistItem {
  symbol: string;
}

interface WatchlistState {
  watchlist: WatchlistItem[];
  loading: boolean;
  error: string | null;
  addedToWatchlist: boolean;
}

const initialState: WatchlistState = {
  watchlist: [],
  loading: false,
  error: null,
  addedToWatchlist: false,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    removeFromWatchlistStart(state) {
      state.loading = true;
      state.error = null;
    },
    removeFromWatchlistSuccess(state, action: PayloadAction<string>) {
      state.watchlist = state.watchlist.filter(item => item.symbol !== action.payload);
      state.loading = false;
      state.error = null;
    },
    removeFromWatchlistFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addToWatchlistStart(state) {
      state.loading = true;
      state.error = null;
    },
    addToWatchlistSuccess(state, action: PayloadAction<WatchlistItem>) {
      state.watchlist.push(action.payload);
      state.addedToWatchlist = !state.addedToWatchlist;
      state.loading = false;
      state.error = null;
    },
    addToWatchlistFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  removeFromWatchlistStart,
  removeFromWatchlistSuccess,
  removeFromWatchlistFailure,
  addToWatchlistStart,
  addToWatchlistSuccess,
  addToWatchlistFailure,
} = watchlistSlice.actions;



export const removeFromWatchlistAsync = (symbol: string): AppThunk => async (dispatch) => {
  dispatch(removeFromWatchlistStart());
  const token = localStorage.getItem("token");
  if (token) {
    try {
      await removeFromWatchlist(symbol, token);
      dispatch(removeFromWatchlistSuccess(symbol));
    } catch (error: any) {
      dispatch(removeFromWatchlistFailure(error.message as string));
    }
  }
};

export const addToWatchlistAsync = (symbol: string): AppThunk => async (dispatch) => {
  dispatch(addToWatchlistStart());
  const token = localStorage.getItem("token");
  if (token) {
    try {
      await addToWatchlist(symbol, token);
      dispatch(addToWatchlistSuccess({ symbol }));
    } catch (error: any) {
      dispatch(addToWatchlistFailure(error.message as string));
    }
  }
};



// export const selectWatchlist = (state: RootState) => state.watchlist.watchlist;

export default watchlistSlice.reducer;
