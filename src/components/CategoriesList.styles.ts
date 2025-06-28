// src/components/CategoriesList.styles.ts
import styled from 'styled-components';
import { MessageContainer, ErrorMessage, LoadingMessage } from '../styles/SharedStyles'; // Import shared message styles

// Main container for the categories list card
export const CategoriesContainer = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  /* UPDATED: Удаляем margin и max-width, т.к. внешний CategoriesListGridItem (из AppLayout.styles.ts)
     уже задает размер и отступы в гриде и общие стили карточки.
     CategoriesContainer теперь будет заполнять свою ячейку грида. */
  /* margin: 40px auto; */
  /* max-width: 600px; */ 
  font-family: 'Inter', sans-serif;
  color: #333;
  display: flex; /* Для выстраивания заголовка, списка и кнопки в колонку */
  flex-direction: column;
  height: 100%; /* Чтобы контейнер занимал всю высоту своей грид-ячейки */
`;

export const CategoriesTitle = styled.h2`
  font-size: 1.8em;
  color: #333;
  margin-bottom: 25px;
  text-align: center;
`;

export const CategoryList = styled.ul`
  list-style: none; /* Remove default bullet points */
  padding: 0;
  margin: 0;
  
  /* КЛЮЧЕВЫЕ СТИЛИ ДЛЯ ГОРИЗОНТАЛЬНОГО ВЫСТРАИВАНИЯ */
  display: flex;   /* Активируем Flexbox */
  flex-wrap: wrap; /* Разрешаем элементам переноситься на новую строку, если не хватает места */
  gap: 15px;       /* Отступ между элементами по горизонтали и вертикали */
  
  flex-grow: 1; /* Позволяет списку занимать доступное пространство по высоте */
  overflow-y: auto; /* Добавляем прокрутку, если категорий очень много */
  margin-bottom: 20px; /* Отступ перед кнопкой */
`;

export const CategoryListItem = styled.li`
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px 20px;
  /* UPDATED: Удаляем margin-bottom, т.к. spacing теперь будет контролироваться через gap родителя (CategoryList) */
  /* margin-bottom: 10px; */ 
  
  display: flex;
  flex-direction: column; /* Сохраняем внутреннее содержимое категории в колонке */
  gap: 5px;
  transition: all 0.2s ease-in-out;

  /* Опционально: можно задать min-width или flex-basis, чтобы категории были примерно одинакового размера */
  flex-basis: calc(33.33% - 15px); /* Например, 3 категории в ряд с учетом gap */
  min-width: 180px; /* Минимальная ширина для каждой категории */

  &:hover {
    background-color: #f0f0f0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
`;

export const CategoryTitle = styled.strong`
  font-size: 1.1em;
  color: #6c63ff; /* Accent color for title */
`;

export const CategoryDescription = styled.span`
  font-size: 0.9em;
  color: #777;
`;

export const CategoryFinancials = styled.div`
  font-size: 0.9em;
  color: #555;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;

  span {
    font-weight: 500;
  }
`;

export const EmptyCategoriesMessage = styled.p`
  text-align: center;
  color: #777;
  padding: 20px;
  font-style: italic;
  flex-grow: 1; /* Позволяет сообщению занимать доступное пространство */
`;

// Re-export shared message components for convenience in CategoriesList.tsx
export { MessageContainer, ErrorMessage, LoadingMessage };