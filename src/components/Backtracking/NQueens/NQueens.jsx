import React, { useState, useEffect, useRef } from 'react';
import { solveNQueens } from '../../../algorithms/backtracking/nQueens';

const NQueens = ({ isRunning, setIsRunning }) => {
  const [n, setN] = useState(8); // Default 8x8 board
  const [board, setBoard] = useState([]);
  const delayRef = useRef(100); // Animation delay in ms

  useEffect(() => {
    resetBoard(n);
  }, [n]);

  const resetBoard = (size) => {
    if (isRunning) return;
    const newBoard = Array(size).fill().map(() => Array(size).fill({
      hasQueen: false,
      isTrying: false,
      isInvalid: false
    }));
    setBoard(newBoard);
  };

  const handleNChange = (e) => {
    const val = parseInt(e.target.value);
    setN(val);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const visualize = async () => {
    setIsRunning(true);
    resetBoard(n);
    
    // We can't use the simple returned animations array directly with simple timeouts 
    // because we want to update React state smoothly.
    // Instead, we'll run a slightly modified version of the solver or 
    // process the pre-calculated animations with async/await delays.
    
    const { animations } = solveNQueens(n);
    
    for (let i = 0; i < animations.length; i++) {
        const { type, row, col } = animations[i];
        
        setBoard(prev => {
            const newBoard = prev.map(r => r.map(c => ({...c, isTrying: false, isInvalid: false})));
            
            if (type === 'try') {
                newBoard[row][col].isTrying = true;
            } else if (type === 'place') {
                newBoard[row][col].hasQueen = true;
            } else if (type === 'remove') {
                newBoard[row][col].hasQueen = false;
            } else if (type === 'invalid') {
                newBoard[row][col].isInvalid = true;
            }
            
            return newBoard;
        });

        await delay(delayRef.current);
    }
    
    // Clear final highlights
    setBoard(prev => prev.map(r => r.map(c => ({...c, isTrying: false, isInvalid: false}))));
    setIsRunning(false);
  };

  return (
    <>
      <div className="controls-bar">
        <div className="algo-select-group">
          <label>
            Board Size (N)
            <select value={n} onChange={handleNChange} disabled={isRunning}>
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="8">8</option>
              <option value="10">10</option>
            </select>
          </label>
           <label>
            Speed (ms)
            <select 
              defaultValue="100" 
              onChange={(e) => delayRef.current = parseInt(e.target.value)}
              disabled={isRunning}
            >
              <option value="500">Slow (500ms)</option>
              <option value="100">Normal (100ms)</option>
              <option value="10">Fast (10ms)</option>
            </select>
          </label>
        </div>
        <div className="buttons-group">
          <button className="control-btn primary" onClick={visualize} disabled={isRunning}>
            Visualize
          </button>
           <button className="control-btn secondary" onClick={() => resetBoard(n)} disabled={isRunning}>
            Clear
          </button>
        </div>
      </div>

      <div className="visualization-area">
        <div 
          className="n-queens-board"
          style={{ gridTemplateColumns: `repeat(${n}, 50px)` }}
        >
          {board.map((row, rowIdx) => (
            row.map((cell, colIdx) => {
              const isBlack = (rowIdx + colIdx) % 2 === 1;
              let cellClass = 'chess-cell';
              if (cell.isInvalid) cellClass += ' cell-invalid';
              else if (cell.isTrying) cellClass += ' cell-trying';
              else cellClass += isBlack ? ' cell-black' : ' cell-white';

              return (
                <div key={`${rowIdx}-${colIdx}`} className={cellClass}>
                  {cell.hasQueen && '👑'}
                </div>
              );
            })
          ))}
        </div>
      </div>
    </>
  );
};

export default NQueens;
