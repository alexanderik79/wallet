import React, { useEffect, useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { useDispatch, useSelector } from 'react-redux';
import { selectUserStatus, fetchUser } from './features/user/userSlice';
import { fetchCategories } from './features/category/categorySlice';
import { AppDispatch, RootState } from './app/store';

import { USER_ID } from './constants/userId'; 
import { GlobalStyle } from './styles/GlobalStyle';

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

import Sidebar from './components/Sidebar';
import BalanceOverview from './components/BalanceOverview';
import History from './components/History';
import CategoriesList from './components/CategoriesList';
import AddNote from './components/AddNote';
import CategoryExpenseChart from './components/CategoryExpenseChart';

function App() {
  const dispatch: AppDispatch = useDispatch();
  const userStatus = useSelector((state: RootState) => selectUserStatus(state));
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUser(USER_ID.USER.ID));
      dispatch(fetchCategories(USER_ID.USER.ID));
    }
  }, [userStatus, dispatch]);

  // useCallback, чтобы не создавать новую функцию на каждый рендер
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Не сбрасываем transactionToEdit сразу, чтобы избежать лишнего рендера
  }, []);

  // Очистим transactionToEdit уже после анимации закрытия модалки
  const handleExited = () => {
    setTransactionToEdit(null);
  };

  const handleEditTransaction = useCallback((transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  }, []);

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
            <AddNote initialData={transactionToEdit} onClose={handleCloseModal} />
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

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent dividers>
          <AddNote initialData={transactionToEdit} onClose={handleCloseModal} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default React.memo(App);
