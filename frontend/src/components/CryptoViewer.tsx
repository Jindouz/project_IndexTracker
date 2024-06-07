import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { TextField, CircularProgress, Autocomplete, Tabs, Tab, Button } from '@mui/material';
import { toast } from 'react-toastify';
import './IntradayViewer.css';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchCryptoSymbolsAsync, fetchSentimentAsync, selectCryptoSymbols, selectSentimentData, selectSymbolCrypto, setSymbolCrypto } from '../features/intraday/IntradayViewerSlice';
import { baseURL } from '../features/intraday/IntradayViewerAPI';
import { format } from 'date-fns';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { addToWatchlistAsync } from '../features/watchlist/watchlistSlice';
import { selectIsLoggedIn } from '../features/login/loginSlice';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    fill: boolean;
    backgroundColor: string;
    borderColor: string;
    tension: number;
  }>;
}

interface StockSymbol {
  Symbol: string;
  Name: string;
}


const CryptoViewer: React.FC = () => {
  const [dailyChartData, setDailyChartData] = useState<ChartData | null>(null);
  const [symbolStatus, setSymbolStatus] = useState(useAppSelector(selectSymbolCrypto) || 'BTC');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChangeColor, setPriceChangeColor] = useState<string>('');
  const [pricePercentage, setpricePercentage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cryptoSymbols = useAppSelector(selectCryptoSymbols);
  const symbol = useAppSelector(selectSymbolCrypto);
  const sentimentData = useAppSelector(selectSentimentData);
  const logged = useAppSelector(selectIsLoggedIn);

  const [sentimentMessage, setSentimentMessage] = useState<string | null>(null);
  const [loadingSentiment, setLoadingSentiment] = useState<boolean>(false);
  const [sentimentColor, setSentimentColor] = useState<string>('');
  const [sentimentExtras, setSentimentExtras] = useState<string>('');

  const [weeklyChartData, setWeeklyChartData] = useState<ChartData | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('weekly');
  const [errorDaily, setErrorDaily] = useState<boolean>(false);
  const [errorWeekly, setErrorWeekly] = useState<boolean>(false);


  useEffect(() => {
    dispatch(fetchCryptoSymbolsAsync());
  }, [dispatch]);

  //useeffect that refreshes the data on the page whenever the symbol changes (mainly from the watchlist)
  useEffect(() => {
    fetchDataWeekly(symbol);
    fetchCurrentPrice();
    setSymbolStatus(symbol);
    // setSymbol(symbol);
    console.log('crypto Symbol changed:', symbol);
  }, [symbol])


  useEffect(() => {
    if (sentimentData) {
      console.log('AI: ' + symbol + ' sentiment data is: ' + sentimentData.message); // Log sentimentData once it's available
      setSentimentMessage(sentimentData.message);
      let color = '';
      if (sentimentData.message === 'Positive') {
        setSentimentExtras('(Favorable Trends)');
        color = '#7fff54';
      } else if (sentimentData.message === 'Negative') {
        setSentimentExtras('(Unfavorable Trends)');
        color = '#ff5754';
      } else if (sentimentData.message === 'Neutral') {
        setSentimentExtras('(Indecisive Trends)');
        color = 'white';
      }
      setSentimentColor(color);
    }
  }, [sentimentData]);

  useEffect(() => {
    setSentimentMessage(null);
  }, [symbolStatus])



  const sentimentAI = async () => {
    try {
      setSentimentMessage(null);
      setLoadingSentiment(true); // Set loading status to true
      await dispatch(fetchSentimentAsync(symbol));
      console.log('AI: Calculating current sentiment data for ' + symbol + '...');

    } catch (error) {
      console.error('Error fetching sentiment data:', error);
      setSentimentMessage(null);
    } finally {
      setLoadingSentiment(false); // Set loading status to false
    }
  };


  const fetchDataDaily = async (symbol: string) => {
    try {
      const response = await axios.post(`${baseURL}/intraday_data`, { symbol });
      const data = response.data;


      if (data && typeof data === 'string') {
        const parsedData = parseCsvData(data);

        const currentPrice = parsedData.closePrices[parsedData.closePrices.length - 1];
        const prevDayClosePrice = parsedData.closePrices[1];

        const priceChange = ((currentPrice - prevDayClosePrice) / prevDayClosePrice) * 100;

        const newChartData: ChartData = {
          labels: parsedData.timestamps,
          datasets: [
            {
              label: 'Daily Stock Price',
              data: parsedData.closePrices,
              fill: true,
              backgroundColor: 'rgba(94, 55, 255, 0.1)',
              borderColor: '#5e3aff',
              tension: 0.1,
            },
          ],
        };

        setDailyChartData(newChartData);
        setpricePercentage(priceChange.toFixed(2));

        // toast.success(`Showing data for ${symbol}`);
      } else {
        console.error('Error fetching data: Unexpected data format');
        // toast.error('Error fetching data');
        setErrorDaily(true);
      }
      setErrorDaily(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // toast.error('Error fetching data');
      setErrorDaily(true);
    }
  };



  const fetchDataWeekly = async (symbol: string) => {
    try {
      const response = await axios.post(`${baseURL}/intraday_data_weekly`, { symbol });
      const data = response.data;

      // dispatch(await fetchDataAsync(symbol));
      // const data = dailyData;

      if (data && typeof data === 'string') {
        const parsedData = parseCsvData(data);

        const newChartData: ChartData = {
          labels: parsedData.timestamps,
          datasets: [
            {
              label: 'Weekly Stock Price',
              data: parsedData.closePrices,
              fill: true,
              backgroundColor: 'rgba(94, 55, 255, 0.1)',
              borderColor: '#5e3aff',
              tension: 0.1,
            },
          ],
        };

        setWeeklyChartData(newChartData);
        // toast.success(`Showing data for ${symbol}`);
      } else {
        console.error('Error fetching data: Unexpected data format');
        // toast.error('Error fetching data');
        setErrorWeekly(true);
      }
      setErrorWeekly(false);
    } catch (error) {
      // console.error('Error fetching data:', error);
      // toast.error('Error fetching data');
      setTimeout(async () => {
        await fetchDataWeekly(symbol); // Retry fetching data
      }, 3000);
      setErrorWeekly(true);
    }
  };

  const fetchCurrentPrice = async () => {
    try {
      const response = await axios.post(`${baseURL}/current_price`, { symbol });
      const data = response.data;

      if (data && data.current_price) {
        const currentPrice = data.current_price;

        setCurrentPrice(prevCurrentPrice => {
          // Compare current price with previous price
          if (prevCurrentPrice !== null) {
            if (currentPrice > prevCurrentPrice) {
              // Set background color to green when price increases
              // setPriceChangeColor('#98fca4');
              setPriceChangeColor('#7fff54');
              setTimeout(() => {
                setPriceChangeColor('');
              }, 1000); // Remove background color after 1 second
            } else if (currentPrice < prevCurrentPrice) {
              // Set background color to red when price decreases
              // setPriceChangeColor('#fec1c1');
              setPriceChangeColor('#ff5754');
              setTimeout(() => {
                setPriceChangeColor('');
              }, 1000); // Remove background color after 1 second
            }
          }

          console.log(`Current price: ${currentPrice} | Previous price: ${prevCurrentPrice}`);
          return currentPrice; // Return currentPrice to update the state
        });

      } else {
        console.error('Error fetching current price: Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching current price:', error);
    }
  };

  const parseCsvData = (csvData: string) => {
    const rows = csvData.split('\n');
    const timestamps: string[] = [];
    const closePrices: number[] = [];

    rows.forEach((row, index) => {
      if (index !== 0) {
        const columns = row.split(',');
        if (columns.length >= 6) {
          const timestamp = new Date(columns[0]);
          // Format the timestamp using date-fns
          const formattedTimestamp = `${format(timestamp, 'dd/MM/yyyy, ')}${format(timestamp, 'hh:mm a ')}`;
          timestamps.push(formattedTimestamp);
          closePrices.push(parseFloat(columns[4]));
        }
      }
    });

    return { timestamps, closePrices };
  };

  //useeffect for data fetching when the component mounts
  useEffect(() => {
    fetchDataWeekly(symbol);
    fetchDataDaily(symbol);

    fetchCurrentPrice();
    setSymbolStatus(symbol);

    dispatch(setSymbolCrypto(symbol));
    
    setLoading(true);
  }, []);

  //useeffect to update fetchcurrentprice every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchCurrentPrice();
    }, 4500);
    return () => clearInterval(interval);
  }, [symbol]);

  // useeffect to make sure price percentage is updated with daily data
  useEffect(() => {
    if (activeTab === 'weekly') {
      fetchDataDaily(symbol);
    }
  }, [pricePercentage, symbol, currentPrice]);


  // chart options
  const options = {
    scales: {
      x: {
        type: 'category',
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          maxRotation: 0,
          color: 'grey',
        },
        grid: {
          color: 'rgba(33, 181, 207, 0.1)',
        },
        title: {
          color: 'white',
        },
      },
      y: {
        position: 'right',
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(33, 181, 207, 0.1)',
        },
        title: {
          color: 'white',
        },
      },
    },
    plugins: {
      tooltip: {
        intersect: false,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              return `${label}: $${context.parsed.y.toFixed(2)}`;
            }
            return '';
          },
        },
      },
    },
    elements: {
      line: {
        borderColor: '#21b5cf',
        tension: 0.1,
      },
      plugins: {
        filler: {
          propagate: true
        }
      },
      point: {
        radius: 0,
        hoverRadius: 14,
      },
    },
  } as any;


  const handleAutocompleteChange = async (event: any, newValue: StockSymbol | null) => {
    if (newValue && typeof newValue === 'object' && 'Symbol' in newValue) {
      dispatch(setSymbolCrypto(newValue.Symbol));
      if (activeTab === 'weekly') {
        await fetchDataWeekly(newValue.Symbol);
      } else {
        setTimeout(() => {
          fetchDataDaily(newValue.Symbol);
        }, 2000);    
      }
      setLoading(false); // Set loading state to false after 5 seconds
      await fetchCurrentPrice();
      setSymbolStatus(newValue.Symbol);
      setTimeout(() => {
        setLoading(true);
      }, 3500);
    } else {
      dispatch(setSymbolCrypto(''));
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'daily' | 'weekly') => {
    setActiveTab(newValue);
    if (newValue === 'weekly') {
      fetchDataWeekly(symbol);
    } else {
      fetchDataDaily(symbol);
    }
  };

  const addToWatchlist = () => {
    if (logged && symbol) {
        dispatch(addToWatchlistAsync(symbol));
    }
    else {
      toast.error('Please login first before using the watchlist', { position: 'top-center', autoClose: 5000 });
      navigate('/login');
    }
  };



  const finalChartData = activeTab === 'weekly' ? weeklyChartData : dailyChartData;
  const formattedPrice = currentPrice ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';




  return (
    <div
      className="bg-img">
      <h1 style={{ fontWeight: 'bold', textAlign: 'center' }} className="animate__animated animate__flipInX">Crypto Index Tracker</h1>
      <br />

      <Autocomplete
        disablePortal
        id="stock-symbol-autocomplete"
        options={cryptoSymbols}
        ListboxProps={{
          style: { fontSize: '14px' } // Style to adjust font size of dropdown options
        }}
        sx={{ width: 320,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgb(33, 181, 207)" },
          "& .MuiAutocomplete-endAdornment .MuiIconButton-root": { color: "white" }, 
          justifyContent: 'center', margin: 'auto', paddingBottom: '30px', '& .MuiInputBase-input': { fontSize: '14px',color: 'white' } }}
        getOptionLabel={(option) => `${option.Symbol} (${option.Name})`}
        renderInput={(params) => 
        <TextField 
        {...params} 
        label="Crypto Symbol Search"
        InputLabelProps={{
          style: { color: 'white' },
        }}
         />}
        onChange={(event, newValue) => {
          if (newValue !== null) {
            handleAutocompleteChange(event, newValue);
          }
        }}
        filterOptions={(options, params) => {
          if (params.inputValue.length === 0) {
            return [];
          }
          const inputValue = params.inputValue.toLowerCase();
          return options
            .filter(option => //The options are filtered based on both the symbol and the name matching the input value
              option.Symbol.toLowerCase().includes(inputValue) ||
              option.Name.toLowerCase().includes(inputValue)
            )
            .sort((a, b) => { //The filtered options are then sorted based on whether the symbol matches the input value, with symbol matches appearing first
              const aIsSymbolMatch = a.Symbol.toLowerCase().startsWith(inputValue);
              const bIsSymbolMatch = b.Symbol.toLowerCase().startsWith(inputValue);
              if (aIsSymbolMatch && !bIsSymbolMatch) {
                return -1;
              } else if (!aIsSymbolMatch && bIsSymbolMatch) {
                return 1;
              } else {
                return 0;
              }
            });
        }}
        isOptionEqualToValue={(option, value) => option.Symbol === value.Symbol}
        noOptionsText={<span style={{ fontSize: '16px' }}>Enter a Crypto Symbol</span>} // Message to display when no options are available
      />
      <p>Want to know the current online sentiment of the stock? Click the button below</p>
      <Button variant="contained" sx={{ fontSize: '14px', textTransform: 'none', backgroundColor: '#5e3aff','&:hover': { backgroundColor: '#3e1fc9' } }} onClick={sentimentAI} endIcon={<AutoAwesomeIcon />}>AI Sentiment Tool</Button>
      {/* Conditionally render loading spinner */}
      <br /><br />
      <div style={{ marginBottom: '10px' }}>
        {loadingSentiment && <><CircularProgress />
          <p>Scanning for News and Tweets about <span style={{ fontWeight: 'bold' }}>{symbolStatus}</span>... (This might take a minute)</p></>}
      </div>
      {/* Conditionally render sentiment message */}
      {sentimentMessage && (
        <div style={{ border: '1px solid white', borderRadius: '10px', margin: '0 auto', width: '90%', backgroundColor: '#0a1730' }}>
          <h4 className='animate__animated animate__fadeInDown'>The Current Sentiment Analysis for <span style={{ fontWeight: 'bold' }}>{symbolStatus}</span> is:</h4>
          <h4 style={{ color: sentimentColor, fontWeight: 'bold' }} className='animate__animated animate__fadeInUp'>{sentimentMessage} {sentimentExtras}</h4>
          <br />
          <p style={{ color: 'grey' }}>*This sentiment analysis tool is based on an AI model that analyzes recent news sources and tweets associated with the selected stock.</p>
        </div>
      )}
      <br />

      {currentPrice === null || !loading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <CircularProgress />
          <p>Loading...</p>
        </div>
      ) : (
        <h3 style={{ margin: '0 auto', marginBottom: '10px', width: '90%' }} className='animate__animated animate__fadeInUp'>
          Current Price for {symbolStatus} ({cryptoSymbols.find(stock => stock.Symbol === symbolStatus)?.Name}): <span style={{ color: priceChangeColor, fontWeight: 'bold' }}>${formattedPrice}</span>
          {dailyChartData && pricePercentage && <><div style={{ display: 'inline-block', marginLeft: '5px' }}>{parseFloat(pricePercentage) < 0 ? <ArrowDropDownIcon sx={{ fontSize: '30px', color: '#ff5754', marginBottom: '-5px' }} /> : <ArrowDropUpIcon sx={{ fontSize: '30px', color: '#7fff54', marginBottom: '-5px' }} />}</div><span style={{ color: parseFloat(pricePercentage) < 0 ? '#ff5754' : '#7fff54', fontWeight: 'bold', marginBottom: '-10px', fontSize: '20px', marginLeft: '-5px' }}>{pricePercentage}%</span></>}
        </h3>
      )}

      {symbolStatus === null || loading ?
      <Button variant="contained" sx={{ marginBottom: '15px',marginTop: '15px', fontSize: '14px', textTransform: 'none', backgroundColor: '#5e3aff','&:hover': { backgroundColor: '#3e1fc9' } }} onClick={addToWatchlist} endIcon={<AddCircleOutlineIcon />}>Add to Watchlist</Button>:
      <Button variant="contained" sx={{ marginBottom: '15px',marginTop: '15px', fontSize: '14px', textTransform: 'none', backgroundColor: '#5e3aff' }} disabled endIcon={<AddCircleOutlineIcon />}>Add to Watchlist</Button>}


      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Daily" value="daily" sx={{ color: 'white', fontSize: '11px', fontWeight: 'bold', border: '1px solid white', borderTopLeftRadius: '15px' }} />
        <Tab label="Weekly" value="weekly" sx={{ color: 'white', fontSize: '11px', fontWeight: 'bold', border: '1px solid white', borderTopRightRadius: '15px' }} />
      </Tabs>
      {finalChartData !== null ? (
          <div style={{ margin: '0 auto', width: '92%', border: '2px solid white', borderRadius: '10px', padding: '5px' }}>
          <Line data={finalChartData} options={options} />
        </div>
      ) : (
        <>
          {activeTab === 'daily' && errorDaily && (
            <p style={{ marginTop: '30px' }}>No 24-hour data available for {symbol}</p>
          )}
          {activeTab === 'weekly' && errorWeekly && (
            // <p style={{ marginTop: '30px' }}>No weekly data available for {symbol}</p>
            <CircularProgress sx={{ marginTop: '30px' }} />
          )}
          {(activeTab !== 'daily' && activeTab !== 'weekly') && (
            <CircularProgress sx={{ marginTop: '30px' }} />
          )}
        </>
      )}
      <br />
    </div>
  );
};

export default CryptoViewer;
