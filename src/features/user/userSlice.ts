// src/features/user/userSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User, Status, UserState } from '../../types';
import axios from 'axios';
// NEW: Импортируем ERROR_MESSAGES
import { ERROR_MESSAGES } from '../../constants/errorMessages'; 

const initialState: UserState = {
  currentUser: null,
  status: Status.Idle,
  error: null,
};

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId: string = "user-uuid-12345") => {
    try {
      const response = await axios.get<User>(`http://localhost:3000/users/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // UPDATED: Используем ERROR_MESSAGES
        throw new Error(error.response?.data?.message || error.message || ERROR_MESSAGES.USER.FETCH_FAILED_GENERIC);
      }
      // UPDATED: Используем ERROR_MESSAGES
      throw new Error(ERROR_MESSAGES.USER.UNKNOWN_FETCH_ERROR);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.status = Status.Succeeded;
      state.error = null;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.status = Status.Idle;
      state.error = null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<Omit<User, 'id' | 'startBalance'>>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        state.status = Status.Succeeded;
        state.error = null;
      }
    },
    updateUserBalance: (state, action: PayloadAction<number>) => {
      if (state.currentUser) {
        state.currentUser.startBalance = action.payload;
        state.status = Status.Succeeded;
        state.error = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = Status.Loading;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = Status.Succeeded;
        state.currentUser = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = Status.Failed;
        // UPDATED: Используем ERROR_MESSAGES
        state.error = action.error.message || ERROR_MESSAGES.USER.FAILED_TO_LOAD;
        state.currentUser = null;
      });
  },
});

export const {
  setUser,
  clearUser,
  updateUserProfile,
  updateUserBalance,
} = userSlice.actions;

export default userSlice.reducer;

export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectUserStatus = (state: { user: UserState }) => state.user.status;
export const selectUserError = (state: { user: UserState }) => state.user.error;