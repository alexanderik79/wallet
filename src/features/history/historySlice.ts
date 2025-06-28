// src/features/history/historySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for ID generation
import { HistoryItem, TransactionType, Status } from '../../types'; // Import our defined types
// import { updateCategoryBalances } from '../category/categorySlice'; // We'll use this in extraReducers later

// Define the shape of the state for the history slice
interface HistoryState {
  transactions: HistoryItem[]; // Array of all financial transactions
  status: Status;             // Status of operations (idle, loading, succeeded, failed)
  error: string | null;       // Error message if an operation fails
}

const initialState: HistoryState = {
  transactions: [], // Start with an empty array of transactions
  status: 'idle',
  error: null,
};

const historySlice = createSlice({
  name: 'history', // Slice name
  initialState,
  reducers: {
    // Reducer to add a new transaction (income or expense)
    addTransaction: (state, action: PayloadAction<Omit<HistoryItem, 'id' | 'date'>>) => {
      const newTransaction: HistoryItem = {
        id: uuidv4(), // Generate unique ID for the transaction
        date: new Date().toISOString().split('T')[0], // Set current date as 'YYYY-MM-DD'
        ...action.payload,
      };
      state.transactions.push(newTransaction); // Add the new transaction
      state.status = 'succeeded';
      state.error = null;
    },
    // Reducer to update an existing transaction by its ID
    updateTransaction: (state, action: PayloadAction<Partial<HistoryItem> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      const existingTransaction = state.transactions.find(transaction => transaction.id === id);
      if (existingTransaction) {
        Object.assign(existingTransaction, updates); // Update specific fields
        state.status = 'succeeded';
        state.error = null;
      } else {
        state.status = 'failed';
        state.error = `Transaction with ID ${id} not found for update.`;
      }
    },
    // Reducer to delete a transaction by its ID
    deleteTransaction: (state, action: PayloadAction<string>) => {
      // Filter out the transaction with the given ID
      state.transactions = state.transactions.filter(transaction => transaction.id !== action.payload);
      state.status = 'succeeded';
      state.error = null;
    },
    // Reducers for status management (similar to other slices)
    historyLoading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    historyFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   // This section is for handling actions from other slices or async thunks.
  //   // For example, if adding/deleting a transaction should automatically update category balances:
  //   builder
  //     .addCase(addTransaction, (state, action) => {
  //       // Here you might dispatch an action to update category balances,
  //       // but you cannot directly dispatch from a reducer.
  //       // Instead, you would use a "thunk" (async action) or update derived state.
  //       // For homework, simply tracking transactions in this slice is enough.
  //       // If you need to tie into category totals, this would be a place to consider.
  //     })
  //     .addCase(deleteTransaction, (state, action) => {
  //       // Similar logic for updating category balances on deletion
  //     });
  // }
});

// Export action creators
export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  historyLoading,
  historyFailed,
} = historySlice.actions;

// Export the default reducer
export default historySlice.reducer;

// Export selectors
export const selectAllTransactions = (state: { history: HistoryState }) => state.history.transactions;
export const selectTransactionById = (state: { history: HistoryState }, transactionId: string) =>
  state.history.transactions.find(transaction => transaction.id === transactionId);
export const selectTransactionsByType = (state: { history: HistoryState }, type: TransactionType) =>
  state.history.transactions.filter(transaction => transaction.type === type);
export const selectHistoryStatus = (state: { history: HistoryState }) => state.history.status;
export const selectHistoryError = (state: { history: HistoryState }) => state.history.error;