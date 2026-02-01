export function solveNQueens(n) {
  const animations = [];
  const board = Array(n).fill().map(() => Array(n).fill(0));
  
  solve(board, 0, n, animations);
  return { animations, board };
}

function solve(board, col, n, animations) {
  if (col >= n) {
    return true;
  }

  for (let row = 0; row < n; row++) {
    // 1. Try placing queen
    animations.push({ type: 'try', row, col });
    
    if (isSafe(board, row, col, n)) {
      // 2. Place valid queen
      board[row][col] = 1;
      animations.push({ type: 'place', row, col });

      if (solve(board, col + 1, n, animations)) {
        return true;
      }

      // 3. Backtrack
      board[row][col] = 0;
      animations.push({ type: 'remove', row, col });
    } else {
       // 4. Invalid placement attempted
       animations.push({ type: 'invalid', row, col });
    }
  }

  return false;
}

function isSafe(board, row, col, n) {
  // Check this row on left side
  for (let i = 0; i < col; i++) {
    if (board[row][i]) return false;
  }

  // Check upper diagonal on left side
  for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j]) return false;
  }

  // Check lower diagonal on left side
  for (let i = row, j = col; j >= 0 && i < n; i++, j--) {
    if (board[i][j]) return false;
  }

  return true;
}
