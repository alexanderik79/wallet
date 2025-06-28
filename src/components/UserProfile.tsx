// src/components/UserProfile.tsx
import React, { useEffect } from 'react'; // Import useEffect
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentUser,
  selectUserStatus,
  selectUserError,
  fetchUser, // Import the async thunk for fetching user
  clearUser
} from '../features/user/userSlice';
import { RootState, AppDispatch } from '../app/store';
import { User } from '../types';

function UserProfile() {
  const currentUser: User | null = useSelector((state: RootState) => selectCurrentUser(state));
  const userStatus = useSelector((state: RootState) => selectUserStatus(state));
  const userError = useSelector((state: RootState) => selectUserError(state));
  const dispatch: AppDispatch = useDispatch();

  // Dispatch fetchUser thunk when the component mounts
  useEffect(() => {
    // Only fetch if status is 'idle' to prevent multiple fetches on re-renders
    if (userStatus === 'idle') {
      dispatch(fetchUser());
    }
  }, [userStatus, dispatch]); // Depend on userStatus and dispatch

  // Handler for logout
  const handleLogout = () => {
    dispatch(clearUser());
  };

  if (userStatus === 'loading') {
    return <div>Loading user data...</div>;
  }

  if (userStatus === 'failed' && userError) {
    return <div>Error loading user data: {userError}</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h2>User Profile</h2>
      {currentUser ? (
        <div>
          <p><strong>ID:</strong> {currentUser.id}</p>
          <p><strong>Name:</strong> {currentUser.name}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Balance:</strong> ${currentUser.startBalance.toFixed(2)}</p>
          {currentUser.photo && <img src={currentUser.photo} alt="User" style={{ width: '50px', height: '50px', borderRadius: '50px' }} />}
          <br/>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <div>
          <p>No user logged in or user data failed to load.</p>
          {/* We've removed the dummy login button as user is now loaded from file */}
          {/* You might add a re-fetch button here if needed */}
        </div>
      )}
    </div>
  );
}

export default UserProfile;