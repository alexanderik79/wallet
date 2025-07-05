// src/components/History.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { selectAllTransactions } from '../features/history/historySlice';
import { selectAllCategories } from '../features/category/categorySlice';
import { HistoryItem, Category } from '../types';

// Import its specific grid style from AppLayout
import { HistoryGridItem } from '../styles/AppLayout.styles'; 

// Import new styles for the list itself
import {
  HistoryListContainer,
  TransactionItem,
  TransactionDetails,
  TransactionRow,
  TransactionAmount,
  TransactionTypeBadge, // This is the ONLY place type badge is rendered
  TransactionCategoryInfo,
  TransactionDescription,
  TransactionDate,
  TransactionActions,
  ActionButton,
  NoTransactionsMessage,
} from './HistoryList.styles';

function History() {
  // Select all transactions from the Redux store
  const transactions = useSelector(selectAllTransactions);
  // Select all categories from the Redux store
  const categories = useSelector(selectAllCategories);

  // Helper function to find category title by ID
  const getCategoryTitle = (categoryId: string): string => {
    const category = categories.find((cat: Category) => cat.id === categoryId);
    return category ? category.title : 'Unknown Category';
  };

  // Sort transactions by date in descending order (most recent first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    // Assuming date is in 'YYYY-MM-DD' format, string comparison works
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleEdit = (transactionId: string) => {
    alert(`Edit transaction: ${transactionId}`);
    // Implement actual edit logic later (e.g., open a modal with form)
  };

  const handleDelete = (transactionId: string) => {
    if (window.confirm(`Are you sure you want to delete transaction ${transactionId}?`)) {
      alert(`Delete transaction: ${transactionId}`);
      // Implement actual delete logic later (dispatch deleteTransaction action)
    }
  };

  return (
    <HistoryGridItem>
      <h3>Transaction History</h3> {/* Keep the heading */}
      {sortedTransactions.length === 0 ? (
        <NoTransactionsMessage>No transactions recorded yet.</NoTransactionsMessage>
      ) : (
        <HistoryListContainer>
          {sortedTransactions.map((transaction: HistoryItem) => (
            <TransactionItem key={transaction.id} className={`${transaction.type}-item`}>
              <TransactionDetails>
                <TransactionRow>
                  <TransactionAmount>
                    {/* Display amount with appropriate sign */}
                    {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                  </TransactionAmount>
                  {/* This is the ONLY TransactionTypeBadge in the component */}
                  <TransactionTypeBadge className={transaction.type}>
                    {transaction.type}
                  </TransactionTypeBadge>
                  <TransactionCategoryInfo>
                    from {getCategoryTitle(transaction.categoryId)}
                  </TransactionCategoryInfo>
                </TransactionRow>
                {/* Display description if available */}
                {transaction.description && (
                  <TransactionDescription>{transaction.description}</TransactionDescription>
                )}
              </TransactionDetails>
              
              {/* Display transaction date */}
              <TransactionDate>{transaction.date}</TransactionDate>

              <TransactionActions>
                <ActionButton onClick={() => handleEdit(transaction.id)} title="Edit Transaction">
                  <i className="fas fa-edit"></i> {/* Font Awesome Edit Icon */}
                </ActionButton>
                <ActionButton onClick={() => handleDelete(transaction.id)} title="Delete Transaction">
                  <i className="fas fa-trash-alt"></i> {/* Font Awesome Delete Icon */}
                </ActionButton>
              </TransactionActions>
            </TransactionItem>
          ))}
        </HistoryListContainer>
      )}
    </HistoryGridItem>
  );
}

export default History;