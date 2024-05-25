import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { TextField, Autocomplete, Button } from '@mui/material';
import { toast } from 'react-toastify';
import './IntradayViewer.css';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchStockSymbolsAsync, selectStockSymbols, selectSymbol, setSymbol } from '../features/intraday/IntradayViewerSlice';
import { baseURL } from '../features/intraday/IntradayViewerAPI';
import { format } from 'date-fns';
import { selectIsLoggedIn } from '../features/login/loginSlice';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    tension: number;
  }>;
}

interface StockSymbol {
  Symbol: string;
  Name: string;
}


const IntradayDownload: React.FC = () => {
  const [dailyChartData, setDailyChartData] = useState<ChartData | null>(null);
  const dispatch = useAppDispatch();
  const stockSymbols = useAppSelector(selectStockSymbols);
  const symbol = useAppSelector(selectSymbol);
  const [weeklyChartData, setWeeklyChartData] = useState<ChartData | null>(null);
  const [symbolFlag, setsymbolFlag] = useState<boolean>(false);
  const logged = useAppSelector(selectIsLoggedIn);
  const navigate = useNavigate();
 
  useEffect(() => {
    dispatch(fetchStockSymbolsAsync());
  }, [dispatch]);



  const generateCSVData = (chartData: ChartData): string => {
    // Convert chartData to CSV format
    let csvContent = 'Timestamp,Close Price\n'; // CSV header
    chartData.labels.forEach((label, index) => {
      csvContent += `${label},${chartData.datasets[0].data[index]}\n`; // Add data rows
    });
    return csvContent;
  };

  // Function to download CSV file
  const downloadCSV = (csvData: string, filename: string) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, filename);
  };

  // Handler for downloading daily intraday data as CSV
  const handleDownloadDaily = () => {
    if (dailyChartData) {
      const csvData = generateCSVData(dailyChartData);
      downloadCSV(csvData, `daily_${symbol}_data.csv`);
    } else {
      toast.error('No daily intraday data available to download');
    }
  };

  // Handler for downloading weekly intraday data as CSV
  const handleDownloadWeekly = () => {
    if (logged){
    if (weeklyChartData) {
      const csvData = generateCSVData(weeklyChartData);
      downloadCSV(csvData, `weekly_${symbol}_data.csv`);
    } else {
      toast.error('No weekly intraday data available to download');
    }
  }
  else{
    toast.error('Login is required before downloading', { position: 'top-center', autoClose: 5000 });
    navigate('/login');
  }
  };



  const fetchDataDaily = async (symbol: string) => {
    try {
      const response = await axios.post(`${baseURL}/intraday_data`, { symbol });
      const data = response.data;

      if (data && typeof data === 'string') {
        const parsedData = parseCsvData(data);
        // const priceStatic = parsedData.closePrices[parsedData.closePrices.length - 1];

        const newChartData: ChartData = {
          labels: parsedData.timestamps,
          datasets: [
            {
              label: 'Daily Stock Price',
              data: parsedData.closePrices,
              fill: false,
              borderColor: '#21b5cf',
              tension: 0.1,
            },
          ],
        };

        setDailyChartData(newChartData);

        // toast.success(`Showing data for ${symbol}`);
      } else {
        console.error('Error fetching data: Unexpected data format');
        // toast.error('Error fetching data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // toast.error('Error fetching data');
    }
  };

  const fetchDataWeekly = async (symbol: string) => {
    try {
      const response = await axios.post(`${baseURL}/intraday_data_weekly`, { symbol });
      const data = response.data;

      if (data && typeof data === 'string') {
        const parsedData = parseCsvData(data);
        // const priceStatic = parsedData.closePrices[parsedData.closePrices.length - 1];

        const newChartData: ChartData = {
          labels: parsedData.timestamps,
          datasets: [
            {
              label: 'Weekly Stock Price',
              data: parsedData.closePrices,
              fill: false,
              borderColor: '#21b5cf',
              tension: 0.1,
            },
          ],
        };
        setWeeklyChartData(newChartData);

        // toast.success(`Showing data for ${symbol}`);
      } else {
        console.error('Error fetching data: Unexpected data format');
        // toast.error('Error fetching data');
      }
    } catch (error) {
      // console.error('Error fetching data:', error);
      // toast.error('Error fetching data');
      setTimeout(async () => {
        await fetchDataWeekly(symbol); // Retry fetching data
      }, 2000);
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


  useEffect(() => {
    fetchDataWeekly('TSLA');
    fetchDataDaily('TSLA');
    setsymbolFlag(false);

    dispatch(setSymbol('TSLA'));
  }, []);

  const handleAutocompleteChange = async (event: any, newValue: StockSymbol | null) => {
    if (newValue && typeof newValue === 'object' && 'Symbol' in newValue) {
      dispatch(setSymbol(newValue.Symbol));
      await fetchDataWeekly(newValue.Symbol);
      await fetchDataDaily(newValue.Symbol);

      setsymbolFlag(true);
    } else {
      dispatch(setSymbol(''));
      setsymbolFlag(false);
    }
  };

  return (
    <div
      className="bg-img">
      <h1 style={{ fontWeight: 'bold', textAlign: 'center' }} className="animate__animated animate__flipInX">Intraday CSV Data Download</h1>
      <br />
      <br />
      <p>First select a stock from the dropdown below:</p>
      <br />

      <Autocomplete
        disablePortal
        id="stock-symbol-autocomplete"
        options={stockSymbols}
        ListboxProps={{
          style: { fontSize: '14px' } // Style to adjust font size of dropdown options
        }}
        sx={{ 
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgb(33, 181, 207) " },
        "& .MuiAutocomplete-endAdornment .MuiIconButton-root": { color: "white" },
        width: 320, justifyContent: 'center', margin: 'auto', paddingBottom: '30px', '& .MuiInputBase-input': { fontSize: '14px', color: 'white' } }}
        getOptionLabel={(option) => `${option.Symbol} (${option.Name})`}
        renderInput={(params) => <TextField {...params} 
        label="NASDAQ Symbol Selection"
        InputLabelProps={{
          style: { color: 'white' },
        }} />}
        onChange={handleAutocompleteChange}
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
        noOptionsText={<span style={{ fontSize: '16px' }}>Enter a Stock Symbol</span>} // Message to display when no options are available
      />


      {symbolFlag !== false ? (
        <div style={{ margin: '0 auto', width: '90%' }}>
          <div>
            <p>Choose a time period to download:</p>
            <Button variant="contained" onClick={handleDownloadDaily} style={{ marginRight: '10px', fontSize: '12px', fontWeight: 'bold' }}>Download Daily Data</Button>
            <Button variant="contained" onClick={handleDownloadWeekly}style={{ marginLeft: '10px', fontSize: '12px', fontWeight: 'bold'  }}>Download Weekly Data</Button>
          </div>

        </div>
      ) : (
        <>
            
        </>
      )}
      <br />
    </div>
  );
};

export default IntradayDownload;
