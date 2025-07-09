// src/components/AddNote.tsx

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
    } else {
      // Сбрасываем форму в режим добавления, если initialData нет
      reset({
        amount: 0,
        selectedCategory: '',
        transactionType: 'expense',
        description: '',
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: AddTransactionFormData) => {
    if (!currentUser) {
      console.error('Error: No user logged in. Cannot process transaction.');
      alert('Error: No user logged in. Please log in.');
      return;
    }

    const newAmount = data.amount;
    const newType = data.transactionType;
    const newCategoryId = data.selectedCategory;

    // Переменные для отслеживания изменений балансов пользователя и категорий
    let userBalanceAdjustment = 0;
    let oldCategoryIncomeChange = 0;
    let oldCategoryExpenseChange = 0;
    let newCategoryIncomeChange = 0;
    let newCategoryExpenseChange = 0;

    // --- ОБРАБОТКА РЕЖИМА РЕДАКТИРОВАНИЯ ---
    if (initialData) {
      const oldAmount = initialData.amount;
      const oldType = initialData.type;
      const oldCategoryId = initialData.categoryId;

      // 1. Откат влияния СТАРОЙ транзакции на баланс пользователя
      if (oldType === 'income') {
        userBalanceAdjustment -= oldAmount; // Вычитаем старый доход
      } else { // oldType === 'expense'
        userBalanceAdjustment += oldAmount; // Прибавляем обратно старый расход
      }

      // 2. Откат влияния СТАРОЙ транзакции на баланс СТАРОЙ категории
      if (oldType === 'income') {
        oldCategoryIncomeChange -= oldAmount;
      } else { // oldType === 'expense'
        oldCategoryExpenseChange -= oldAmount;
      }

      // Если старая категория отличается от новой, откатываем старую категорию
      if (oldCategoryId !== newCategoryId) {
        dispatch(updateCategoryBalances({
          categoryId: oldCategoryId,
          incomeChange: oldCategoryIncomeChange,
          expenseChange: oldCategoryExpenseChange,
        }));
      } else {
        // Если категория не изменилась, применяем откат к текущим изменениям
        newCategoryIncomeChange += oldCategoryIncomeChange;
        newCategoryExpenseChange += oldCategoryExpenseChange;
      }
    }

    // --- ПРИМЕНЕНИЕ ВЛИЯНИЯ НОВОЙ ТРАНЗАКЦИИ (для добавления и редактирования) ---

    // 1. Применение к балансу пользователя
    if (newType === 'income') {
      userBalanceAdjustment += newAmount; // Добавляем новый доход
    } else { // newType === 'expense'
      userBalanceAdjustment -= newAmount; // Вычитаем новый расход
    }

    // 2. Применение к балансу НОВОЙ категории
    if (newType === 'income') {
      newCategoryIncomeChange += newAmount;
    } else { // newType === 'expense'
      newCategoryExpenseChange += newAmount;
    }

    // Диспатчим изменения для НОВОЙ категории
    dispatch(updateCategoryBalances({
      categoryId: newCategoryId,
      incomeChange: newCategoryIncomeChange,
      expenseChange: newCategoryExpenseChange,
    }));

    // --- Обновление истории транзакций ---
    if (initialData) {
      // Режим редактирования: обновляем существующую транзакцию
      const updatedTransaction: Partial<HistoryItem> & { id: string } = {
        id: initialData.id,
        categoryId: newCategoryId,
        amount: newAmount,
        type: newType,
        description: data.description,
        date: initialData.date, // Сохраняем оригинальную дату
      };
      dispatch(updateTransaction(updatedTransaction));
    } else {
      // Режим добавления: добавляем новую транзакцию
      const newTransaction: Omit<HistoryItem, 'id' | 'date'> = {
        categoryId: newCategoryId,
        amount: newAmount,
        type: newType,
        description: data.description,
      };
      dispatch(addTransaction(newTransaction));
    }

    // --- Обновление баланса пользователя ---
    dispatch(updateUserBalance(currentUser.startBalance + userBalanceAdjustment));

    // Сброс формы и закрытие модалки
    reset();
    onClose();
  };

  const filteredCategories = categories.filter(cat => currentUser && cat.userId === currentUser.id);

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