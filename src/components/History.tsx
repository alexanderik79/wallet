import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import {
  selectAllTransactions,
  deleteTransaction,
} from '../features/history/historySlice';
import { selectAllCategories, updateCategoryBalances } from '../features/category/categorySlice';
import { HistoryItem, Category } from '../types';

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

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import AddNote from './AddNote';

function History() {
  const dispatch = useDispatch();
  const transactions = useSelector(selectAllTransactions);
  const categories = useSelector(selectAllCategories);

  const [transactionToEdit, setTransactionToEdit] = useState<HistoryItem | null>(null);

  const getCategoryTitle = (categoryId: string): string => {
    const category = categories.find((cat: Category) => cat.id === categoryId);
    return category ? category.title : 'Unknown Category';
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleEdit = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      setTransactionToEdit(transaction);
    }
  };

  const handleDelete = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    if (window.confirm(`Are you sure you want to delete transaction ${transactionId}?`)) {
      const incomeChange = transaction.type === 'income' ? -transaction.amount : 0;
      const expenseChange = transaction.type === 'expense' ? -transaction.amount : 0;

      dispatch(updateCategoryBalances({
        categoryId: transaction.categoryId,
        incomeChange,
        expenseChange,
      }));

      dispatch(deleteTransaction(transactionId));
    }
  };

  const handleCloseModal = () => {
    setTransactionToEdit(null);
  };

  return (
    <div>
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

      <Dialog open={!!transactionToEdit} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent dividers>
          {transactionToEdit && (
            <AddNote initialData={transactionToEdit} onClose={handleCloseModal} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default History;
