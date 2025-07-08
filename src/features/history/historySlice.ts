// src/features/history/historySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { HistoryItem, TransactionType, Status, HistoryState } from '../../types';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
// Import RootState if you plan to use getState in a thunk for balance updates
// import { RootState } from '../../app/store'; // If needed for thunks, but direct dispatch in component is also fine for now

const initialState: HistoryState = {
  transactions: [],
  status: Status.Idle,
  error: null,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Omit<HistoryItem, 'id' | 'date'>>) => {
      const newTransaction: HistoryItem = {
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0], // Ensure date is 'YYYY-MM-DD'
        ...action.payload,
      };
      state.transactions.unshift(newTransaction); // Add to the beginning for most recent first
      state.status = Status.Succeeded;
      state.error = null;
    },
    updateTransaction: (state, action: PayloadAction<Partial<HistoryItem> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      const existingTransaction = state.transactions.find(transaction => transaction.id === id);
      if (existingTransaction) {
        // Apply updates, ensuring date is not accidentally reset if not provided
        Object.assign(existingTransaction, updates);
        state.status = Status.Succeeded;
        state.error = null;
      } else {
        state.status = Status.Failed;
        state.error = ERROR_MESSAGES.HISTORY.TRANSACTION_NOT_FOUND_FOR_UPDATE(id);
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      // Note: Actual balance and category updates need to be handled in the component
      // or by a thunk that dispatches to userSlice and categorySlice.
      state.transactions = state.transactions.filter(transaction => transaction.id !== action.payload);
      state.status = Status.Succeeded;
      state.error = null;
    },
    historyLoading: (state) => {
      state.status = Status.Loading;
      state.error = null;
    },
    historyFailed: (state, action: PayloadAction<string>) => {
      state.status = Status.Failed;
      state.error = action.payload;
    },
  },
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  historyLoading,
  historyFailed,
} = historySlice.actions;

export default historySlice.reducer;

export const selectAllTransactions = (state: { history: HistoryState }) => state.history.transactions;
export const selectTransactionById = (state: { history: HistoryState }, transactionId: string) =>
  state.history.transactions.find(transaction => transaction.id === transactionId);
export const selectTransactionsByType = (state: { history: HistoryState }, type: TransactionType) =>
  state.history.transactions.filter(transaction => transaction.type === type);
export const selectHistoryStatus = (state: { history: HistoryState }) => state.history.status;
export const selectHistoryError = (state: { history: HistoryState }) => state.history.error;