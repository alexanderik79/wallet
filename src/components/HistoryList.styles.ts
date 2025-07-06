// src/components/HistoryList.styles.ts
import styled from 'styled-components';

export const HistoryListContainer = styled.div`
  width: 100%;
  max-height: 400px; /* Max height for scrollability, adjust as needed */
  overflow-y: auto;
  padding-right: 10px; /* Space for scrollbar */
  box-sizing: border-box;

  /* Custom scrollbar styling for better aesthetics */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between; /* Distribute items with space between */
  align-items: center;
  padding: 5px 0;
  // border: 1px solid #6c63ff;
  border-radius: 8px;
  font-size: 0.9em;
  margin-bottom: 5px;
  transition: all 0.2s ease-in-out;
  background-color: #f9f9f9;

  &.income-item {
    color: #28a745; /* Green for income */
    font-weight: 600;
  }

  &.expense-item {
    color: #dc3545; /* Red for expense */
    font-weight: 600;
  }

    &:hover {
    background-color:rgba(107, 99, 255, 0.33);
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    cursor: pointer;
    // border: 1px solid rgb(255, 255, 255);
  }
`;

export const TransactionDetails = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  flex-grow: 1; /* Allow details to take available space */
`;

export const TransactionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* Space between amount, type, category */
  margin-bottom: 4px; /* Space below this row */
`;

export const TransactionAmount = styled.span`
  font-weight: bold;
  white-space: nowrap;
  font-size: 1.1em; /* Slightly larger for amount */
`;

export const TransactionTypeBadge = styled.span`
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.75em;
  font-weight: 600;
  text-transform: uppercase;
  &.income {
    background-color: #d4edda; /* Light green */
    color: #155724; /* Dark green */
  }
  &.expense {
    background-color: #f8d7da; /* Light red */
    color: #721c24; /* Dark red */
  }
`;

export const TransactionCategoryInfo = styled.span`
  font-size: 0.9em;
  color: #555;
`;

export const TransactionDescription = styled.span`
  font-size: 0.8em;
  color: #777;
  margin-top: 2px;
`;

export const TransactionDate = styled.span`
  font-size: 0.75em;
  color: #aaa;
  white-space: nowrap;
  margin-left: auto; /* Push date to the right */
`;

export const TransactionActions = styled.div`
  display: flex;
  gap: 5px; /* Space between buttons */
  margin-left: 15px; /* Space from date */
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  color: #6c63ff; /* Primary color for icons */
  cursor: pointer;
  font-size: 1.1em;
  padding: 5px;
  border-radius: 50%; /* Circular buttons */
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    // background-color: #e0e0e0;
    color:rgb(56, 52, 181);
  }

  &:active {
    background-color: #d0d0d0;
  }
`;

export const NoTransactionsMessage = styled.p`
  text-align: center;
  color: #777;
  font-style: italic;
  padding: 20px;
`;