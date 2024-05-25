import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { passResetAsync } from './loginSlice';
import { RootState } from '../../app/store';
import { useAppDispatch } from '../../app/hooks';
import { Container, Typography, TextField, Button, CircularProgress, Box } from '@mui/material';

const PasswordResetForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const dispatch = useAppDispatch();
  const loading = useSelector((state: RootState) => state.login.isLoading);

  const handlePassReset = () => {
    dispatch(passResetAsync(email));
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ fontSize: '28px' }}>
        Password Reset
        </Typography>
        <Box component="form" noValidate sx={{
          mt: 1,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          "& .MuiAutocomplete-endAdornment .MuiIconButton-root": { color: "white" }, '& .MuiInputBase-input': { fontSize: '14px', color: 'white' }
        }}>
            <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              style: { fontSize: '12px', color: 'white' },
            }}
            sx={{ "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgb(33, 181, 207) " } }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handlePassReset}
            disabled={loading}
            fullWidth
            sx={{ mt: 3, mb: 2, fontSize: '14px' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PasswordResetForm;