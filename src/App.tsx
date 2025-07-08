// src/App.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserStatus, fetchUser } from './features/user/userSlice';
import { selectCategoryStatus, selectAllCategories, fetchCategories } from './features/category/categorySlice'; // Импортируем selectAllCategories
import { AppDispatch, RootState } from './app/store';

import { USER_ID } from './constants/userId';

import { GlobalStyle } from './styles/GlobalStyle';

// Import layout styled components
import {
  AppWrapper,
  SidebarArea,
  MainContentGrid,
  CategoriesListGridItem,
  HistoryGridItem,
  AddNoteGridItem,
  TopBalanceOverview,
  ChartGridItem,
} from './styles/AppLayout.styles';

// Import your actual content components
import Sidebar from './components/Sidebar';
import BalanceOverview from './components/BalanceOverview';
import History from './components/History';
import CategoriesList from './components/CategoriesList';
import AddNote from './components/AddNote';
import CategoryExpenseChart from './components/CategoryExpenseChart';

function App() {
  const dispatch: AppDispatch = useDispatch();
  const userStatus = useSelector((state: RootState) => selectUserStatus(state));
  const categoryStatus = useSelector((state: RootState) => selectCategoryStatus(state));
  const categories = useSelector((state: RootState) => selectAllCategories(state)); // NEW: Получаем все категории
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const persistorIsReady = useSelector((state: RootState) => state._persist?.rehydrated);

  useEffect(() => {
    // Ждем, пока redux-persist полностью восстановит состояние
    if (persistorIsReady) {
      // Загружаем пользователя, если он еще не загружен
      if (userStatus === 'idle') {
        console.log('Persistor ready. Fetching user data (if idle)...');
        dispatch(fetchUser(USER_ID.USER.ID));
      }

      // Загружаем категории только если они еще не загружены ИЛИ если состояние пустое.
      // Это условие предотвращает перезапись данных из localStorage данными из data.json.
      if (categories.length === 0 && categoryStatus === 'idle' && currentUser?.id) {
        console.log('Persistor ready. Categories are empty, fetching from data.json...');
        dispatch(fetchCategories(USER_ID.USER.ID));
      } else if (categories.length > 0) {
        console.log('Categories already loaded/rehydrated. Not fetching from data.json.');
      }
    }
  }, [userStatus, categoryStatus, categories.length, dispatch, persistorIsReady, currentUser?.id]);


  // Если persistor не готов, показываем индикатор загрузки
  if (!persistorIsReady) {
    return <div>Loading your financial data...</div>;
  }

  return (
    <>
      <GlobalStyle />
      <AppWrapper>
        <SidebarArea>
          <Sidebar />
        </SidebarArea>

        <MainContentGrid>
          <TopBalanceOverview>
            <BalanceOverview currentUser={currentUser} userStatus={userStatus} />
          </TopBalanceOverview>

          <AddNoteGridItem>
            <AddNote />
          </AddNoteGridItem>

          <HistoryGridItem>
            <History />
          </HistoryGridItem>

          <CategoriesListGridItem>
            <CategoriesList />
          </CategoriesListGridItem>

          <ChartGridItem>
            <CategoryExpenseChart />
          </ChartGridItem>
        </MainContentGrid>
      </AppWrapper>
    </>
  );
}

export default App;