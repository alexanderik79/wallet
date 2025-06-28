// src/components/Sidebar.tsx
import React from 'react';
import UserProfile from './UserProfile'; // UserProfile will be part of the sidebar
import {
  SidebarArea,
  SidebarHeader,
  SidebarNav
} from '../styles/AppLayout.styles'; // Import sidebar styles

function Sidebar() {
  return (
    <SidebarArea>
      <SidebarHeader>Wallet App</SidebarHeader>
      {/* UserProfile is now explicitly placed inside the Sidebar */}
      <UserProfile /> 
      <SidebarNav>
        <ul>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Transactions</a></li>
          <li><a href="#">Reports</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </SidebarNav>
      {/* Potentially add other sidebar specific content here */}
    </SidebarArea>
  );
}

export default Sidebar;