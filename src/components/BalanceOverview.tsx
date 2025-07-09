// src/components/BalanceOverview.tsx
import React from 'react';
import { TopBalanceOverview } from '../styles/AppLayout.styles'; // Import its specific style
import { User } from '../types'; // Import User type

interface BalanceOverviewProps {
  currentUser: User | null;
  userStatus: string; // 'idle' | 'loading' | 'succeeded' | 'failed'
}

function BalanceOverview({ currentUser, userStatus }: BalanceOverviewProps) {
  return (
    <TopBalanceOverview>
      <p>Current Balance</p>
      {userStatus === 'succeeded' && currentUser ? (
        <span>${currentUser.startBalance.toFixed(2)}</span>
      ) : (
        <span>$0.00</span> // Placeholder if user not loaded or failed
      )}
    </TopBalanceOverview>
  );
}

export default BalanceOverview;