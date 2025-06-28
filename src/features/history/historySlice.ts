// src/features/history/historySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { HistoryItem, TransactionType, Status, HistoryState } from '../../types'; 
// NEW: Импортируем ERROR_MESSAGES
import { ERROR_MESSAGES } from '../../constants/errorMessages'; 

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
        date: new Date().toISOString().split('T')[0],
        ...action.payload,
      };
      state.transactions.push(newTransaction);
      state.status = Status.Succeeded;
      state.error = null;
    },
    updateTransaction: (state, action: PayloadAction<Partial<HistoryItem> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      const existingTransaction = state.transactions.find(transaction => transaction.id === id);
      if (existingTransaction) {
        Object.assign(existingTransaction, updates);
        state.status = Status.Succeeded;
        state.error = null;
      } else {
        state.status = Status.Failed;
        // UPDATED: Используем ERROR_MESSAGES с функцией
        state.error = ERROR_MESSAGES.HISTORY.TRANSACTION_NOT_FOUND_FOR_UPDATE(id);
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
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