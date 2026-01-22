// Recursive Division Maze Generation
// Creates a maze by recursively dividing the grid with walls

export function recursiveDivisionMaze(grid, startNode, finishNode) {
  const walls = [];
  addOuterWalls(grid, walls);
  addInnerWalls(grid, walls, true, 1, grid.length - 2, 1, grid[0].length - 2, startNode, finishNode);
  return walls;
}

function addOuterWalls(grid, walls) {
  for (let i = 0; i < grid.length; i++) {
    if (i === 0 || i === grid.length - 1) {
      for (let j = 0; j < grid[0].length; j++) {
        walls.push([i, j]);
      }
    } else {
      walls.push([i, 0]);
      walls.push([i, grid[0].length - 1]);
    }
  }
}

function addInnerWalls(grid, walls, isHorizontal, minRow, maxRow, minCol, maxCol, startNode, finishNode) {
  if (isHorizontal) {
    if (maxRow - minRow < 2) return;
    
    const possibleRows = [];
    for (let i = minRow + 1; i < maxRow; i += 2) {
      possibleRows.push(i);
    }
    if (possibleRows.length === 0) return;
    
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const currentRow = possibleRows[randomRowIndex];
    
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
    
    const possibleCols = [];
    for (let i = minCol + 1; i < maxCol; i += 2) {
      possibleCols.push(i);
    }
    if (possibleCols.length === 0) return;
    
    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const currentCol = possibleCols[randomColIndex];
    
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
