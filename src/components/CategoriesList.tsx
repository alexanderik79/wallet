// src/components/CategoriesList.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectAllCategories,
  selectCategoryStatus,
  selectCategoryError,
  fetchCategories,
  addCategory
} from '../features/category/categorySlice';
import { selectCurrentUser, selectUserStatus, selectUserError } from '../features/user/userSlice'; // Import selectUserError
import { RootState, AppDispatch } from '../app/store';
import { Category } from '../types';

// --- Import styled components ---
import { StyledButton, LoadingMessage, ErrorMessage, MessageContainer } from '../styles/SharedStyles'; // Import shared button and messages
import {
  CategoriesContainer,
  CategoriesTitle,
  CategoryList,
  CategoryListItem,
  CategoryTitle as StyledCategoryTitle, // Alias to avoid name conflict with Category interface property
  CategoryDescription,
  CategoryFinancials,
  EmptyCategoriesMessage
} from './CategoriesList.styles'; // Import category-specific styles

function CategoriesList() {
  const categories: Category[] = useSelector((state: RootState) => selectAllCategories(state));
  const categoryStatus = useSelector((state: RootState) => selectCategoryStatus(state));
  const categoryError = useSelector((state: RootState) => selectCategoryError(state));
  const currentUser = useSelector((state: RootState) => selectCurrentUser(state));
  const userStatus = useSelector((state: RootState) => selectUserStatus(state));
  const userError = useSelector((state: RootState) => selectUserError(state)); // Get user error for display
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (userStatus === 'succeeded' && currentUser && categoryStatus === 'idle') {
      dispatch(fetchCategories(currentUser.id));
    }
  }, [userStatus, currentUser, categoryStatus, dispatch]);

  const handleAddCategory = () => {
    if (currentUser) {
      dispatch(addCategory({
        title: 'My Custom Category',
        description: 'Added by ' + currentUser.name,
      }, currentUser.id));
    } else {
      alert('Please log in to add categories.');
    }
  };

  // Display messages based on user and category loading status
  if (userStatus === 'loading') {
    return <LoadingMessage>Loading user data...</LoadingMessage>;
  }
  if (userStatus === 'failed') {
      return <ErrorMessage>Error loading user data: {userError || 'Unknown error'}</ErrorMessage>;
  }
  if (!currentUser && userStatus === 'succeeded') {
    return (
      <MessageContainer>
        <CategoriesTitle>Categories</CategoriesTitle>
        <p>No user logged in. Please ensure user data is loaded to view categories.</p>
      </MessageContainer>
    );
  }

  if (categoryStatus === 'loading') {
    return <LoadingMessage>Loading categories for {currentUser?.name || 'user'}...</LoadingMessage>;
  }

  if (categoryStatus === 'failed') {
    return <ErrorMessage>Error loading categories: {categoryError || 'Unknown error'}</ErrorMessage>;
  }

  return (
    <CategoriesContainer>
      <CategoriesTitle>Categories (For {currentUser?.name || 'current user'})</CategoriesTitle>
      {categories.length === 0 && categoryStatus === 'succeeded' ? (
        <EmptyCategoriesMessage>No categories found for this user.</EmptyCategoriesMessage>
      ) : (
        <CategoryList>
          {categories.map((category) => (
            <CategoryListItem key={category.id}>
              <StyledCategoryTitle>{category.title} ({category.isDefault ? 'Default' : 'Custom'})</StyledCategoryTitle>
              {category.description && <CategoryDescription>{category.description}</CategoryDescription>}
              <CategoryFinancials>
                <span>Income: ${category.income.toFixed(2)}</span>
                <span>Expense: ${category.expense.toFixed(2)}</span>
              </CategoryFinancials>
            </CategoryListItem>
          ))}
        </CategoryList>
      )}
      <StyledButton onClick={handleAddCategory}>
        Add My Custom Category
      </StyledButton>
    </CategoriesContainer>
  );
}

export default CategoriesList;