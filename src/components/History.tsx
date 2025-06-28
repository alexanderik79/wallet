// src/components/History.tsx
import React from 'react';
import { HistoryGridItem } from '../styles/AppLayout.styles'; // Import its specific style

function History() {
  return (
    <HistoryGridItem>
      <h3>Transaction History</h3>
      <p>View your past transactions here. Coming soon!</p>
      {/* Add actual history content here later */}
    </HistoryGridItem>
  );
}

export default History;