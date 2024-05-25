import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, CircularProgress, TextField, Typography, Container, Box } from '@mui/material';
import { changePassword, selectEmail, selectPwError, selectPwLoading, selectUsername } from './loginSlice';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../app/hooks';
// import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const loading = useSelector(selectPwLoading);
  const error = useSelector(selectPwError);
  const user = useSelector(selectUsername);
  const userEmail = useSelector(selectEmail);
  // const navigate = useNavigate();



  const handlePasswordChange = () => {
    if (newPassword === confirmPassword) {
      dispatch(changePassword({ old_password: currentPassword, new_password: newPassword }))
        .then(() => {
          setCurrentPassword('');
          setNewPassword('');
          // navigate('/');
        })
        .catch((error: any) => {
          toast.error(error.message || 'Failed to change password');
        });
    } else {
      toast.error('Passwords do not match!', { position: 'top-center', autoClose: 3000 });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '25px' }}>{user}'s' Profile</Typography>
        <Typography variant="h5" sx={{ marginBottom: '25px' }}>Registered Email Address: {userEmail}</Typography>
        <Typography variant="h5">Change Password:</Typography>
        <Box component="form" noValidate sx={{
          mt: 1,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          "& .MuiAutocomplete-endAdornment .MuiIconButton-root": { color: "white" }, '& .MuiInputBase-input': { fontSize: '14px', color: 'white' }
        }}>
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              style: { fontSize: '12px', color: 'white' },
            }}
            sx={{ "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgb(33, 181, 207) " } }}
          />
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
            variant="contained"
            color="primary"
            onClick={handlePasswordChange}
            disabled={loading}
            sx={{ mt: 3, mb: 2, fontSize: '14px' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Change Password'}
          </Button>
        </Box>
      </Box>
      {error && <Typography sx={{ mt: 2, color: 'red', fontSize: '14px' }}>{error}</Typography>}
    </Container>
  );
};

export default ProfilePage;
