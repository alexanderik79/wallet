// src/components/UserProfile.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectCurrentUser,
  selectUserStatus,
  selectUserError,
  fetchUser,
  clearUser
} from '../features/user/userSlice';
import { RootState, AppDispatch } from '../app/store';
import { User } from '../types';

// --- Import styled components from the dedicated style file ---
import {
  ProfileCard,
  ProfilePicture,
  UserName,
  UserDetail,
  BalanceDetail,
  StyledButton, // Now imported from UserProfile.styles which re-exports from SharedStyles
  MessageContainer, // Now imported from UserProfile.styles which re-exports from SharedStyles
  ErrorMessage,   // Now imported from UserProfile.styles which re-exports from SharedStyles
  LoadingMessage  // Now imported from UserProfile.styles which re-exports from SharedStyles
} from './UserProfile.styles';

// --- UserProfile Component ---
function UserProfile() {
  const currentUser: User | null = useSelector((state: RootState) => selectCurrentUser(state));
  const userStatus = useSelector((state: RootState) => selectUserStatus(state));
  const userError = useSelector((state: RootState) => selectUserError(state));
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    // Only fetch if status is 'idle' to prevent multiple fetches on re-renders
    if (userStatus === 'idle') {
      dispatch(fetchUser("user-uuid-2"))
    }
  }, [userStatus, dispatch]);

  const handleLogout = () => {
    dispatch(clearUser());
  };

  if (userStatus === 'loading') {
    return <LoadingMessage>Loading user data...</LoadingMessage>;
  }

  if (userStatus === 'failed') {
    return <ErrorMessage>Error loading user data: {userError || 'Unknown error'}</ErrorMessage>;
  }

  return (
    <ProfileCard>
      {currentUser ? (
        <>
          {currentUser.photo && <ProfilePicture src={currentUser.photo} alt="User Profile" />}
          <UserName>{currentUser.name}</UserName>
          <UserDetail>{currentUser.email}</UserDetail>
          <BalanceDetail>Balance: ${currentUser.startBalance.toFixed(2)}</BalanceDetail>
          <StyledButton onClick={handleLogout}>Log Out</StyledButton>
        </>
      ) : (
        <MessageContainer>
          <p>No user logged in or user data failed to load.</p>
          <p>Please check if your `json-server` is running and `db.json` is configured correctly.</p>
        </MessageContainer>
      )}
    </ProfileCard>
  );
}

export default UserProfile;