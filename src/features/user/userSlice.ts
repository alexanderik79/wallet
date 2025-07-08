// src/features/user/userSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User, Status, UserState } from '../../types';
import axios from 'axios';
import { ERROR_MESSAGES } from '../../constants/errorMessages';

const initialState: UserState = {
  currentUser: null,
  status: Status.Idle,
  error: null,
};

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId: string) => {
    try {
      // Option 1: Fetch from live API
      // const response = await axios.get<{users: User[]}>(`http://localhost:3000/users?id=${userId}`);
      // const foundUser = response.data.users[0]; // Assuming API returns an array, take first match

      // Option 2: Fetch from static data.json (for Netlify deployment)
      const response = await axios.get<{ users: User[]; categories: any[] }>('/data.json'); // Adjust path if not data.json
      const foundUser = response.data.users.find(user => user.id === userId);

      if (!foundUser) {
        throw new Error(`User with ID ${userId} not found.`);
      }

      return foundUser;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message || ERROR_MESSAGES.USER.FETCH_FAILED_GENERIC);
      }
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
    // Renamed for clarity: This action explicitly SETS the user balance.
    setUserBalance: (state, action: PayloadAction<number>) => {
      if (state.currentUser) {
        state.currentUser.startBalance = action.payload;
        state.status = Status.Succeeded;
        state.error = null;
      } else {
        state.status = Status.Failed;
        state.error = ERROR_MESSAGES.USER.NO_CURRENT_USER_TO_UPDATE_BALANCE;
      }
    },
    // NEW: This action ADJUSTS the user balance by a given amount.
    adjustUserBalance: (state, action: PayloadAction<number>) => {
      const changeAmount = action.payload;
      if (state.currentUser) {
        state.currentUser.startBalance += changeAmount; // Add the change amount
        state.status = Status.Succeeded;
        state.error = null;
      } else {
        state.status = Status.Failed;
        state.error = ERROR_MESSAGES.USER.NO_CURRENT_USER_TO_UPDATE_BALANCE; // Or a more specific error
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
        state.error = action.error.message || ERROR_MESSAGES.USER.FAILED_TO_LOAD;
        state.currentUser = null;
      });
  },
});

export const {
  setUser,
  clearUser,
  updateUserProfile,
  setUserBalance,     // Export the renamed action
  adjustUserBalance,  // Export the new adjustment action
} = userSlice.actions;

export default userSlice.reducer;

export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectUserStatus = (state: { user: UserState }) => state.user.status;
export const selectUserError = (state: { user: UserState }) => state.user.error;