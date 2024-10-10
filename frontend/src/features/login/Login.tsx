import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectError, selectIsLoading, selectIsLoggedIn, loginAsync } from './loginSlice';
import { useAppDispatch } from '../../app/hooks';
import { Box, Button, Checkbox, CircularProgress, Container, FormControlLabel, Grid, TextField, Typography } from '@mui/material';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectIsLoading);
  const [includeRefreshToken, setIncludeRefreshToken] = useState<boolean>(false);
  const error = useSelector(selectError);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    dispatch(loginAsync({ credentials: { username, password }, includeRefreshToken }));
  };

  // Redirect to home page if user is successfully logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ fontSize: '28px' }}>
          Login
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          "& .MuiAutocomplete-endAdornment .MuiIconButton-root": { color: "white" }, '& .MuiInputBase-input': { fontSize: '14px', color: 'white' }
         }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputLabelProps={{
              style: { fontSize: '12px', color: 'white' },
            }}
            sx={{ "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgb(33, 181, 207) " } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              style: { fontSize: '12px', color: 'white' }, 
            }}
            sx={{ "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgb(33, 181, 207) " } }}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" sx={{ color: 'white'  }} checked={includeRefreshToken} onChange={() => setIncludeRefreshToken(!includeRefreshToken)} />}
            label={<Typography sx={{ fontSize: '14px' }}>Remember me</Typography>}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            onClick={handleLogin}
            sx={{ mt: 3, mb: 2, fontSize: '14px' }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/reset">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {error && <Typography sx={{ mt: 2, color: 'red', fontSize: '14px' }}>{error}</Typography>}
      {isLoggedIn && <Typography sx={{ mt: 2, color: 'green', fontSize: '14px' }}>Login successful!</Typography>}
    </Container>
  );
};

export default Login;
