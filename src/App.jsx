import React, { useState } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import Header from './components/common/Header';
import SortingVisualizer from './components/Sorting/SortingVisualizer';
import PathfindingVisualizer from './components/Pathfinding/PathfindingVisualizer';
import BacktrackingVisualizer from './components/Backtracking/BacktrackingVisualizer';
import './index.css';

function AppContent() {
  const [mode, setMode] = useState('sorting'); // 'sorting' | 'pathfinding' | 'backtracking'

  return (
    <div className="app-container">
      <Header mode={mode} setMode={setMode} />
      
      <main className="main-content">
        {mode === 'sorting' ? (
          <SortingVisualizer />
        ) : mode === 'pathfinding' ? (
          <PathfindingVisualizer />
        ) : (
          <BacktrackingVisualizer />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;
