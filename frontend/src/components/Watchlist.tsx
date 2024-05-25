import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUsername } from "../features/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchCryptoSymbolsAsync,
  fetchStockSymbolsAsync,
  selectCryptoSymbols,
  selectStockSymbols,
  setSymbol,
  setSymbolCrypto,
} from "../features/intraday/IntradayViewerSlice";
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { removeFromWatchlistAsync } from "../features/watchlist/watchlistSlice";
import axios from "axios";
import { baseURL } from "../features/intraday/IntradayViewerAPI";

interface WatchlistProps {
  closeDrawer?: () => void;
}

const Watchlist: React.FC<WatchlistProps> = ({ closeDrawer }) => {

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const username = useSelector(selectUsername);
  const token = localStorage.getItem("token");
  const stockSymbols = useAppSelector(selectStockSymbols);
  const cryptoSymbols = useAppSelector(selectCryptoSymbols);
  const addedToWatchlist = useAppSelector(state => state.watchlist.addedToWatchlist);



  interface WatchlistItem {
    symbol: string;
  }

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCryptoSymbolsAsync());
    dispatch(fetchStockSymbolsAsync());
  }, [dispatch]);


  useEffect(() => {
    if (token) {
      fetchWatchlist(username, token);
    }
  }, [addedToWatchlist, username, token]);

  const fetchWatchlist = async (username: string, token: string) => {
    try {
      const response = await axios.get(`${baseURL}/get_watchlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const watchlistData: any[] = response.data;
      console.log("watchlistData", watchlistData);

      // Check if the response data has the date_added field
      if (watchlistData.length > 0 && 'date_added' in watchlistData[0]) {

        // Sort the watchlist by date_added in descending order
        const sortedWatchlist = watchlistData.sort((a, b) => {
          if (a.date_added && b.date_added) {
            return new Date(b.date_added).getTime() - new Date(a.date_added).getTime();
          }
          return 0;
        });
        setWatchlist(sortedWatchlist);
      } else {
        console.error("Error: 'date_added' field not found in the watchlist data.");
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };


  const removeFromWatchlist = async (symbol: string) => {
    try {
      dispatch(removeFromWatchlistAsync(symbol));
      setWatchlist(watchlist.filter((item) => item.symbol !== symbol));
      toast.error(`${symbol} removed from watchlist.`);
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  };


  const applySymbol = (symbol: string) => {


    if (cryptoSymbols.some(crypto => crypto.Symbol === symbol)) {
      dispatch(setSymbolCrypto(symbol));
      console.log("Applying crypto watchlist symbol:", symbol);
    }
    else {
      dispatch(setSymbol(symbol));
      console.log("Applying watchlist symbol:", symbol);
    }

    if (closeDrawer) {
      closeDrawer();
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>{username}'s Watchlist</h2>


      {watchlist
        .map((item, index) => {
          const stock = stockSymbols.find(
            (stock) => stock.Symbol === item.symbol
          );
          const crypto = cryptoSymbols.find(
            (crypto) => crypto.Symbol === item.symbol
          );
          const name = stock?.Name || crypto?.Name;
          return (
            <h5 key={index}>
              <Link to={cryptoSymbols.some(crypto => crypto.Symbol === item.symbol) ? '/crypto' : '/'}>
                <IconButton onClick={() => applySymbol(item.symbol)} color="info" sx={{ borderRadius: "8px", color: '#55d3e9', '&:hover': {color: 'white', } }}><div style={{ display: "inline", fontWeight: "bold" }}> {item.symbol}</div>&nbsp; ({name})</IconButton>
              </Link>
              <IconButton onClick={() => removeFromWatchlist(item.symbol)}><CloseIcon style={{ fontSize: 30, color: "#ff6767", width: "20px", marginBottom: "-3px" }} /></IconButton>
              <hr />
            </h5>
          );
        })}
    </div>
  );
};

export default Watchlist;
