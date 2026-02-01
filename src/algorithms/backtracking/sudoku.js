export function solveSudoku(board) {
  const animations = [];
  const solvedBoard = board.map(row => [...row]);
  
  solve(solvedBoard, animations);
  return { animations, solvedBoard };
}

function solve(board, animations) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            animations.push({ type: 'place', row, col, val: num });

            if (solve(board, animations)) {
              return true;
            }

            board[row][col] = 0;
            animations.push({ type: 'remove', row, col });
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num && i !== col) return false;
    if (board[i][col] === num && i !== row) return false;
    
    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + i % 3;
    if (board[boxRow][boxCol] === num && (boxRow !== row || boxCol !== col)) return false;
  }
  return true;
}

export function generateSudoku() {
  const board = Array(9).fill().map(() => Array(9).fill(0));
  fillDiagonal(board);
  solveSudokuForGeneration(board);
  removeDigits(board);
  return board;
}

function fillDiagonal(board) {
  for (let i = 0; i < 9; i = i + 3) {
    fillBox(board, i, i);
  }
}

function fillBox(board, row, col) {
  let num;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        num = Math.floor(Math.random() * 9) + 1;
      } while (!isSafeInBox(board, row, col, num));
      board[row + i][col + j] = num;
    }
  }
}

function isSafeInBox(board, rowStart, colStart, num) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[rowStart + i][colStart + j] === num) {
        return false;
      }
    }
  }
  return true;
}

function solveSudokuForGeneration(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudokuForGeneration(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function removeDigits(board) {
  let count = 40; // Remove 40 numbers
  while (count !== 0) {
    let cellId = Math.floor(Math.random() * 81);
    let row = Math.floor(cellId / 9);
    let col = cellId % 9;
    if (board[row][col] !== 0) {
      count--;
      board[row][col] = 0;
    }
  }
}
