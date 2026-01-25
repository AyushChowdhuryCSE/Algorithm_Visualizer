// Recursive Division Maze Generation
// Creates a maze by recursively dividing the grid with walls

export function recursiveDivisionMaze(grid, startNode, finishNode) {
  const walls = [];
  addOuterWalls(grid, walls, startNode, finishNode);
  addInnerWalls(grid, walls, true, 1, grid.length - 2, 1, grid[0].length - 2, startNode, finishNode);
  
  // Filter duplicates to prevent "double-toggle" issue in visualizer
  const uniqueWalls = [];
  const wallSet = new Set();
  
  for (const [row, col] of walls) {
    const key = `${row},${col}`;
    if (!wallSet.has(key)) {
      wallSet.add(key);
      uniqueWalls.push([row, col]);
    }
  }
  
  return uniqueWalls;
}

function addOuterWalls(grid, walls, startNode, finishNode) {
  for (let i = 0; i < grid.length; i++) {
    if (i === 0 || i === grid.length - 1) {
      for (let j = 0; j < grid[0].length; j++) {
        if (!isStartOrFinish(i, j, startNode, finishNode)) {
          walls.push([i, j]);
        }
      }
    } else {
      if (!isStartOrFinish(i, 0, startNode, finishNode)) {
        walls.push([i, 0]);
      }
      if (!isStartOrFinish(i, grid[0].length - 1, startNode, finishNode)) {
        walls.push([i, grid[0].length - 1]);
      }
    }
  }
}

function addInnerWalls(grid, walls, isHorizontal, minRow, maxRow, minCol, maxCol, startNode, finishNode) {
  if (isHorizontal) {
    if (maxRow - minRow < 2) return;
    
    // Choose a random even row for the wall
    let possibleRows = [];
    for (let i = minRow + 1; i < maxRow; i += 2) {
      possibleRows.push(i);
    }
    
    // CRITICAL FIX: Remove rows that align with Start or Finish nodes
    // to prevent walls from intersecting exactly at the node and trapping it.
    possibleRows = possibleRows.filter(row => row !== startNode.row && row !== finishNode.row);
    
    if (possibleRows.length === 0) return;
    
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const currentRow = possibleRows[randomRowIndex];
    
    // Choose a random odd col for the hole
    const possibleCols = [];
    for (let i = minCol; i <= maxCol; i += 2) {
      possibleCols.push(i);
    }
    if (possibleCols.length === 0) return;
    
    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const colHole = possibleCols[randomColIndex];
    
    for (let i = minCol; i <= maxCol; i++) {
      if (i === colHole) continue;
      if (isStartOrFinish(currentRow, i, startNode, finishNode)) continue;
      walls.push([currentRow, i]);
    }
    
    addInnerWalls(grid, walls, !isHorizontal, minRow, currentRow - 1, minCol, maxCol, startNode, finishNode);
    addInnerWalls(grid, walls, !isHorizontal, currentRow + 1, maxRow, minCol, maxCol, startNode, finishNode);
  } else {
    if (maxCol - minCol < 2) return;
    
    // Choose a random even col for the wall
    let possibleCols = [];
    for (let i = minCol + 1; i < maxCol; i += 2) {
      possibleCols.push(i);
    }
    
    // CRITICAL FIX: Remove cols that align with Start or Finish nodes
    possibleCols = possibleCols.filter(col => col !== startNode.col && col !== finishNode.col);
    
    if (possibleCols.length === 0) return;
    
    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const currentCol = possibleCols[randomColIndex];
    
    // Choose a random odd row for the hole
    const possibleRows = [];
    for (let i = minRow; i <= maxRow; i += 2) {
      possibleRows.push(i);
    }
    if (possibleRows.length === 0) return;
    
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const rowHole = possibleRows[randomRowIndex];
    
    for (let i = minRow; i <= maxRow; i++) {
      if (i === rowHole) continue;
      if (isStartOrFinish(i, currentCol, startNode, finishNode)) continue;
      walls.push([i, currentCol]);
    }
    
    addInnerWalls(grid, walls, !isHorizontal, minRow, maxRow, minCol, currentCol - 1, startNode, finishNode);
    addInnerWalls(grid, walls, !isHorizontal, minRow, maxRow, currentCol + 1, maxCol, startNode, finishNode);
  }
}

function isStartOrFinish(row, col, startNode, finishNode) {
  return (row === startNode.row && col === startNode.col) || 
         (row === finishNode.row && col === finishNode.col);
}
