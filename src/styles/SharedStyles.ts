// src/styles/SharedStyles.ts
import styled from 'styled-components';

// Generic Button Style
export const StyledButton = styled.button`
  background: linear-gradient(135deg, #6c63ff, #8a2be2); /* Gradient background */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(108, 99, 255, 0.3); /* Soft shadow for button */
  min-width: 150px; /* Ensure a consistent minimum width */

  &:hover {
    background: linear-gradient(135deg, #8a2be2, #6c63ff); /* Reverse gradient on hover */
    box-shadow: 0 6px 15px rgba(108, 99, 255, 0.4);
    transform: translateY(-2px); /* Slight lift effect */
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(108, 99, 255, 0.2);
  }
`;

// Generic Message Container
export const MessageContainer = styled.div`
  text-align: center;
  padding: 20px;
  margin: 40px auto;
  max-width: 400px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  color: #555;
  font-family: 'Inter', sans-serif;
`;

// Specific Error Message Style
export const ErrorMessage = styled(MessageContainer)`
  background-color: #ffebeb;
  border: 1px solid #ff0000;
  color: #ff0000;
`;

// Specific Loading Message Style
export const LoadingMessage = styled(MessageContainer)`
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
`;