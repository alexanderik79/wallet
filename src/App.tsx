// src/App.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserStatus, fetchUser } from './features/user/userSlice';
import { fetchCategories } from './features/category/categorySlice';
import { AppDispatch, RootState } from './app/store';

import { USER_ID } from './constants/userId'; 

import { GlobalStyle } from './styles/GlobalStyle';

// Import layout styled components (keep these as they are your grid containers)
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
import Sidebar from './components/Sidebar'; // Your existing Sidebar component
import BalanceOverview from './components/BalanceOverview'; // Your existing BalanceOverview component
import History from './components/History'; // Your existing History component
import CategoriesList from './components/CategoriesList'; // Your existing CategoriesList component
import AddNote from './components/AddNote'; // Your existing AddNote component
import CategoryExpenseChart from './components/CategoryExpenseChart'; // NEW: Import the chart component

function App() {
  const dispatch: AppDispatch = useDispatch();
  const userStatus = useSelector((state: RootState) => selectUserStatus(state));
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  // Fetch user on app load if not already loading or succeeded
  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUser(USER_ID.USER.ID)); // Ensure you call with a valid userId from db.json
      dispatch(fetchCategories(USER_ID.USER.ID));
    }
  }, [userStatus, dispatch]);

  return (
    <>
      {/* Global styles applied here. It does not render anything in the DOM itself. */}
      <GlobalStyle />
      <AppWrapper>
        {/* Left Sidebar Component - now wrapped by SidebarArea for layout */}
        <SidebarArea>
          <Sidebar /> {/* Your actual Sidebar component content goes here */}
        </SidebarArea>

        {/* Main Content Area (uses Grid internally) */}
        <MainContentGrid>
          {/* Balance Overview Section - wrapped by TopBalanceOverview for layout */}
          <TopBalanceOverview>
            <BalanceOverview currentUser={currentUser} userStatus={userStatus} />
          </TopBalanceOverview>

          {/* Add Note Section - wrapped by AddNoteGridItem for layout */}
          <AddNoteGridItem>
            <AddNote />
          </AddNoteGridItem>

          {/* History Transactions Section - wrapped by HistoryGridItem for layout */}
          <HistoryGridItem>
            <History />
          </HistoryGridItem>

          {/* Categories List Section - wrapped by CategoriesListGridItem for layout */}
          <CategoriesListGridItem>
            <CategoriesList />
          </CategoriesListGridItem>

          {/* NEW: Chart Grid Item - spans full width at the bottom */}
          <ChartGridItem>
            <CategoryExpenseChart />
          </ChartGridItem>
        </MainContentGrid>
      </AppWrapper>
    </>
  );
}

export default App;