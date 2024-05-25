import React from 'react'
import GitHubIcon from '@mui/icons-material/GitHub';
import './About.css';

const About = () => {
  return (
    <div className="about-container" style={{ textAlign: 'left' }}>
      <div className='inner-containers'>
        <h1 className='animate__animated animate__flipInX'>About Index Tracker X</h1>
        <p className='welcome'>Welcome to Index Tracker X, your comprehensive platform for tracking daily and weekly stocks data for NASDAQ and cryptocurrencies. Powered by Django on the backend and React with TypeScript and Redux on the frontend, Index Tracker X offers a seamless user experience for investors and enthusiasts alike.</p>
      </div>

      <div className='inner-containers'>
        <h2 className='animate__animated animate__flipInX'>Features</h2>
        <ul>
          <li><strong>Daily and Weekly Stocks Data:</strong> Obtain up-to-date CSV data for NASDAQ and cryptocurrencies based on user-chosen symbols.</li>
          <li><strong>AI Sentiment Analysis:</strong> Our AI feature scans for news and tweets about chosen stocks, displaying whether their online sentiment is positive or negative.</li>
          <li><strong>Watchlist Management:</strong> Personalize your investment strategy by adding symbols to your watchlist, accessible across devices.</li>
          <li><strong>Symbol Autocomplete:</strong> Streamlined symbol selection with autocomplete functionality from an extensive symbols selection list.</li>
          <li><strong>Secure Authentication System:</strong> Utilizing JWT tokens, our login system provides secure access to features such as watchlists, profiles, password reset, and email password recovery.</li>
          <li><strong>CSV Data Download:</strong> Logged-in users can easily download CSV data for their analysis.</li>
          <li><strong>Login Logger:</strong> We keep track on irregular logins with a login logger on the backend, accessible to admin users on the frontend.</li>
          <li><strong>Widgets Integration:</strong> Access tradingview widgets to view stocks news and volume data.</li>
          <li><strong>Mobile Compatibility:</strong> Enjoy a responsive design that ensures seamless usage across mobile devices.</li>
        </ul>
      </div>

      <div className='inner-containers'>
        <h2 className='animate__animated animate__flipInX'>Other Projects</h2>
        <ul>
        <li><strong><a href="https://rct-supermarket.netlify.app" target="_blank" rel="noopener noreferrer"  style={{color:'cyan'}}>Night Market Groceries:</a></strong> Experience convenient grocery shopping with Night Market Groceries, featuring a seamless PayPal checkout process.</li>
        <li><strong><a href="https://nightcity-library.netlify.app" target="_blank" rel="noopener noreferrer"  style={{color:'cyan'}}>Night City Library:</a></strong> Simplifying library management with Night City Library, a project designed for efficient cataloging and organization.</li>
      </ul>
      </div>
      <br />

      <p className='inner-containers'>At Index Tracker X, we're committed to providing innovative solutions for your investment needs. Join us and take control of your financial journey today!</p>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <a href="https://github.com/Jindouz" target="_blank" rel="noopener noreferrer">
          <GitHubIcon sx={{ fontSize: 50, color: 'cyan' }} />
        </a>
      </div>
        <p>© Made by Jindouz (2024)</p>
    </div>
  )
}

export default About