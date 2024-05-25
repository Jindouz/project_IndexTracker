import axios from 'axios';
import { baseURL } from '../../features/intraday/IntradayViewerAPI';
import { toast } from 'react-toastify';

export const fetchWatchlist = async (username: string, token: string) => {
  try {
    const response = await axios.get(`${baseURL}/get_watchlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error("Error fetching watchlist: " + error.message);
  }
};

export const removeFromWatchlist = async (symbol: string, token: string) => {
  try {
    await axios.post(
      `${baseURL}/remove_from_watchlist`,
      { symbol },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error: any) {
    throw new Error("Error removing from watchlist: " + error.message);
  }
};

export const addToWatchlist = async (symbol: string, token: string) => {
  try {
    const response = await axios.post(
      `${baseURL}/add_to_watchlist`,
      { symbol },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const responseData = response.data;
    
    if (responseData.message === "Already in watchlist") {
      console.log('Symbol already added to watchlist:', symbol);
      toast.warn(`${symbol} has already been added to your watchlist.`);
    } else {
      console.log('Symbol added to watchlist successfully:', symbol);
      toast.success(`${symbol} has been added to your watchlist.`);
    }
  } catch (error: any) {
    console.error("Error adding to watchlist:", error);
    throw new Error("Error adding to watchlist: " + error.message);
  }
};
