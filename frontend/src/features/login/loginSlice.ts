import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login, passChange, passReset, passResetConfirm, register } from './loginAPI';
import { refreshToken as refresh } from './loginAPI';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { RootState } from '../../app/store';

interface LoginState {
    isLoggedIn: boolean;
    isLoading: boolean;
    pwLoading: boolean;
    pwError: string | null;
    error: string | null;
    regError: string | null;
    isRegistered: boolean;
    username: string;
    userId: string;
    user_email: string;
    admin: boolean;
}

interface DecodedToken {
    username: string;
    user_id: string;
    email: string;
    admin: boolean;
}
const token = localStorage.getItem('token');

const initialState: LoginState = {
    isLoggedIn: !!localStorage.getItem('token'),
    isLoading: false,
    pwLoading: false,
    pwError: null,
    error: null,
    regError: null,
    isRegistered: false,
    username: !!token ? (jwtDecode(token) as DecodedToken).username : '',
    userId: !!token ? (jwtDecode(token) as DecodedToken).user_id : '',
    user_email: !!token ? (jwtDecode(token) as DecodedToken).email : '',
    admin: !!token ? (jwtDecode(token) as DecodedToken).admin : false,
};

export const loginAsync = createAsyncThunk<
  { access: string; refresh: string },
  { credentials: { username: string; password: string }; includeRefreshToken: boolean },
  { rejectValue: string }
>('login', async ({ credentials, includeRefreshToken }, thunkAPI) => {
  try {
    const response = await login(credentials);
    localStorage.setItem('token', response.access);
    if (includeRefreshToken) {
      localStorage.setItem('refreshToken', response.refresh);
    }
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message as string);
  }
});

export const registerAsync = createAsyncThunk<
  unknown,
  { username: string; password: string, email: string },
  { rejectValue: string }
>('login/registerAsync', async (credentials, thunkAPI) => {
  try {
    const response = await register(credentials);
    return response;
  } catch (regError: any) {
    return thunkAPI.rejectWithValue(regError.message as string);
  }
});

export const refreshAccessToken = createAsyncThunk<
  { access: string },
  void,
  { rejectValue: string }
>('login/refreshAccessToken', async (_, thunkAPI) => {
  try {
    const response = await refresh();
    localStorage.setItem('token', response.access);
    console.log('Access Token refreshed successfully!');
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message as string);
  }
});

export const passResetAsync = createAsyncThunk<
  unknown,
  string,
  { rejectValue: string }
>('login/passResetAsync', async (email: string, thunkAPI) => {
  try {
    const response = await passReset(email);
    toast.success(`Password reset email sent!`, { position: 'top-center', autoClose: 3000 });
    return response;
  } catch (error: any) {
    toast.error('An error occurred. Please try again later.');
    return thunkAPI.rejectWithValue(error.message as string);
  }
});

export const passResetConfirmAsync = createAsyncThunk<
  unknown,
  { uid: string; token: string; new_password: string },
  { rejectValue: string }
>('login/passResetConfirmAsync', async ({ uid, token, new_password }, thunkAPI) => {
  try {
    const response = await passResetConfirm(uid, token, new_password);
    toast.success('Password reset successful!');
    return response;
  } catch (error: any) {
    toast.error('An error occurred. Please try again later.');
    return thunkAPI.rejectWithValue(error.message as string);
  }
});

export const changePassword = createAsyncThunk(
  'login/changePassword',
  async (payload: { old_password: string; new_password: string }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      
      const response = await passChange(payload.old_password, payload.new_password, token);
      
      if ('message' in response) {
        toast.success(`Password changed successfully!`, { position: 'top-center', autoClose: 3000 });
        return response;
      } else {
        throw new Error(response.error || 'Failed to change password');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Error changing password');
    }
  }
);

export const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  return { type: 'login/logout' } as const;
};


export const checkTokenExpiration = createAsyncThunk(
    'login/checkTokenExpiration',
    async (_, thunkAPI) => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
  
      if (!token) {
        thunkAPI.dispatch(handleLogout());
        return;
      }
  
      try {
        const decodedToken: { exp: number } = jwtDecode(token);
        const currentTime = Date.now() / 1000;        
  
        if (decodedToken.exp < currentTime) {
          if (!refreshToken) {
            thunkAPI.dispatch(handleLogout());
            toast.error('Session expired. Please login again.');
          } else {
            const decodedRefreshToken: { exp: number } = jwtDecode(refreshToken);
            if (decodedRefreshToken.exp < currentTime) {
              thunkAPI.dispatch(handleLogout());
              toast.error('Session expired. Please login again.');
            } else {
              await thunkAPI.dispatch(refreshAccessToken());
            }
          }
        }
      } catch (error) {
        thunkAPI.dispatch(handleLogout());
      }
    }
  );


  export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(loginAsync.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(loginAsync.fulfilled, (state, action: PayloadAction<{ access: string }>) => {
          state.isLoggedIn = true;
        //   state.logged = true;
          state.isLoading = false;
          state.error = null;
          const decodedToken = jwtDecode(action.payload.access) as { username: string; admin: boolean, email: string };
          state.username = decodedToken.username;
          state.user_email = decodedToken.email;
          console.log(decodedToken);
          
          state.admin = decodedToken.admin;
          toast.success(`Login successful! Welcome ${state.username}!`, { position: 'top-center', autoClose: 5000 });
        })
        .addCase(loginAsync.rejected, (state, action) => {
          state.isLoggedIn = false;
          state.isLoading = false;
          state.error = action.payload!;
          toast.error(action.payload);
        })
        .addCase('login/logout', (state) => {
          state.isLoggedIn = !!localStorage.getItem('token');
          state.admin = !!token ? (jwtDecode(token) as DecodedToken).admin : false
        })
        .addCase(registerAsync.pending, (state) => {
          state.isLoading = true;
          state.regError = null;
        })
        .addCase(registerAsync.fulfilled, (state) => {
          state.isRegistered = true;
          state.isLoading = false;
          state.regError = null;
          toast.success('Registration successful!');
        })
        .addCase(registerAsync.rejected, (state, action) => {
          state.isLoading = false;
          state.regError = action.payload!;
          toast.error(action.payload);
        })
        .addCase(changePassword.pending, (state) => {
          state.pwLoading = true;
          state.pwError = null;
        })
        .addCase(changePassword.fulfilled, (state) => {
          state.pwLoading = false;
          state.pwError = null;
        })
        .addCase(changePassword.rejected, (state, action) => {
          state.pwLoading = false;
          state.pwError = action.payload as string;
        })
    },
  });


  export const selectIsRegistered = (state: RootState) => state.login.isRegistered;
  export const selectIsLoggedIn = (state: RootState) => state.login.isLoggedIn;
  export const selectIsLoading = (state: RootState) => state.login.isLoading;
  export const selectError = (state: RootState) => state.login.error;
  export const selectRegError = (state: RootState) => state.login.regError;
  export const selectUsername = (state: RootState) => state.login.username;
  export const selectUserId = (state: RootState) => state.login.userId;
  export const selectAdmin = (state: RootState) => state.login.admin;
  export const selectEmail = (state: RootState) => state.login.user_email;
  export const selectPwLoading = (state: RootState) => state.login.pwLoading;
  export const selectPwError = (state: RootState) => state.login.pwError;

  
  export default loginSlice.reducer;