import * as React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import IconButton from '@mui/material/IconButton';
import Watchlist from './Watchlist';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';



export default function WatchlistDrawer() {
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer =
    (anchor: 'right', open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, right: open });
    };

  const closeDrawer = () => {
    setState({ ...state, right: false });
  };


  return (
    <div>
      <React.Fragment>
        <IconButton className='nav-links' onClick={toggleDrawer('right', true)} color="inherit" sx={{ borderRadius: "8px", color: 'white', '&:hover': {color: '#55d3e9' },marginBottom: '-2px' }}>
          <VisibilityIcon sx={{ fontSize: 20, marginRight: '3px' }}/> Watchlist
        </IconButton>
        <SwipeableDrawer
          anchor={'right'}
          open={state['right']}
          onClose={toggleDrawer('right', false)}
          onOpen={toggleDrawer('right', true)}
          PaperProps={{sx: {backgroundColor: "#1e222d"}}}
        >
          <div className='watchlist-dark-mode' style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '15px' }}>
          {/* <div className='watchlist-dark-mode'> */}
            <Watchlist closeDrawer={closeDrawer} />
            <div style={{ marginTop: 'auto' }}>
              <IconButton onClick={toggleDrawer('right', false)} color="inherit" sx={{ borderRadius: "8px" }}>
              <ArrowForwardIosIcon sx={{ fontSize: 40, marginBottom: '-5px', color: '#21b5cf' }}/>
              </IconButton>
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
