// src/styles/AppLayout.styles.ts
import styled from 'styled-components';

export const AppWrapper = styled.div`
  display: grid;
  /* Возвращаем более безопасные значения для сайдбара.
     Это обеспечивает, что сайдбар не будет слишком узким,
     чтобы не наезжать на основной контент. */
  grid-template-columns: minmax(180px, 250px) 1fr; /* Скорее всего, это причина наложения. Вернем адекватные размеры */
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Inter', sans-serif;
  color: #333;
`;

export const SidebarArea = styled.div`
  background-color: #2c3e50;
  color: white;
  padding: 15px; /* Сохраняем уменьшенный padding */
  display: flex;
  flex-direction: column;
  box-shadow: 1px 0 8px rgba(0, 0, 0, 0.08); /* Сохраняем уменьшенную тень */
  position: sticky;
  top: 0;
  align-self: start;
  height: 100vh;
`;

export const SidebarHeader = styled.div`
  font-size: 1.1em; /* Сохраняем уменьшенный шрифт */
  font-weight: bold;
  margin-bottom: 15px; /* Сохраняем уменьшенный отступ */
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
    margin-bottom: 10px; /* Сохраняем уменьшенный отступ */
  }
  a {
    color: white;
    text-decoration: none;
    font-size: 1em; /* Сохраняем уменьшенный шрифт */
    padding: 8px 12px; /* Сохраняем уменьшенный padding */
    display: block;
    border-radius: 6px; /* Сохраняем уменьшенное скругление */
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #3a5068;
    }
  }
`;

export const MainContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 12px; /* Уменьшаем gap еще немного */
  padding: 12px; /* Уменьшаем общий padding вокруг грида еще немного */
`;

export const TopBalanceOverview = styled.div`
  grid-column: 1;
  grid-row: 1;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); /* Меньшая тень */
  padding: 18px; /* Уменьшаем padding */
  text-align: center;
  color: #333;
  font-size: 1.2em; /* Слегка уменьшим основной размер шрифта */
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
    margin: 0;
    font-size: 0.75em; /* Уменьшаем шрифт */
    color: #777;
  }

  span {
    font-size: 0.85em; /* Уменьшаем шрифт */
    font-weight: bold;
    color: #28a745;
    margin-top: 6px; /* Уменьшаем отступ */
  }
`;

export const AddNoteGridItem = styled.div`
  grid-column: 2 / span 3;
  grid-row: 1;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* Padding здесь не нужен, т.к. его уже обрабатывает AddNoteContainer */
`;

export const CategoriesListGridItem = styled.div`
  grid-column: 1 / span 4;
  grid-row: 2;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 18px; /* Уменьшаем padding */
`;

export const HistoryGridItem = styled.div`
  grid-column: 5;
  grid-row: 1 / span 2;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 18px; /* Уменьшаем padding */
`;

export const ChartGridItem = styled.div`
  grid-column: 1 / span 5;
  grid-row: 3;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 18px; /* Уменьшаем padding */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;