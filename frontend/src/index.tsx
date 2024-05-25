import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';
import Toastify from './components/Toastify';
import IntradayViewer from './components/IntradayViewer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CryptoViewer from './components/CryptoViewer';
import IntradayDownload from './components/intradayDownload';
import About from './components/About';
import Login from './features/login/Login';
import Register from './features/login/Register';
import Watchlist from './components/Watchlist';
import ProfilePage from './features/login/Profile';
import PasswordResetForm from './features/login/PasswordResetForm';
import PassResetConfirm from './features/login/PassResetConfirm';
import AdminPage from './components/AdminPage';


const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Toastify />
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<IntradayViewer />} />
            <Route path="/crypto" element={<CryptoViewer />} />
            <Route path="/csvdata" element={<IntradayDownload />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/logout" element={<Login />} /> */}
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/reset" element={<PasswordResetForm />} />
            <Route path='/resetconfirm/:uid/:token' element={<PassResetConfirm />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          <Route path="*" element={<h1 style={{ textAlign: 'center' }}>Error: Page not found</h1>}></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
