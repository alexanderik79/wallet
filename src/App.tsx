// src/App.tsx
// import './App.css'; // Keep your general App.css if you have one
import UserProfile from './components/UserProfile';
import CategoriesList from './components/CategoriesList'; // Import your new CategoriesList component
// import HistoryTransactions from './components/HistoryTransactions'; // You'll create this later

function App() {
  return (
    <div className="app-container">
      <h1>Wallet!</h1>
      <hr />
      <UserProfile /> {/* Your User Profile component */}
      <hr />
      <h2>Categories Section</h2>
      <CategoriesList /> {/* Your Categories List component */}
      <hr />
      <h2>History Section (To be implemented)</h2>
      {/* <HistoryTransactions /> */}
    </div>
  );
}

export default App;