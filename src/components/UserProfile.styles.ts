// src/components/UserProfile.styles.ts
import styled from 'styled-components';
import { MessageContainer, ErrorMessage, LoadingMessage, StyledButton } from '../styles/SharedStyles'; // NEW: Import from SharedStyles

// Main container for the user profile card
export const ProfileCard = styled.div`
  background-color: #2c3e50; /* White background */
  padding: 10px;
  margin: 0px auto; /* Center the card and provide margin */
  max-width: 400px; /* Max width for the card */
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
  text-align: center;
  font-family: 'Inter', sans-serif; /* Use Inter font */
  color: #333; /* Darker text for readability */
`;

// Profile picture styling
export const ProfilePicture = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%; /* Make it round */
  object-fit: cover; /* Ensure image covers the area */
  border: 3px solid #6c63ff; /* Accent border color */
  margin-bottom: 0px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* Shadow for depth */
`;

// User name styling
export const UserName = styled.h2`
  font-size: 1em;
  color: #fff;
  margin-bottom: 8px;
`;

// User details styling (email, balance)
export const UserDetail = styled.p`
  font-size: 1em;
  color: #fff;
  margin-bottom: 5px;
`;

// Balance specific styling
export const BalanceDetail = styled(UserDetail)`
  font-size: 1em;
  font-weight: bold;
  color: #28a745; /* Green for balance */
  margin-top: 15px;
  margin-bottom: 25px;
`;

// Re-export shared components so UserProfile.tsx can import them directly if needed
export { MessageContainer, ErrorMessage, LoadingMessage, StyledButton };