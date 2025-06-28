// src/features/category/categorySlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Category, Status, User } from '../../types'; // Import User type
import axios from 'axios';
import { RootState } from '../../app/store'; // <-- NEW: Import RootState to access user slice

// Define the shape of the state for the category slice
interface CategoryState {
  categories: Category[];
  status: Status;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  status: 'idle',
  error: null,
};

// --- Async Thunks ---

// createAsyncThunk for fetching categories
// This thunk will still fetch ALL categories from the JSON file.
// Filtering by user will happen in the selector.
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async () => {
    try {
      const response = await axios.get<Category[]>('/data/categories.json');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message || 'Failed to fetch categories');
      }
      throw new Error('An unknown error occurred while fetching categories');
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // Reducer to add a new category
    // It now requires the userId as part of the payload, or we can get it from state.user in a thunk.
    // For simplicity, let's get userId from currentUser in a thunk or pass it.
    // However, if we're adding from a component, it's more straightforward to have the component
    // dispatch an action that includes the current userId.
    addCategory: { // <-- NEW: Prepare action with payload
      reducer(state, action: PayloadAction<Category>) {
        state.categories.push(action.payload);
        state.status = 'succeeded';
        state.error = null;
      },
      // Prepare function to generate ID and get userId automatically when dispatched
      prepare(payload: Omit<Category, 'id' | 'income' | 'expense' | 'isDefault' | 'userId'>, userId: string) {
        return {
          payload: {
            id: uuidv4(),
            userId: userId, // <-- NEW: Assign userId from the prepare function's argument
            ...payload,
            income: 0,
            expense: 0,
            isDefault: false
          }
        };
      }
    },
    // Reducer to update an existing category by its ID
    updateCategory: (state, action: PayloadAction<Partial<Category> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      const existingCategory = state.categories.find(category => category.id === id);
      if (existingCategory) {
        Object.assign(existingCategory, updates);
        state.status = 'succeeded';
        state.error = null;
      } else {
        state.status = 'failed';
        state.error = `Category with ID ${id} not found for update.`;
      }
    },
    // Reducer to delete a category by its ID
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(category => category.id !== action.payload);
      state.status = 'succeeded';
      state.error = null;
    },
    // Special reducer to update income/expense on a category
    updateCategoryBalances: (state, action: PayloadAction<{ categoryId: string; incomeChange: number; expenseChange: number }>) => {
      const { categoryId, incomeChange, expenseChange } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.income += incomeChange;
        category.expense += expenseChange;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status = 'succeeded';
        state.categories = action.payload; // Store ALL fetched categories initially
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load categories';
        state.categories = [];
      });
  },
});

// Export action creators
export const {
  addCategory,
  updateCategory,
  deleteCategory,
  updateCategoryBalances,
} = categorySlice.actions;

// Export the default reducer
export default categorySlice.reducer;

// --- Export selectors ---
// This selector now filters categories based on the current user's ID.
// It takes RootState as argument to access both category and user slices.
export const selectAllCategories = (state: RootState) => { // <-- NEW: Takes RootState
  const currentUser = state.user.currentUser; // Access the currentUser from user slice
  if (currentUser) {
    // Filter categories to only include those belonging to the current user
    return state.category.categories.filter(category => category.userId === currentUser.id);
  }
  return []; // If no user is logged in, return an empty array
};
export const selectCategoryById = (state: RootState, categoryId: string) => { // <-- NEW: Takes RootState
  const currentUser = state.user.currentUser;
  if (currentUser) {
    return state.category.categories.find(
      category => category.id === categoryId && category.userId === currentUser.id
    );
  }
  return undefined;
};
export const selectCategoryStatus = (state: { category: CategoryState }) => state.category.status;
export const selectCategoryError = (state: { category: CategoryState }) => state.category.error;