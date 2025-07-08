import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import {
  Box, TextField, Button,
  FormControl, InputLabel, Select, MenuItem,
  RadioGroup, FormControlLabel, Radio,
  Typography, Stack, Grid
} from '@mui/material';

import { RootState, AppDispatch } from '../app/store';
import { selectAllCategories, updateCategoryBalances } from '../features/category/categorySlice';
import { addTransaction, updateTransaction } from '../features/history/historySlice';
import { selectCurrentUser, updateUserBalance } from '../features/user/userSlice';

import { Category, TransactionType, HistoryItem } from '../types';

interface AddTransactionFormData {
  amount: number;
  selectedCategory: string;
  transactionType: TransactionType;
  description?: string;
}

interface AddNoteProps {
  initialData?: HistoryItem | null;
  onClose: () => void;
}

function AddNote({ initialData, onClose }: AddNoteProps) {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector((state: RootState) => selectAllCategories(state));
  const currentUser = useSelector((state: RootState) => selectCurrentUser(state));

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    control,
  } = useForm<AddTransactionFormData>({
    defaultValues: {
      amount: 0,
      selectedCategory: '',
      transactionType: 'expense',
      description: '',
    },
  });

  const transactionType = watch('transactionType');

  useEffect(() => {
    if (initialData) {
      reset({
        amount: initialData.amount,
        selectedCategory: initialData.categoryId,
        transactionType: initialData.type,
        description: initialData.description || '',
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: AddTransactionFormData) => {
    if (!currentUser) return;

    const selectedCat = categories.find((cat) => cat.id === data.selectedCategory);
    if (!selectedCat) return;

    let incomeChange = 0;
    let expenseChange = 0;
    let balanceChange = 0;

    if (data.transactionType === 'income') {
      incomeChange = data.amount;
      balanceChange = data.amount;
    } else {
      expenseChange = data.amount;
      balanceChange = -data.amount;
    }

    dispatch(updateCategoryBalances({
      categoryId: data.selectedCategory,
      incomeChange,
      expenseChange,
    }));

    if (initialData) {
      // EDIT mode
      dispatch(updateTransaction({
        ...initialData,
        amount: data.amount,
        categoryId: data.selectedCategory,
        type: data.transactionType,
        description: data.description,
      }));
    } else {
      // CREATE mode
      dispatch(addTransaction({
        amount: data.amount,
        categoryId: data.selectedCategory,
        type: data.transactionType,
        description: data.description,
      }));
    }

    dispatch(updateUserBalance(currentUser.startBalance + balanceChange));
    reset();
    onClose();
  };

  const filteredCategories = categories.filter(cat => cat.userId === currentUser?.id);

  return (
    <Box sx={{ padding: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        {initialData ? 'Edit Transaction' : 'Add New Transaction'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} component="div">

            <Stack spacing={1}>
              <TextField
                type="number"
                label="Amount"
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
              />

              <FormControl fullWidth error={!!errors.selectedCategory} size="small" margin="dense">
                <InputLabel id="category-select-label">Category</InputLabel>
                <Controller
                  name="selectedCategory"
                  control={control}
                  rules={{ required: 'Please select a category.' }}
                  render={({ field }) => (
                    <Select labelId="category-select-label" label="Category" {...field}>
                      <MenuItem value=""><em>Select a category</em></MenuItem>
                      {filteredCategories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.selectedCategory && (
                  <Typography variant="caption" color="error">
                    {errors.selectedCategory.message}
                  </Typography>
                )}
              </FormControl>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6} component="div">

            <FormControl component="fieldset" error={!!errors.transactionType} margin="dense">
              <Typography component="legend" variant="caption">Type:</Typography>
              <Controller
                name="transactionType"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <RadioGroup row {...field} sx={{ gap: 0 }}>
                    <FormControlLabel
                      value="expense"
                      control={<Radio sx={{ display: 'none' }} />}
                      label={
                        <Button
                          variant={field.value === 'expense' ? 'contained' : 'outlined'}
                          onClick={() => field.onChange('expense')}
                          size="small"
                        >
                          Exp
                        </Button>
                      }
                    />
                    <FormControlLabel
                      value="income"
                      control={<Radio sx={{ display: 'none' }} />}
                      label={
                        <Button
                          variant={field.value === 'income' ? 'contained' : 'outlined'}
                          onClick={() => field.onChange('income')}
                          size="small"
                        >
                          Inc
                        </Button>
                      }
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 1 }}>
          <TextField
            label="Description (Optional)"
            fullWidth
            size="small"
            margin="dense"
            {...register('description')}
            multiline
            rows={2}
          />
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" size="small">
            {initialData ? 'Save Changes' : 'Add Transaction'}
          </Button>
          <Button onClick={onClose} variant="outlined" color="secondary" size="small">
            Cancel
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default AddNote;
