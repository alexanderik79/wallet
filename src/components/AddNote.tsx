// src/components/AddNote.tsx (After MUI installation)

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form'; // <-- Import Controller
import { RootState, AppDispatch } from '../app/store';
import { selectAllCategories, fetchCategories, updateCategoryBalances } from '../features/category/categorySlice';
import { addTransaction } from '../features/history/historySlice';
import { selectCurrentUser, updateUserBalance } from '../features/user/userSlice';
import { Category, TransactionType, HistoryItem } from '../types';

// Import Material-UI components
import {
  Box,        // Universal container component, can be used instead of AddNoteContainer, TopFieldsContainer, FormGroup
  TextField,  // For text/number input (replaces Input)
  Button,     // For buttons (replaces AddNoteButton)
  FormControl, InputLabel, Select, MenuItem, // For dropdowns (replaces Select)
  RadioGroup, FormControlLabel, Radio, // Radio components are still imported for FormControlLabel, but we won't show the actual Radio circle
  Typography, // For text, can be used for errors
  Stack,      // For easy vertical or horizontal arrangement of elements
  Grid        // For more complex grid layouts
} from '@mui/material';

interface AddTransactionFormData {
  amount: number;
  selectedCategory: string;
  transactionType: TransactionType;
  description?: string;
}

function AddNote() {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector((state: RootState) => selectAllCategories(state));
  const currentUser = useSelector((state: RootState) => selectCurrentUser(state));

  const { register, handleSubmit, reset, watch, formState: { errors }, control } = useForm<AddTransactionFormData>({ // <-- Added 'control'
    defaultValues: {
      amount: 0,
      selectedCategory: '',
      transactionType: 'expense',
      description: '',
    }
  });

  const transactionType = watch('transactionType');

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchCategories(currentUser.id));
    }
  }, [dispatch, currentUser?.id]);

  const onSubmit = (data: AddTransactionFormData) => {
    if (!currentUser) {
      console.error('Error: No user logged in. Cannot add transaction.');
      alert('Error: No user logged in. Please log in to add transactions.');
      return;
    }

    const categoryForTransaction = categories.find(cat => cat.id === data.selectedCategory);
    if (!categoryForTransaction) {
      console.error('Error: Selected category not found.');
      alert('Error: Selected category not found.');
      return;
    }

    let incomeChange = 0;
    let expenseChange = 0;
    let userBalanceChange = 0;

    if (data.transactionType === 'income') {
      incomeChange = data.amount;
      userBalanceChange = data.amount;
    } else { // expense
      expenseChange = data.amount;
      userBalanceChange = -data.amount;
    }

    dispatch(updateCategoryBalances({
      categoryId: data.selectedCategory,
      incomeChange: incomeChange,
      expenseChange: expenseChange,
    }));

    const newTransaction: Omit<HistoryItem, 'id' | 'date'> = {
      categoryId: data.selectedCategory,
      amount: data.amount,
      type: data.transactionType,
      description: data.description,
    };
    dispatch(addTransaction(newTransaction));

    dispatch(updateUserBalance(currentUser.startBalance + userBalanceChange));

    reset();
    // alert('Transaction added successfully!');
  };

  const currentUsersCategories = categories.filter(cat => currentUser && cat.userId === currentUser.id);

  return (
    // Use Box as a general container, styles can be added via sx prop
    // Reduced maxWidth and padding even further for a compact form
    <Box sx={{ padding: 1, border: 'none'}}>
      {/* Smaller heading */}
      <Typography variant="subtitle1" component="h2" gutterBottom sx={{ mb: 1 }}>
        Add New Transaction
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Use Grid for a two-column layout */}
        <Grid container spacing={1}> {/* Reduced spacing for a more compact layout */}
          {/* Left column for Amount and Category */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1}> {/* Reduced spacing for vertical elements */}
              <TextField
                type="number"
                label="Amount"
                variant="outlined"
                fullWidth
                size="small" // <-- Set size to "small"
                margin="dense" // <-- Added margin="dense" for more compact vertical spacing
                {...register('amount', {
                  required: 'Amount is required.',
                  min: { value: 0.01, message: 'Amount must be positive.' },
                  valueAsNumber: true,
                })}
                error={!!errors.amount}
                helperText={errors.amount?.message}
                inputProps={{ step: "0.01" }}
              />

              <FormControl fullWidth error={!!errors.selectedCategory} size="small" margin="dense"> {/* Set size to "small" and margin="dense" */}
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

          {/* Right column for Type - MODIFIED FOR BUTTONS */}
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" error={!!errors.transactionType} margin="dense"> {/* Added margin="dense" for compact spacing */}
              <Typography component="legend" variant="caption">Type:</Typography> {/* Optional: smaller legend font size */}
              <Controller
                name="transactionType"
                control={control}
                rules={{ required: 'Please select a transaction type.' }}
                render={({ field }) => (
                  <RadioGroup row {...field} sx={{ gap: 0 }}> {/* Added gap for spacing between buttons */}
                    {/* Expense Button */}
                    <FormControlLabel
                      value="expense"
                      // We hide the actual Radio component
                      control={<Radio sx={{ display: 'none' }} />}
                      label={
                        <Button
                          variant={field.value === 'expense' ? 'contained' : 'outlined'} // 'contained' when selected
                          color={field.value === 'expense' ? 'primary' : 'inherit'}    // Primary color when selected
                          size="small" // Make buttons small
                          onClick={() => field.onChange('expense')} // Manually trigger change
                          sx={{ minWidth: '50px' }} // Give buttons a minimum width for consistent sizing
                        >
                          Exp
                        </Button>
                      }
                      sx={{ margin: 0 }} // Remove default margin from FormControlLabel
                    />

                    {/* Income Button */}
                    <FormControlLabel
                      value="income"
                      control={<Radio sx={{ display: 'none' }} />} // Hide the actual radio circle
                      label={
                        <Button
                          variant={field.value === 'income' ? 'contained' : 'outlined'} // 'contained' when selected
                          color={field.value === 'income' ? 'primary' : 'inherit'}    // Primary color when selected
                          size="small" // Make buttons small
                          onClick={() => field.onChange('income')} // Manually trigger change
                          sx={{ minWidth: '50px' }}
                        >
                          Inc
                        </Button>
                      }
                      sx={{ margin: 0 }} // Remove default margin from FormControlLabel
                    />
                  </RadioGroup>
                )}
              />
              {errors.transactionType && <Typography variant="caption" color="error">{errors.transactionType.message}</Typography>}
            </FormControl>
          </Grid>
        </Grid>

        {/* Description field */}
        <Box sx={{ mt: 1 }}> {/* Reduced top margin */}
          <TextField
            type="text"
            label="Description (Optional)"
            variant="outlined"
            fullWidth
            size="small" // <-- Set size to "small"
            margin="dense" // <-- Added margin="dense"
            {...register('description')}
            placeholder="e.g., Coffee, Salary"
            multiline // For multiline input, like Textarea
            rows={2}
          />
        </Box>

        <Button
          type="submit"
          variant="contained" // Filled button
          color="primary"     // Primary theme color
          fullWidth           // Full width
          size="small"        // Changed button size to small
          sx={{ mt: 1 }}      // Reduced top margin
        >
          Add Transaction
        </Button>
      </form>
    </Box>
  );
}

export default AddNote;