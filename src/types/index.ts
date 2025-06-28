// src/types/index.ts

// ... другие интерфейсы

// Interface for the Category entity
export interface Category {
  id: string; // Unique ID for the category
  userId: string; // <-- NEW: ID of the user this category belongs to
  title: string;
  description?: string; // Optional category description
  income: number; // Total income for this category
  expense: number; // Total expense for this category
  isDefault: boolean; // Indicates if it's a default/system category
}

// ... остальные типы