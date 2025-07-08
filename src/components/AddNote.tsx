// src/components/AddNote.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { RootState, AppDispatch } from '../app/store';
import { selectAllCategories, fetchCategories, updateCategoryBalances } from '../features/category/categorySlice';
import { addTransaction, updateTransaction } from '../features/history/historySlice';
import { selectCurrentUser, adjustUserBalance } from '../features/user/userSlice';
import { Category, TransactionType, HistoryItem } from '../types';

// Import Material-UI components
import {
  Box,
  TextField,
  Button,
  FormControl, InputLabel, Select, MenuItem,
  RadioGroup, FormControlLabel, Radio,
  Typography,
  Stack,
  Grid
} from '@mui/material';

interface AddTransactionFormData {
  amount: number;
  selectedCategory: string;
  transactionType: TransactionType;
  description?: string;
}

interface AddNoteProps {
  initialData?: HistoryItem;
  onClose?: () => void;
}

function AddNote({ initialData, onClose }: AddNoteProps) {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector((state: RootState) => selectAllCategories(state));
  const currentUser = useSelector((state: RootState) => selectCurrentUser(state));

  const isEditMode = !!initialData;
  const formTitle = isEditMode ? 'Edit Transaction' : 'Add New Transaction';
  const submitButtonText = isEditMode ? 'Save Changes' : 'Add Transaction';

  const { register, handleSubmit, reset, watch, formState: { errors }, control, setValue } = useForm<AddTransactionFormData>({
    defaultValues: {
      amount: initialData?.amount || 0,
      selectedCategory: initialData?.categoryId || '',
      transactionType: initialData?.type || 'expense',
      description: initialData?.description || '',
    }
  });

  const transactionType = watch('transactionType');

  // Fetch categories when user changes or component mounts, if categories are not already loaded.
  // This helps ensure categories are available for selection.
  useEffect(() => {
    // Note: The main fetch logic for categories to prevent data.json overwrite
    // is now primarily handled in App.tsx and categorySlice.ts.
    // This useEffect here is a fallback for component specific needs if categories are somehow missing.
    if (currentUser?.id && categories.length === 0) { // Only fetch if no categories are present
      dispatch(fetchCategories(currentUser.id));
    }
  }, [dispatch, currentUser?.id, categories.length]); // Added categories.length to dependencies

  useEffect(() => {
    if (initialData) {
      setValue('amount', initialData.amount);
      setValue('selectedCategory', initialData.categoryId);
      setValue('transactionType', initialData.type);
      setValue('description', initialData.description || '');
    } else {
      reset(); // Reset form if switching to add mode
    }
  }, [initialData, setValue, reset]);


  const onSubmit = (data: AddTransactionFormData) => {
    if (!currentUser) {
      console.error('Error: No user logged in. Cannot process transaction.');
      alert('Error: No user logged in. Please log in.');
      return;
    }

    const categoryForTransaction = categories.find(cat => cat.id === data.selectedCategory);
    if (!categoryForTransaction) {
      console.error('Error: Selected category not found in current state for the new transaction.');
      alert('Error: Selected category not found.');
      return;
    }

    let userBalanceAdjustment = 0;

    // --- 1. Process OLD transaction (if in edit mode) ---
    if (isEditMode && initialData) {
      const oldAmount = initialData.amount;
      const oldType = initialData.type;
      const oldCategoryId = initialData.categoryId;
      const oldCategoryInState = categories.find(cat => cat.id === oldCategoryId);

      // A. Revert user balance impact
      if (oldType === 'income') {
        userBalanceAdjustment -= oldAmount; // Subtract old income
      } else { // oldType === 'expense'
        userBalanceAdjustment += oldAmount; // Add back old expense
      }

      // B. Revert OLD CATEGORY balance impact
      const oldCategoryIncomeChange = oldType === 'income' ? -oldAmount : 0;
      const oldCategoryExpenseChange = oldType === 'expense' ? -oldAmount : 0;

      console.log('--- EDIT MODE: Reverting Old Transaction Impact ---');
      console.log(`Old Transaction: ID=${initialData.id}, Amount=${oldAmount}, Type=${oldType}, CategoryID=${oldCategoryId}`);
      console.log(`Dispatching updateCategoryBalances for old category: { categoryId: "${oldCategoryId}", incomeChange: ${oldCategoryIncomeChange}, expenseChange: ${oldCategoryExpenseChange} }`);
      if (oldCategoryInState) {
        console.log(`Old Category BEFORE revert (from state): Income=${oldCategoryInState.income}, Expense=${oldCategoryInState.expense}`);
      } else {
        console.warn(`Old Category ID ${oldCategoryId} not found in current categories state for revert. This might indicate stale data.`);
      }

      dispatch(updateCategoryBalances({
        categoryId: oldCategoryId,
        incomeChange: oldCategoryIncomeChange,
        expenseChange: oldCategoryExpenseChange,
      }));
    }

    // --- 2. Process NEW transaction ---
    const newAmount = data.amount;
    const newType = data.transactionType;
    const newCategoryId = data.selectedCategory;
    const newCategoryInState = categories.find(cat => cat.id === newCategoryId);


    // A. Apply user balance impact
    if (newType === 'income') {
      userBalanceAdjustment += newAmount; // Add new income
    } else { // newType === 'expense'
      userBalanceAdjustment -= newAmount; // Subtract new expense
    }

    // B. Apply NEW CATEGORY balance impact
    const newCategoryIncomeChange = newType === 'income' ? newAmount : 0;
    const newCategoryExpenseChange = newType === 'expense' ? newAmount : 0;

    console.log('--- Applying New Transaction Impact ---');
    console.log(`New Transaction: Amount=${newAmount}, Type=${newType}, CategoryID=${newCategoryId}`);
    console.log(`Dispatching updateCategoryBalances for new category: { categoryId: "${newCategoryId}", incomeChange: ${newCategoryIncomeChange}, expenseChange: ${newCategoryExpenseChange} }`);
    if (newCategoryInState) {
        console.log(`New Category BEFORE apply (from state): Income=${newCategoryInState.income}, Expense=${newCategoryInState.expense}`);
    } else {
        console.warn(`New Category ID ${newCategoryId} not found in current categories state for apply. This might indicate stale data.`);
    }

    dispatch(updateCategoryBalances({
      categoryId: newCategoryId,
      incomeChange: newCategoryIncomeChange,
      expenseChange: newCategoryExpenseChange,
    }));

    // --- 3. Dispatch final user balance adjustment ---
    if (userBalanceAdjustment !== 0) {
      console.log(`Dispatching adjustUserBalance: ${userBalanceAdjustment}`);
      dispatch(adjustUserBalance(userBalanceAdjustment));
    }

    // --- 4. Dispatch transaction to history ---
    if (isEditMode && initialData) {
      const updatedTransaction: Partial<HistoryItem> & { id: string } = {
        id: initialData.id,
        categoryId: data.selectedCategory,
        amount: data.amount,
        type: data.transactionType,
        description: data.description,
        date: initialData.date, // Preserve original date when editing
      };
      console.log('Dispatching updateTransaction:', updatedTransaction);
      dispatch(updateTransaction(updatedTransaction));
    } else {
      const newTransaction: Omit<HistoryItem, 'id' | 'date'> = {
        categoryId: data.selectedCategory,
        amount: data.amount,
        type: data.transactionType,
        description: data.description,
      };
      console.log('Dispatching addTransaction:', newTransaction);
      dispatch(addTransaction(newTransaction));
    }

    reset();
    if (onClose) {
      onClose();
    }
    console.log('--- Transaction processing finished ---');
  };

  const currentUsersCategories = categories.filter(cat => currentUser && cat.userId === currentUser.id);

  return (
    <Box sx={{ padding: 1, maxWidth: 380, margin: 'auto', border: 'none'}}>
      <Typography variant="subtitle1" component="h2" gutterBottom sx={{ mb: 1 }}>
        {formTitle}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <TextField
                type="number"
                label="Amount"
                variant="outlined"
                fullWidth
                size="small"
                margin="dense"
                {...register('amount', {
                  required: 'Amount is required.',
                  min: { value: 0.01, message: 'Amount must be positive.' },
                  valueAsNumber: true,
                })}
                error={!!errors.amount}
                helperText={errors.amount?.message}
                inputProps={{ step: "0.01" }}
              />

              <FormControl fullWidth error={!!errors.selectedCategory} size="small" margin="dense">
                <InputLabel id="category-select-label">Category</InputLabel>
                <Controller
                  name="selectedCategory"
                  control={control}
                  rules={{ required: 'Please select a category.' }}
                  render={({ field }) => (
                    <Select
                      labelId="category-select-label"
                      id="selectedCategory"
                      label="Category"
                      {...field}
                    >
                      <MenuItem value="">
                        <em>Select a category</em>
                      </MenuItem>
                      {currentUsersCategories.map((cat: Category) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.title}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.selectedCategory && <Typography variant="caption" color="error">{errors.selectedCategory.message}</Typography>}
              </FormControl>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" error={!!errors.transactionType} margin="dense">
              <Typography component="legend" variant="caption">Type:</Typography>
              <Controller
                name="transactionType"
                control={control}
                rules={{ required: 'Please select a transaction type.' }}
                render={({ field }) => (
                  <RadioGroup row {...field} sx={{ gap: 0 }}>
                    <FormControlLabel
                      value="expense"
                      control={<Radio sx={{ display: 'none' }} />}
                      label={
                        <Button
                          variant={field.value === 'expense' ? 'contained' : 'text'}
                          color={field.value === 'expense' ? 'primary' : 'inherit'}
                          size="small"
                          onClick={() => field.onChange('expense')}
                          sx={{ minWidth: '50px' }}
                        >
                          Exp
                        </Button>
                      }
                      sx={{ margin: 0 }}
                    />

                    <FormControlLabel
                      value="income"
                      control={<Radio sx={{ display: 'none' }} />}
                      label={
                        <Button
                          variant={field.value === 'income' ? 'contained' : 'text'}
                          color={field.value === 'income' ? 'primary' : 'inherit'}
                          size="small"
                          onClick={() => field.onChange('income')}
                          sx={{ minWidth: '50px' }}
                        >
                          Inc
                        </Button>
                      }
                      sx={{ margin: 0 }}
                    />
                  </RadioGroup>
                )}
              />
              {errors.transactionType && <Typography variant="caption" color="error">{errors.transactionType.message}</Typography>}
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 1 }}>
          <TextField
            type="text"
            label="Description (Optional)"
            variant="outlined"
            fullWidth
            size="small"
            margin="dense"
            {...register('description')}
            placeholder="e.g., Coffee, Salary"
            multiline
            rows={2}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="small"
          sx={{ mt: 1 }}
        >
          {submitButtonText}
        </Button>
      </form>
    </Box>
  );
}

export default AddNote;