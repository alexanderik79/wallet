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
        <p style={tooltipBudgetTextStyle}>Budget: ${category.budget}</p>
        <p style={tooltipExpensesTextStyle}>Expenses: ${category.expense}</p>
        {category.budget > 0 && <p style={tooltipRemainingTextStyle}>Remaining: ${Math.max(0, category.budget - category.expense)}</p>}
        {category.budget > 0 && (category.expense > category.budget) && <p style={tooltipOverspentTextStyle}>Overspent: ${Math.abs(category.budget - category.expense)}</p>}
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
    budget: cat.budget,
    expense: cat.expense,
  }));

  return (
    <ChartContainerWrapper>
      <ChartTitle>Budget and Expense Distribution by Category</ChartTitle>
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
          <Bar dataKey="budget" name="Budget" fill="#8884d8" /> {/* Bar for budget */}
          <Bar dataKey="expense" name="Expenses" fill="#82ca9d" /> {/* Bar for expenses */}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainerWrapper>
  );
};

export default CategoryExpenseChart;