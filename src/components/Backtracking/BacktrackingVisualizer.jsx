import React, { useState } from 'react';
import NQueens from './NQueens/NQueens';
import Sudoku from './Sudoku/Sudoku';
import './Backtracking.css';

const BacktrackingVisualizer = () => {
  const [puzzle, setPuzzle] = useState('nqueens'); // 'nqueens' | 'sudoku'
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="backtracking-container">
      <div className="mode-select-area" style={{ padding: '1rem 2rem', borderBottom: '1px solid #eee' }}>
          <label style={{ marginRight: '1rem', fontWeight: 'bold' }}>Select Puzzle:</label>
          <select 
            value={puzzle} 
            onChange={(e) => setPuzzle(e.target.value)}
            disabled={isRunning}
            style={{ padding: '5px' }}
          >
            <option value="nqueens">N-Queens</option>
            <option value="sudoku">Sudoku</option>
          </select>
      </div>

      {puzzle === 'nqueens' ? (
        <NQueens isRunning={isRunning} setIsRunning={setIsRunning} />
      ) : (
        <Sudoku isRunning={isRunning} setIsRunning={setIsRunning} />
      )}
    </div>
  );
};

export default BacktrackingVisualizer;
