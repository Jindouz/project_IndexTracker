import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { selectIsLoading, selectIsRegistered, registerAsync, selectRegError } from './loginSlice';
import { useAppDispatch } from '../../app/hooks';
import { Button, CircularProgress, Container, TextField, Typography } from '@mui/material';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const isRegistered = useSelector(selectIsRegistered);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectRegError);
  const dispatch = useAppDispatch();

  const handleRegister = async () => {
    if (password === confirmPassword) {
      dispatch(registerAsync({ username, password, email }));
    } else {
      toast.error('Passwords do not match!', { position: 'top-center', autoClose: 3000 });
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4, "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
    "& .MuiAutocomplete-endAdornment .MuiIconButton-root": { color: "white" }, '& .MuiInputBase-input': { fontSize: '14px', color: 'white' }
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ fontSize: '28px' }}>
          Register
        </Typography>
        <form>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputLabelProps={{
              style: { fontSize: '12px', fontWeight: 'bold', color: 'white' }, 
            }}
            sx={{ "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgb(33, 181, 207) " } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              style: { fontSize: '12px', fontWeight: 'bold', color: 'white' }, 
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              style: { fontSize: '12px', fontWeight: 'bold', color: 'white' }, 
            }}
            sx={{ "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgb(33, 181, 207) " } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputLabelProps={{
              style: { fontSize: '12px', fontWeight: 'bold', color: 'white' }, 
            }}
            sx={{ "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgb(33, 181, 207) " } }}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            onClick={handleRegister}
            sx={{ mt: 3, mb: 2, fontSize: '14px' }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
          {!isRegistered && (
            <Typography variant="body2" sx={{ mt: 3, fontSize: '14px' }}>
              Already have an account? <Link to="/login">Login here</Link>
            </Typography>
          )}
        </form>
        {error && (
          <Typography variant="body2" sx={{ color: 'red', mt: 2, fontSize: '14px' }}>
            {error}
          </Typography>
        )}
        {isRegistered && (
          <Typography variant="body2" sx={{ color: 'green', mt: 2, fontSize: '14px' }}>
            Registration successful!
          </Typography>
        )}
      </div>
    </Container>
  );
};

export default Register;
