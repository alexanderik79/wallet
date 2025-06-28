// src/types/index.ts

// Interface for the User entity
export interface User {
  id: string; // Unique ID for the user
  name: string;
  password?: string;
  photo?: string;
  email: string;
  startBalance: number;
}

// Interface for the Category entity
export interface Category {
  id: string;
  userId: string;
  title: string;
  description?: string;
  income: number;
  expense: number;
  isDefault: boolean;
}

// Type for transaction type
export type TransactionType = 'income' | 'expense';

// Interface for a History item (transaction)
export interface HistoryItem {
  id: string;
  type: TransactionType;
  categoryId: string;
  amount: number;
  description?: string;
  date: string;
}

// NEW: Изменяем 'type Status' на 'enum Status'
export enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Succeeded = 'succeeded',
  Failed = 'failed',
}

// Interface for the Category slice state
export interface CategoryState {
  categories: Category[];
  status: Status; // Используем enum Status
  error: string | null;
}

// Interface for the User slice state (для полноты примера)
export interface UserState {
  currentUser: User | null;
  status: Status; // Используем enum Status
  error: string | null;
}

// Interface for the History slice state
export interface HistoryState {
  transactions: HistoryItem[];
  status: Status; // Используем enum Status
  error: string | null;
}