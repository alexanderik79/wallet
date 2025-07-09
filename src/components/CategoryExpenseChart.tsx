// src/components/CategoryExpenseChart.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  ChartContainerWrapper,
  ChartTitle,
  tooltipContainerStyle,
  tooltipBoldTextStyle,
  tooltipBudgetTextStyle,
  tooltipExpensesTextStyle,
  tooltipRemainingTextStyle,
  tooltipOverspentTextStyle,
  // tooltipTextStyle // Not directly used in current CustomTooltip, but imported if needed
} from './CategoryExpenseChart.styles';
import { selectAllCategories } from '../features/category/categorySlice';
import { RootState } from '../app/store';

// Custom Tooltip for displaying additional information on hover
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const category = payload[0].payload; // Access the original category data object
    return (
      <div style={tooltipContainerStyle}>
        <p style={tooltipBoldTextStyle}>{category.title}</p> {/* Use category.title for consistency */}
        <p style={tooltipBudgetTextStyle}>Income: ${category.income}</p>
        <p style={tooltipExpensesTextStyle}>Expenses: ${category.expense}</p>
        {category.income > 0 && <p style={tooltipRemainingTextStyle}>Remaining: ${Math.max(0, category.income - category.expense)}</p>}
        {category.income > 0 && (category.expense > category.income) && <p style={tooltipOverspentTextStyle}>Overspent: ${Math.abs(category.income - category.expense)}</p>}
      </div>
    );
  }
  return null;
};

const CategoryExpenseChart: React.FC = () => {
  // Select all categories from Redux Store
  const categories = useSelector((state: RootState) => selectAllCategories(state));

  // Prepare data for the chart
  const chartData = categories.map(cat => ({
    name: cat.title, // Use category title for X-axis label
    income: cat.income,
    expense: cat.expense,
  }));

  return (
    <ChartContainerWrapper>
      <ChartTitle>Income and Expense Distribution by Category</ChartTitle>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" /> {/* Dashed grid lines */}
          <XAxis dataKey="name" /> {/* X-axis - category names */}
          <YAxis /> {/* Y-axis - amounts */}
          <Tooltip content={<CustomTooltip />} /> {/* Hover tooltip */}
          <Legend /> {/* Legend for bars */}
          <Bar dataKey="income" name="Income" fill="#8884d8" /> {/* Bar for income */}
          <Bar dataKey="expense" name="Expenses" fill="#82ca9d" /> {/* Bar for expenses */}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainerWrapper>
  );
};

export default CategoryExpenseChart;