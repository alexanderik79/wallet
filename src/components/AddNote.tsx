// src/components/AddNote.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { RootState, AppDispatch } from '../app/store';
import { selectAllCategories, fetchCategories, updateCategoryBalances } from '../features/category/categorySlice';
import { addTransaction } from '../features/history/historySlice';
import { selectCurrentUser, updateUserBalance } from '../features/user/userSlice';
import { Category, TransactionType, HistoryItem } from '../types';

import {
  AddNoteContainer,
  AddNoteButton,
  FormGroup,
  Label,
  Input,
  Select,
  ToggleButtonGroup,
  ToggleButtonLabel,
  HiddenRadioInput,
  ErrorMessage as StyledErrorMessage,
  TopFieldsContainer // Importing the new container
} from './AddNote.styles';

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

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<AddTransactionFormData>({
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
    <AddNoteContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* New container for field layout */}
        <TopFieldsContainer>
          {/* Left column for Amount and Category */}
          <div>
            <FormGroup>
              <Label htmlFor="amount">Amount:</Label>
              <Input
                type="number"
                id="amount"
                {...register('amount', {
                  required: 'Amount is required.',
                  min: { value: 0.01, message: 'Amount must be positive.' },
                  valueAsNumber: true,
                })}
                placeholder="e.g., 50.00"
                step="0.01"
              />
              {errors.amount && <StyledErrorMessage>{errors.amount.message}</StyledErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="selectedCategory">Category:</Label>
              <Select
                id="selectedCategory"
                {...register('selectedCategory', {
                  required: 'Please select a category.',
                })}
              >
                <option value="">Select a category</option>
                {currentUsersCategories.map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </Select>
              {errors.selectedCategory && <StyledErrorMessage>{errors.selectedCategory.message}</StyledErrorMessage>}
            </FormGroup>
          </div>

          {/* Right column for Type */}
          <div>
            <FormGroup>
              <Label>Type:</Label>
              <ToggleButtonGroup>
                <HiddenRadioInput
                  type="radio"
                  id="expense-radio"
                  value="expense"
                  {...register('transactionType', { required: true })}
                />
                <ToggleButtonLabel htmlFor="expense-radio">
                  Exp
                </ToggleButtonLabel>

                <HiddenRadioInput
                  type="radio"
                  id="income-radio"
                  value="income"
                  {...register('transactionType', { required: true })}
                />
                <ToggleButtonLabel htmlFor="income-radio">
                  Inc
                </ToggleButtonLabel>
              </ToggleButtonGroup>
              {errors.transactionType && <StyledErrorMessage>Please select a transaction type.</StyledErrorMessage>}
            </FormGroup>
          </div>
        </TopFieldsContainer>

        {/* Description field (now placed below TopFieldsContainer) */}
        <FormGroup>
          <Label htmlFor="description">Description (Optional):</Label>
          <Input
            type="text"
            id="description"
            {...register('description')}
            placeholder="e.g., Coffee, Salary"
          />
        </FormGroup>

        <AddNoteButton type="submit">Add Transaction</AddNoteButton>
      </form>
    </AddNoteContainer>
  );
}

export default AddNote;