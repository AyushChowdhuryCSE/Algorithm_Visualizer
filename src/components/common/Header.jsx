import React from 'react';
import { Play, Square, Settings } from 'lucide-react';
import './Header.css';

const Header = ({ mode, setMode }) => {
  return (
    <header className="app-header">
      <div className="logo-section">
        <h1 className="title">Algo<span className="highlight">Visualizer</span></h1>
      </div>
      
      <nav className="nav-section">
        <button 
          className={`nav-btn ${mode === 'sorting' ? 'active' : ''}`}
          onClick={() => setMode('sorting')}
        >
          Sorting
        </button>
        <button 
          className={`nav-btn ${mode === 'pathfinding' ? 'active' : ''}`}
          onClick={() => setMode('pathfinding')}
        >
          Pathfinding
        </button>
        <button 
          className={`nav-btn ${mode === 'backtracking' ? 'active' : ''}`}
          onClick={() => setMode('backtracking')}
        >
          Backtracking
        </button>
      </nav>

      <div className="actions-section">
        {/* Placeholder for global actions */}
      </div>
    </header>
  );
};

export default Header;
