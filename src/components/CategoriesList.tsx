// src/components/CategoriesList.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllCategories,
  selectCategoryStatus,
  selectCategoryError,
  fetchCategories,
  addCategory // For adding new categories
} from '../features/category/categorySlice';
import { selectCurrentUser } from '../features/user/userSlice'; // <-- NEW: Import selectCurrentUser
import { RootState, AppDispatch } from '../app/store';
import { Category } from '../types';

function CategoriesList() {
  const categories: Category[] = useSelector((state: RootState) => selectAllCategories(state));
  const status = useSelector((state: RootState) => selectCategoryStatus(state));
  const error = useSelector((state: RootState) => selectCategoryError(state));
  const currentUser = useSelector((state: RootState) => selectCurrentUser(state)); // <-- NEW: Get current user
  const dispatch: AppDispatch = useDispatch();

  // Dispatch the fetchCategories thunk when the component mounts
  // Ensure we only try to fetch if we have a current user, or if categories are generally needed.
  // For this scenario, we fetch all categories once and then filter by user.
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const handleAddCategory = () => {
    if (currentUser) {
      // Dispatch addCategory, providing the title, description, and the currentUser.id
      dispatch(addCategory({
        title: 'My Custom Category',
        description: 'Added by ' + currentUser.name,
      }, currentUser.id)); // <-- NEW: Pass currentUser.id
    } else {
      alert('Please log in to add categories.');
    }
  };

  if (status === 'loading') {
    return <div style={{ color: 'blue' }}>Loading categories...</div>;
  }

  if (status === 'failed') {
    return <div style={{ color: 'red' }}>Error loading categories: {error}</div>;
  }

  if (!currentUser) {
    return <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h2>Categories</h2>
      <p>Please log in to view and manage your categories.</p>
    </div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h2>Categories (For {currentUser.name})</h2>
      {categories.length === 0 && status === 'succeeded' ? (
        <p>No categories found for this user.</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <strong>{category.title}</strong> ({category.isDefault ? 'Default' : 'Custom'})
              {category.description && <span> - {category.description}</span>}
              <br />
              Income: ${category.income.toFixed(2)} | Expense: ${category.expense.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleAddCategory}>
        Add My Custom Category
      </button>
    </div>
  );
}

export default CategoriesList;