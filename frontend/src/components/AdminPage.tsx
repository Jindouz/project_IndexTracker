import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { baseURL } from '../features/intraday/IntradayViewerAPI';

const AdminPage: React.FC = () => {
  const [logsArray, setLogsArray] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const isAdmin = useSelector((state: RootState) => state.login.admin);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('token');

      if (token && isAdmin) {
        try {
          const response = await axios.get(`${baseURL}/logs`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setLogsArray(response.data.logs.split('\n').reverse());
        } catch (error: any) {
          setError(error.response?.data?.error || 'Failed to fetch logs');
        }
      } else {
        setError('You do not have permission to view this page');
      }
    };

    fetchLogs();
  }, [isAdmin]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Admin Logs</h1>
      <div style={{ padding: '30px' }}>
      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', backgroundColor: 'black', color: 'white', textAlign: 'left' }}>
        {logsArray.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </pre>
      </div>
    </div>
  );
};

export default AdminPage;