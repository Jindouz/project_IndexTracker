import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { checkTokenExpiration, handleLogout, selectAdmin, selectIsLoggedIn, selectUsername } from '../features/login/loginSlice';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../app/hooks';
import { IconButton } from '@mui/material';
import './Nav.css';
import TradingViewTickerTape from './TradingViewTickerTape';
import { checkTokenExpiration, handleLogout, selectAdmin, selectIsLoggedIn, selectUsername } from '../features/login/loginSlice';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import WatchlistDrawer from './WatchlistDrawer';

const Nav: React.FC = () => {
    const logged = useSelector(selectIsLoggedIn);
    const username = useSelector(selectUsername);
    const admin = useSelector(selectAdmin);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();



    const handleLogoutClick = async () => {
        await dispatch(handleLogout());
        navigate('/');
        toast.success('Logged out successfully!', { position: 'top-center', autoClose: 5000 });
    }

    useEffect(() => {
        dispatch(checkTokenExpiration());
        const intervalId = setInterval(() => {
            dispatch(checkTokenExpiration());
        }, 60000); // Check every 60 seconds
        return () => clearInterval(intervalId);
    }, [dispatch]);



    return (
        <div className="dark-mode">
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        {/* <Link to='/' className="navbar-brand"><img src="logo512.png" alt="Logo" style={{ width: "45px", marginTop: "-12px" }} /></Link> */}
                        <div className="navbar-center">
                            <Link to='/'><div className="navbar-nav navbar-brand mx-auto">
                                <img src="logo512.png" alt="Logo" style={{ width: "45px", marginTop: "10px" }} />
                                <h2 style={{ color: 'white', fontWeight: 'bold', marginBottom: '10px', marginLeft: '10px' }}>Index Tracker X</h2></div></Link>
                        </div>
                    </div>
                    <div className="collapse navbar-collapse" id="myNavbar">
                        <ul className="nav navbar-nav">
                            <li><Link to='/'> <IconButton className='nav-links' sx={{marginRight: '-25px', color: 'white', '&:hover': {color: '#55d3e9', } }}>NASDAQ Stocks</IconButton></Link></li>
                            <li><Link to='/crypto'> <IconButton className='nav-links' sx={{marginRight: '-25px',color: 'white', '&:hover': {color: '#55d3e9', } }}>Crypto</IconButton></Link></li>
                            <li><Link to='/csvdata'> <IconButton className='nav-links' sx={{marginRight: '-25px',color: 'white', '&:hover': {color: '#55d3e9', } }}>CSV Data Download</IconButton></Link></li>
                            <li><Link to='/about'> <IconButton className='nav-links' sx={{marginRight: '-25px',color: 'white', '&:hover': {color: '#55d3e9', } }}>About</IconButton></Link></li>
                        </ul>
                        <div className="navbar-center">
                            <ul className="nav navbar-nav navbar-right">
                                {logged && admin && <li><Link to='/admin'><IconButton className='nav-links' sx={{ color: 'white', '&:hover': {color: '#55d3e9', },marginBottom: '2px' }}>Admin Page </IconButton></Link></li>}
                                {logged && <li><WatchlistDrawer /></li>}
                                {/* <li><Link to="/register"><div className='nav-links'><span className="glyphicon glyphicon-log-in"></span> Register</div></Link></li> */}
                                {!logged && <li><Link to="/register"><IconButton className='nav-links' sx={{ color: 'white', '&:hover': {color: '#55d3e9', } }}> Register</IconButton></Link></li>}
                                {logged && <li><Link to="/profile"><IconButton className='nav-links' sx={{ color: 'white', '&:hover': {color: '#55d3e9', } }}><span className="glyphicon glyphicon-user" style={{ marginRight: '5px' }}/> {username} {admin ? '(Admin User)' : ''}</IconButton></Link></li>}
                                {!logged ? <li><div><Link to="/login"><IconButton className='nav-links' sx={{ borderRadius: "8px", color: 'white', '&:hover': {color: '#55d3e9', } }}><LoginIcon sx={{ fontSize: 20, marginBottom: '-1px', marginRight: '5px' }}/> Login</IconButton></Link></div></li> : <li><IconButton className='nav-links' onClick={() => handleLogoutClick()} sx={{ borderRadius: "8px", color: 'white', '&:hover': {color: '#55d3e9', } }}><LogoutIcon sx={{ fontSize: 20, marginBottom: '-1px', marginRight: '1px' }}/>Logout</IconButton></li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <TradingViewTickerTape />
        </div>
    );
}

export default Nav;
