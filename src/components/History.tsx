// src/components/History.tsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { selectAllTransactions, selectTransactionById, deleteTransaction } from '../features/history/historySlice';
import { selectAllCategories, updateCategoryBalances } from '../features/category/categorySlice';
import { selectCurrentUser, adjustUserBalance } from '../features/user/userSlice'; // UPDATED IMPORT: Use adjustUserBalance
import { HistoryItem, Category, TransactionType } from '../types';

// Import Material-UI components for the modal
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Import the modified AddNote component
import AddNote from './AddNote';

// Import its specific grid style from AppLayout
import { HistoryGridItem } from '../styles/AppLayout.styles';

// Import new styles for the list itself
import {
  HistoryListContainer,
  TransactionItem,
  TransactionDetails,
  TransactionRow,
  TransactionAmount,
  TransactionTypeBadge,
  TransactionCategoryInfo,
  TransactionDescription,
  TransactionDate,
  TransactionActions,
  ActionButton,
  NoTransactionsMessage,
} from './HistoryList.styles';

function History() {
  const dispatch = useDispatch();
  const transactions = useSelector(selectAllTransactions);
  const categories = useSelector(selectAllCategories);
  const currentUser = useSelector((state: RootState) => selectCurrentUser(state));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

  const getCategoryTitle = (categoryId: string): string => {
    const category = categories.find((cat: Category) => cat.id === categoryId);
    return category ? category.title : 'Unknown Category';
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleEdit = (transactionId: string) => {
    setEditingTransactionId(transactionId);
    setIsModalOpen(true);
  };

  const handleDelete = (transactionId: string) => {
    if (!currentUser) {
      alert('Error: No user logged in. Cannot delete transaction.');
      return;
    }

    const transactionToDelete = transactions.find(t => t.id === transactionId);

    if (transactionToDelete && window.confirm(`Are you sure you want to delete transaction of $${transactionToDelete.amount.toFixed(2)} from ${getCategoryTitle(transactionToDelete.categoryId)}?`)) {

      const oldAmount = transactionToDelete.amount;
      const oldType = transactionToDelete.type;
      const oldCategoryId = transactionToDelete.categoryId;

      // Reverse user balance impact using adjustUserBalance
      if (oldType === 'income') {
        dispatch(adjustUserBalance(-oldAmount)); // Subtract old income amount
      } else { // expense
        dispatch(adjustUserBalance(oldAmount)); // Add back old expense amount
      }

      // Reverse category balance impact
      dispatch(updateCategoryBalances({
        categoryId: oldCategoryId,
        incomeChange: oldType === 'income' ? -oldAmount : 0,
        expenseChange: oldType === 'expense' ? -oldAmount : 0,
      }));

      // Finally, delete the transaction from history slice
      dispatch(deleteTransaction(transactionId));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransactionId(null);
  };

  const transactionToEdit = useSelector((state: RootState) =>
    editingTransactionId ? selectTransactionById(state, editingTransactionId) : undefined
  );

  return (
    <HistoryGridItem>
      <h3>Transaction History</h3>
      {sortedTransactions.length === 0 ? (
        <NoTransactionsMessage>No transactions recorded yet.</NoTransactionsMessage>
      ) : (
        <HistoryListContainer>
          {sortedTransactions.map((transaction: HistoryItem) => (
            <TransactionItem key={transaction.id} className={`${transaction.type}-item`}>
              <TransactionDetails>
                <TransactionRow>
                  <TransactionAmount>
                    {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                  </TransactionAmount>
                  <TransactionTypeBadge className={transaction.type}>
                    {transaction.type}
                  </TransactionTypeBadge>
                  <TransactionCategoryInfo>
                    from {getCategoryTitle(transaction.categoryId)}
                  </TransactionCategoryInfo>
                </TransactionRow>
                {transaction.description && (
                  <TransactionDescription>{transaction.description}</TransactionDescription>
                )}
              </TransactionDetails>

              <TransactionDate>{transaction.date}</TransactionDate>

              <TransactionActions>
                <ActionButton onClick={() => handleEdit(transaction.id)} title="Edit Transaction">
                  <i className="fas fa-edit"></i>
                </ActionButton>
                <ActionButton onClick={() => handleDelete(transaction.id)} title="Delete Transaction">
                  <i className="fas fa-trash-alt"></i>
                </ActionButton>
              </TransactionActions>
            </TransactionItem>
          ))}
        </HistoryListContainer>
      )}

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}
            <IconButton aria-label="close" onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <AddNote initialData={transactionToEdit} onClose={handleCloseModal} />
        </DialogContent>
      </Dialog>
    </HistoryGridItem>
  );
}

export default History;