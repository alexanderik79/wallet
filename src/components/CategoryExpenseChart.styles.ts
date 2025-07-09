// src/components/CategoryExpenseChart.styles.ts
import styled from 'styled-components';
import React from 'react'; // Import React for CSSProperties

export const ChartContainerWrapper = styled.div`
  width: 100%;
  height: 400px; /* Fixed height for the chart */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center content vertically */
`;

export const ChartTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5em;
  text-align: center;
`;

// NEW: Константа для стилей тултипа
export const tooltipContainerStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '0.9em',
  color: '#333'
};

export const tooltipTextStyle: React.CSSProperties = { margin: '0' }; // Для общих стилей параграфов
export const tooltipBoldTextStyle: React.CSSProperties = { margin: '0', fontWeight: 'bold' };
export const tooltipBudgetTextStyle: React.CSSProperties = { margin: '5px 0 0', color: '#8884d8' };
export const tooltipExpensesTextStyle: React.CSSProperties = { margin: '0', color: '#82ca9d' };
export const tooltipRemainingTextStyle: React.CSSProperties = { margin: '0', color: '#ffc658' };
export const tooltipOverspentTextStyle: React.CSSProperties = { margin: '0', color: '#ff0000', fontWeight: 'bold' };