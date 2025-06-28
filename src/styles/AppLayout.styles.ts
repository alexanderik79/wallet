// src/styles/AppLayout.styles.ts
import styled from 'styled-components';

export const AppWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(150px, 220px) 1fr;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Inter', sans-serif;
  color: #333;
`;

export const SidebarArea = styled.div`
  background-color: #2c3e50;
  color: white;
  padding: 2px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto; 
`;

export const SidebarHeader = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 0px;
  text-align: center;
  color: #6c63ff;
`;

export const SidebarNav = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    margin-bottom: 15px;
  }
  a {
    color: white;
    text-decoration: none;
    font-size: 1.1em;
    padding: 10px 15px;
    display: block;
    border-radius: 8px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #3a5068;
    }
  }
`;

export const MainContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); 
  /* UPDATED: Первый ряд будет по высоте содержимого (auto), второй займет оставшееся пространство (1fr) */
  grid-template-rows: auto 1fr; 
  gap: 25px;
  padding: 25px;
  overflow-y: auto;
`;

export const TopBalanceOverview = styled.div`
  grid-column: 1; 
  grid-row: 1;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 30px;
  text-align: center;
  color: #333;
  font-size: 1.5em;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
    margin: 0;
    font-size: 0.8em;
    color: #777;
  }

  span {
    font-size: 2.5em;
    font-weight: bold;
    color: #28a745;
    margin-top: 10px;
  }
`;

export const AddNoteGridItem = styled.div`
  grid-column: 2 / span 3;
  grid-row: 1;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CategoriesListGridItem = styled.div`
  grid-column: 1 / span 4;
  grid-row: 2; /* Теперь это второй ряд */
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 30px;
`;

export const HistoryGridItem = styled.div`
  grid-column: 5;
  grid-row: 1 / span 2;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 30px;
`;