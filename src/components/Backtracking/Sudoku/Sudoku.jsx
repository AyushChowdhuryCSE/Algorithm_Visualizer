import React, { useState, useEffect, useRef } from 'react';
import { solveSudoku, generateSudoku } from '../../../algorithms/backtracking/sudoku';

const Sudoku = ({ isRunning, setIsRunning }) => {
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]); // To track fixed numbers
  const delayRef = useRef(10); // Faster default speed for Sudoku

  useEffect(() => {
    createNewPuzzle();
  }, []);

  const createNewPuzzle = () => {
    if (isRunning) return;
    const newBoard = generateSudoku();
    // Copy for initial state to know which are fixed
    const initial = newBoard.map(row => [...row]);
    
    setBoard(newBoard);
    setInitialBoard(initial);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const visualize = async () => {
    setIsRunning(true);
    
    // We need to pass a copy of the board because solveSudoku modifies it in place
    // But we also need the animations
    const boardCopy = board.map(row => [...row]);
    const { animations } = solveSudoku(boardCopy);
    
    for (let i = 0; i < animations.length; i++) {
       const { type, row, col, val } = animations[i];
       
       setBoard(prev => {
         const newBoard = prev.map(row => [...row]);
         if (type === 'place') {
           newBoard[row][col] = val;
         } else if (type === 'remove') {
           newBoard[row][col] = 0;
         }
         return newBoard;
       });

       await delay(delayRef.current);
    }
    
    setIsRunning(false);
  };

  const clearBoard = () => {
      // Revert to initial state
      setBoard(initialBoard.map(row => [...row]));
  };

  return (
    <>
      <div className="controls-bar">
         <div className="algo-select-group">
            <label>
            Speed (ms)
            <select 
              defaultValue="10" 
              onChange={(e) => delayRef.current = parseInt(e.target.value)}
              disabled={isRunning}
            >
              <option value="100">Slow (100ms)</option>
              <option value="10">Normal (10ms)</option>
              <option value="1">Fast (1ms)</option>
            </select>
          </label>
         </div>
        <div className="buttons-group">
          <button className="control-btn primary" onClick={visualize} disabled={isRunning}>
            Solve Sudoku
          </button>
           <button className="control-btn secondary" onClick={createNewPuzzle} disabled={isRunning}>
            New Puzzle
          </button>
          <button className="control-btn secondary" onClick={clearBoard} disabled={isRunning}>
            Reset
          </button>
        </div>
      </div>

      <div className="visualization-area">
        <div className="sudoku-grid">
          {board.map((row, rowIdx) => (
            row.map((val, colIdx) => {
              const isFixed = initialBoard[rowIdx] && initialBoard[rowIdx][colIdx] !== 0;
              const isZero = val === 0;
              
              let cellClass = 'sudoku-cell';
              if (isFixed) cellClass += ' fixed';
              else if (!isZero) cellClass += ' solving';

              return (
                <div key={`${rowIdx}-${colIdx}`} className={cellClass}>
                  {isZero ? '' : val}
                </div>
              );
            })
          ))}
        </div>
      </div>
    </>
  );
};

export default Sudoku;
