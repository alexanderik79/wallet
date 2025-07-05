// src/constants/errorMessages.ts

export const ERROR_MESSAGES = {
  // User Slice Errors
  USER: {
    FETCH_FAILED_GENERIC: 'Failed to fetch user data',
    UNKNOWN_FETCH_ERROR: 'An unknown error occurred while fetching user',
    FAILED_TO_LOAD: 'Failed to load user', // Used in rejected case
    NO_CURRENT_USER_TO_UPDATE_BALANCE: "No current user found to update balance.",
  },

  // Category Slice Errors
  CATEGORY: {
    FETCH_FAILED_GENERIC: 'Failed to fetch categories',
    UNKNOWN_FETCH_ERROR: 'An unknown error occurred while fetching categories',
    NOT_FOUND_FOR_UPDATE: (id: string) => `Category with ID ${id} not found for update.`,
    FAILED_TO_LOAD: 'Failed to load categories', // Used in rejected case
  },

  // History Slice Errors
  HISTORY: {
    TRANSACTION_NOT_FOUND_FOR_UPDATE: (id: string) => `Transaction with ID ${id} not found for update.`,
  },

  // General Network Errors (if you want to abstract further)
  NETWORK: {
    UNKNOWN_ERROR: 'An unknown network error occurred',
  },
  
};