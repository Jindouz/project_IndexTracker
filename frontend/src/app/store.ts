import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import IntradayViewerReducer from '../features/intraday/IntradayViewerSlice';
import loginReducer from '../features/login/loginSlice';
import watchlistReducer from '../features/watchlist/watchlistSlice';


export const store = configureStore({
  reducer: {
    intradayViewer: IntradayViewerReducer,
    login: loginReducer,
    watchlist: watchlistReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
