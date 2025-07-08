// src/components/CategoriesList.tsx
import React from 'react'; // Удален useEffect
import { useSelector, useDispatch } from 'react-redux';

import {
  selectAllCategories,
  selectCategoryStatus,
  selectCategoryError,
  // fetchCategories, // Больше не импортируем здесь
  addCategory
} from '../features/category/categorySlice';
import { selectCurrentUser, selectUserStatus, selectUserError } from '../features/user/userSlice';
import { RootState, AppDispatch } from '../app/store';
import { Category } from '../types';

// --- Import styled components ---
import { StyledButton, LoadingMessage, ErrorMessage, MessageContainer } from '../styles/SharedStyles';
import {
  CategoriesContainer,
  CategoriesTitle,
  CategoryList,
  CategoryListItem,
  CategoryTitle as StyledCategoryTitle,
  CategoryDescription,
  CategoryFinancials,
  EmptyCategoriesMessage
} from './CategoriesList.styles';

function CategoriesList() {
  const categories: Category[] = useSelector((state: RootState) => selectAllCategories(state));
  const categoryStatus = useSelector((state: RootState) => selectCategoryStatus(state));
  const categoryError = useSelector((state: RootState) => selectCategoryError(state));
  const currentUser = useSelector((state: RootState) => selectCurrentUser(state));
  const userStatus = useSelector((state: RootState) => selectUserStatus(state));
  const userError = useSelector((state: RootState) => selectUserError(state));
  const dispatch: AppDispatch = useDispatch();

  // Удален useEffect, который вызывал fetchCategories

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

  // Примечание: categoryStatus === 'loading' здесь означает, что, возможно, App.tsx инициировал загрузку
  // или произошел сброс состояния.
  if (categoryStatus === 'loading' && categories.length === 0) { // Добавлена проверка на categories.length
    return <LoadingMessage>Loading categories for {currentUser?.name || 'user'}...</LoadingMessage>;
  }

  if (categoryStatus === 'failed') {
    return <ErrorMessage>Error loading categories: {categoryError || 'Unknown error'}</ErrorMessage>;
  }

  // Фильтруем категории для текущего пользователя, если они уже загружены
  const currentUsersCategories = categories.filter(cat => currentUser && cat.userId === currentUser.id);


  return (
    <CategoriesContainer>
      <CategoriesTitle>Categories (For {currentUser?.name || 'current user'})</CategoriesTitle>
      {currentUsersCategories.length === 0 && categoryStatus === 'succeeded' ? (
        <EmptyCategoriesMessage>No categories found for this user.</EmptyCategoriesMessage>
      ) : (
        <CategoryList>
          {currentUsersCategories.map((category) => (
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