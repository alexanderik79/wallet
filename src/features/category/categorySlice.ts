// src/features/category/categorySlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Category, Status, CategoryState } from '../../types'; 
import axios from 'axios';
import { RootState } from '../../app/store';
import { ERROR_MESSAGES } from '../../constants/errorMessages'; 

const initialState: CategoryState = {
  categories: [],
  status: Status.Idle,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (userId: string) => {
    try {
      // Option 1: Fetch from live API 
      // const response = await axios.get<Category[]>(`http://localhost:3000/categories?userId=${userId}`);
      // const userCategories = response.data;

      // Option 2: Fetch from static data.json (for Netlify deployment)
      const response = await axios.get<{ users: any[]; categories: Category[] }>('/data.json'); // Adjust path if not data.json
      const allCategories = response.data.categories;
      const userCategories = allCategories.filter(cat => cat.userId === userId);
      
      return userCategories;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message || ERROR_MESSAGES.CATEGORY.FETCH_FAILED_GENERIC);
      }
      throw new Error(ERROR_MESSAGES.CATEGORY.UNKNOWN_FETCH_ERROR);
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    addCategory: {
      reducer(state, action: PayloadAction<Category>) {
        state.categories.push(action.payload);
        state.status = Status.Succeeded;
        state.error = null;
      },
      prepare(payload: Omit<Category, 'id' | 'income' | 'expense' | 'isDefault' | 'userId'>, userId: string) {
        return {
          payload: {
            id: uuidv4(),
            userId: userId,
            ...payload,
            income: 0,
            expense: 0,
            isDefault: false,
          }
        };
      }
    },
    updateCategory: (state, action: PayloadAction<Partial<Category> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      const existingCategory = state.categories.find(category => category.id === id);
      if (existingCategory) {
        Object.assign(existingCategory, updates);
        state.status = Status.Succeeded;
        state.error = null;
      } else {
        state.status = Status.Failed;
        state.error = ERROR_MESSAGES.CATEGORY.NOT_FOUND_FOR_UPDATE(id);
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(category => category.id !== action.payload);
      state.status = Status.Succeeded;
      state.error = null;
    },
    // This action correctly updates income and expense for a category
    updateCategoryBalances: (state, action: PayloadAction<{ categoryId: string; incomeChange: number; expenseChange: number }>) => {
      const { categoryId, incomeChange, expenseChange } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.income += incomeChange;
        category.expense += expenseChange;
        state.status = Status.Succeeded; // Set status on successful update
        state.error = null;
      } else {
        state.status = Status.Failed; // Set status on failure
        state.error = `Category with ID ${categoryId} not found for balance update.`;
      }
    },
    updateCategoryBudget: (state, action: PayloadAction<{ id: string; income: number }>) => {
      const { id, income } = action.payload;
      const category = state.categories.find(cat => cat.id === id);
      if (category) {
        category.income = income; // This looks like it should be category.budget = income; if 'income' is meant to be the budget for this action.
                              // Based on Category interface, it's 'income' for actual income, not budget.
                              // If this action is meant to update 'budget', you might need to adjust your Category interface and action name.
        state.status = Status.Succeeded;
        state.error = null;
      } else {
        state.status = Status.Failed;
        state.error = `Category with ID ${id} not found for income update.`;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = Status.Loading;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status = Status.Succeeded;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = Status.Failed;
        state.error = action.error.message || ERROR_MESSAGES.CATEGORY.FAILED_TO_LOAD;
        state.categories = [];
      });
  },
});

export const {
  addCategory,
  updateCategory,
  deleteCategory,
  updateCategoryBalances, // Used in AddNote.tsx
  updateCategoryBudget,
} = categorySlice.actions;

export default categorySlice.reducer;

export const selectAllCategories = (state: RootState) => state.category.categories;
export const selectCategoryById = (state: RootState, categoryId: string) =>
  state.category.categories.find(category => category.id === categoryId);
export const selectCategoryStatus = (state: { category: CategoryState }) => state.category.status; 
export const selectCategoryError = (state: { category: CategoryState }) => state.category.error;