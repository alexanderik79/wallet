// src/App.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserStatus, fetchUser } from './features/user/userSlice';
import { AppDispatch, RootState } from './app/store';

// Import new components
import Sidebar from './components/Sidebar';
import BalanceOverview from './components/BalanceOverview';
import History from './components/History';
import CategoriesList from './components/CategoriesList';
import AddNote from './components/AddNote';

// Import layout styled components
import {
  AppWrapper,
  MainContentGrid,
  CategoriesListGridItem,
  HistoryGridItem,
  AddNoteGridItem,
  // QuickStatsGridItem - REMOVED, as it's not needed
} from './styles/AppLayout.styles';

function App() {
  const dispatch: AppDispatch = useDispatch();
  const userStatus = useSelector((state: RootState) => selectUserStatus(state));
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  // Fetch user on app load if not already loading or succeeded
  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUser());
    }
  }, [userStatus, dispatch]);

  return (
    <AppWrapper>
      {/* Left Sidebar Component */}
      <Sidebar />

      {/* Main Content Area (uses Grid internally) */}
      <MainContentGrid>
        {/* Balance Overview Section - UPDATED PLACEMENT */}
        <BalanceOverview currentUser={currentUser} userStatus={userStatus} />

        {/* Add Note Section - UPDATED PLACEMENT */}
        <AddNoteGridItem>
          <AddNote />
        </AddNoteGridItem>

        {/* History Transactions Section - UPDATED PLACEMENT */}
        <HistoryGridItem>
          <History />
        </HistoryGridItem>

        {/* Categories List Section - UPDATED PLACEMENT */}
        <CategoriesListGridItem>
          <CategoriesList />
        </CategoriesListGridItem>
      </MainContentGrid>
    </AppWrapper>
  );
}

export default App;