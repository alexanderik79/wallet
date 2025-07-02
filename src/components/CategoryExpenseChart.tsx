// src/components/CategoryExpenseChart.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';
import styled from 'styled-components';
import { selectAllCategories } from '../features/category/categorySlice';
import { RootState } from '../app/store'; // Ensure the path to RootState is correct

const ChartContainerWrapper = styled.div`
  width: 100%;
  height: 400px; /* Fixed height for the chart */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center content vertically */
`;

const ChartTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5em;
  text-align: center;
`;

// Custom Tooltip for displaying additional information on hover
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const category = payload[0].payload; // Access the original category data object
    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '0.9em',
        color: '#333'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{category.name}</p>
        <p style={{ margin: '5px 0 0', color: '#8884d8' }}>Budget: ${category.budget}</p>
        <p style={{ margin: '0', color: '#82ca9d' }}>Expenses: ${category.expense}</p>
        {category.budget > 0 && <p style={{ margin: '0', color: '#ffc658' }}>Remaining: ${Math.max(0, category.budget - category.expense)}</p>}
        {category.budget > 0 && (category.expense > category.budget) && <p style={{ margin: '0', color: '#ff0000', fontWeight: 'bold' }}>Overspent: ${Math.abs(category.budget - category.expense)}</p>}
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
    name: cat.title,
    budget: cat.budget,
    expense: cat.expense,
    // 'remaining' is calculated in the tooltip, but could be a separate bar if needed
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