import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { passResetConfirmAsync } from './loginSlice';
import { useAppDispatch } from '../../app/hooks';
import { Container, Typography, TextField, Button, CircularProgress, Box } from '@mui/material';

interface Params {
  [key: string]: string | undefined;
  uid: string;
  token: string;
}

const PassResetConfirm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { uid, token } = useParams<Params>();

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!uid || !token) {
      setError('Invalid UID or token');
      return;
    }

    setLoading(true);
    try {
      // Dispatch the passResetConfirmAsync action with uid, token, and new password
      await dispatch(passResetConfirmAsync({ uid, token, new_password: newPassword }));
      navigate('/login');
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5">Reset Password</Typography>
      <Box component="form" noValidate sx={{
          mt: 1,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          "& .MuiAutocomplete-endAdornment .MuiIconButton-root": { color: "white" }, '& .MuiInputBase-input': { fontSize: '14px', color: 'white' }
        }}>
      
      <TextField
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        fullWidth
        margin="normal"
      InputLabelProps={{
              style: { fontSize: '12px', color: 'white' },
            }}
            sx={{ "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgb(33, 181, 207) " } }}
          />
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        margin="normal"
      InputLabelProps={{
              style: { fontSize: '12px', color: 'white' },
            }}
            sx={{ "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgb(33, 181, 207) " } }}
          />
      {error && <Typography color="error">{error}</Typography>}
      <Button
        variant="contained"
        color="primary"
        onClick={handlePasswordReset}
        disabled={loading}
        fullWidth
        sx={{ mt: 3, mb: 2, fontSize: '14px' }}
      >
        {loading ? <CircularProgress size={24} /> : 'Reset Password'}
      </Button>
      </Box>
    </Container>
  );
};

export default PassResetConfirm;