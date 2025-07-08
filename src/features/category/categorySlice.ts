// src/features/category/categorySlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Category, Status, CategoryState } from '../../types';
import axios from 'axios';
import { RootState } from '../../app/store'; // Make sure RootState is imported
import { ERROR_MESSAGES } from '../../constants/errorMessages';

const initialState: CategoryState = {
  categories: [],
  status: Status.Idle,
  error: null,
};

// Изменяем fetchCategories
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (userId: string, { getState, rejectWithValue }) => { // Получаем getState для доступа к текущему состоянию
    const state = getState() as RootState; // Приводим тип
    const currentCategories = state.category.categories;

    // --- НОВАЯ ЛОГИКА ---
    // Если категории уже есть в состоянии (т.е., были восстановлены redux-persist),
    // то мы не делаем запрос к data.json. Просто возвращаем текущие категории.
    // Это ключевой момент, предотвращающий перезапись.
    if (currentCategories && currentCategories.length > 0 && state.category.status !== Status.Loading) {
        console.log("Categories already present in Redux state. Skipping fetch from data.json.");
        return currentCategories.filter(cat => cat.userId === userId); // Возвращаем только категории текущего пользователя
    }
    // --- КОНЕЦ НОВОЙ ЛОГИКИ ---

    try {
      // Option 2: Fetch from static data.json (for Netlify deployment)
      const response = await axios.get<{ users: any[]; categories: Category[] }>('/data.json');
      const allCategories = response.data.categories;
      const userCategories = allCategories.filter(cat => cat.userId === userId);

      console.log("Fetched categories from data.json for user:", userId, userCategories); // Debug log
      return userCategories;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error fetching categories:", error.message);
        return rejectWithValue(error.message || ERROR_MESSAGES.CATEGORY.FETCH_FAILED_GENERIC);
      }
      console.error("Unknown error fetching categories:", error);
      return rejectWithValue(ERROR_MESSAGES.CATEGORY.UNKNOWN_FETCH_ERROR);
    }
  },
  {
    // Дополнительное условие для предотвращения повторного вызова
    condition: (userId, { getState }) => {
      const { category } = getState() as RootState;
      // Если категории уже загружены (успешно) И их больше 0, не выполнять fetchCategories
      if (category.status === Status.Succeeded && category.categories.length > 0) {
        // console.log('FetchCategories condition: Skipping because categories are already succeeded and present.');
        return false; // Отменяем выполнение thunk
      }
      // console.log('FetchCategories condition: Proceeding with fetch.');
      return true; // Разрешаем выполнение thunk
    },
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
        console.log("Category added:", action.payload); // Debug log
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
        console.log("Category updated:", existingCategory); // Debug log
      } else {
        state.status = Status.Failed;
        state.error = ERROR_MESSAGES.CATEGORY.NOT_FOUND_FOR_UPDATE(id);
        console.error("Category update failed: Not found", id); // Debug log
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(category => category.id !== action.payload);
      state.status = Status.Succeeded;
      state.error = null;
      console.log("Category deleted:", action.payload); // Debug log
    },
    updateCategoryBalances: (state, action: PayloadAction<{ categoryId: string; incomeChange: number; expenseChange: number }>) => {
      const { categoryId, incomeChange, expenseChange } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        console.log(`--- Category Balance Update ---`);
        console.log(`Category ID: ${categoryId}`);
        console.log(`Income Change: ${incomeChange}, Expense Change: ${expenseChange}`);
        console.log(`Category before update: Income=${category.income}, Expense=${category.expense}`);

        category.income += incomeChange;
        category.expense += expenseChange;

        console.log(`Category after update: Income=${category.income}, Expense=${category.expense}`);
        console.log(`-----------------------------`);

        state.status = Status.Succeeded;
        state.error = null;
      } else {
        console.error(`Category with ID ${categoryId} not found for balance update.`);
        state.status = Status.Failed;
        state.error = `Category with ID ${categoryId} not found for balance update.`;
      }
    },
    updateCategoryBudget: (state, action: PayloadAction<{ id: string; income: number }>) => {
      const { id, income } = action.payload;
      const category = state.categories.find(cat => cat.id === id);
      if (category) {
        // Warning: This action overwrites 'income'. Is it intended for a budget field?
        console.warn(`Category Budget/Income SET. Category ID: ${id}, Old Income: ${category.income}, New Income (from budget): ${income}`); // Debug log
        category.income = income;
        state.status = Status.Succeeded;
        state.error = null;
      } else {
        state.status = Status.Failed;
        state.error = `Category with ID ${id} not found for income update.`;
        console.error("Category budget update failed: Not found", id); // Debug log
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
        // Только если payload не пустой, и он отличается от того, что уже есть (опционально, но здесь не нужно,
        // так как thunk уже возвращает текущие данные, если они есть)
        // action.payload может быть либо новыми данными из data.json, либо существующими, возвращенными из thunk
        state.categories = action.payload;
        console.log("Categories state updated from fetchCategories. Count:", action.payload.length); // Debug log
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = Status.Failed;
        state.error = action.error.message || ERROR_MESSAGES.CATEGORY.FAILED_TO_LOAD;
        state.categories = []; // Очищаем категории при ошибке загрузки
        console.error("Failed to fetch categories:", action.error.message); // Debug log
      });
  },
});

export const {
  addCategory,
  updateCategory,
  deleteCategory,
  updateCategoryBalances,
  updateCategoryBudget,
} = categorySlice.actions;

export default categorySlice.reducer;

export const selectAllCategories = (state: RootState) => state.category.categories;
export const selectCategoryById = (state: RootState, categoryId: string) =>
  state.category.categories.find(category => category.id === categoryId);
export const selectCategoryStatus = (state: { category: CategoryState }) => state.category.status;
export const selectCategoryError = (state: { category: CategoryState }) => state.category.error;