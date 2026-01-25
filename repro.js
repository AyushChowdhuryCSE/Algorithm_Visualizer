const recursiveDivisionMaze = (grid, startNode, finishNode) => {
  const walls = [];
  addOuterWalls(grid, walls, startNode, finishNode);
  addInnerWalls(grid, walls, true, 1, grid.length - 2, 1, grid[0].length - 2, startNode, finishNode);
  return walls;
};

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
    possibleRows = possibleRows.filter(row => row !== startNode.row && row !== finishNode.row);
    
    if (possibleRows.length === 0) return;
    
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const currentRow = possibleRows[randomRowIndex];
    
    if (currentRow === 10) {
        console.log("CRITICAL ERROR: Selected Row 10 despite filter!");
        console.log("possibleRows before:", possibleRows.concat([10])); // rough check
        console.log("startNode.row:", startNode.row);
    }
    
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
  return (
    (row === startNode.row && col === startNode.col) ||
    (row === finishNode.row && col === finishNode.col)
  );
}

// Minimal Dijkstra
function dijkstra(grid, startNode, finishNode) {
  const visited = new Set();
  const queue = [];
  startNode.distance = 0;
  queue.push(startNode);

  // Sort queue by distance (naive prio queue)

  while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance);
    const node = queue.shift();

    if (node.isWall) continue;
    if (node.distance === Infinity) return false; // Stuck
    if (visited.has(node)) continue;

    visited.add(node);
    if (node === finishNode) return true;

    const neighbors = getNeighbors(node, grid);
    for (const n of neighbors) {
      if (!visited.has(n) && !n.isWall) {
        if (node.distance + 1 < n.distance) {
          n.distance = node.distance + 1;
          queue.push(n);
        }
      }
    }
  }
  return false;
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;
  const deltas = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  for (const [dr, dc] of deltas) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
      neighbors.push(grid[r][c]);
    }
  }
  return neighbors;
}

// Test Body
let failures = 0;
let total = 100;

for (let iter = 0; iter < total; iter++) {
  // 1. Init Grid
  const ROWS = 20;
  const COLS = 50;
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      row.push({
        row: r,
        col: c,
        isWall: false,
        isStart: false,
        isFinish: false,
        distance: Infinity,
      });
    }
    grid.push(row);
  }

  const startNode = grid[10][5];
  startNode.isStart = true;
  const finishNode = grid[10][45];
  finishNode.isFinish = true;

  // 2. Generate Maze
  const wallCoords = recursiveDivisionMaze(grid, startNode, finishNode);

  // 3. Apply Walls (mimic toggling)
  // Note: Visualizer toggles. Here we just set = true.
  // NOTE CRITICAL: Visualizer toggles! recursiveDivisionMaze might return duplicate coords.
  // If it returns duplicate coords, toggle twice -> wall REMOVED.
  // Let's emulate toggling exactly.

    // Need to verify if duplicates exist.
    const wallMap = new Map(); // key "r,c" -> count
    let duplicates = 0;
    
    for (const [r, c] of wallCoords) {
        const key = `${r},${c}`;
        const current = wallMap.get(key) || 0;
        if (current > 0) duplicates++;
        wallMap.set(key, current + 1);
        
        // Emulate toggle
        grid[r][c].isWall = !grid[r][c].isWall;
    }

    if (duplicates > 0) {
        console.log("Found duplicates:", duplicates);
        failures++;
    }

    // Verify start/finish not overwritten
    if (grid[10][5].isWall) {
        console.log("Start became wall!");
        failures++;
    }
    if (grid[10][45].isWall) {
        console.log("Finish became wall!");
        failures++;
    }

    // Verify walls do not intersect Start/Finish rows/cols
    // Start is at (10, 5), Finish is at (10, 45).
    // So Row 10 should have NO walls outside of boundaries?
    // Actually, 'addInnerWalls' segments.
    // If a horizontal wall is on Row 10, it's BAD.
    // If a vertical wall is on Col 5 or 45, it's BAD.
    // Let's check 'uniqueWalls' (the raw coords) returned by function.
    // But here 'wallCoords' is the return value.
    
    // Verify walls do not intersect Start/Finish rows/cols (Line Alignment check)
    // Only flag if HIGHLY suspicious (like covering 80% of the row/col).
    // But mainly focus on connectivity.
    
    let wallsOnRow10 = 0;
    let wallsOnCol5 = 0;
    
    for (const [r, c] of wallCoords) {
        if (r === 10) wallsOnRow10++;
        if (c === 5) wallsOnCol5++;
    }
    
    // Warn if dense walls
    if (wallsOnRow10 > 30) {
        console.log(`Warning: Dense walls on Row 10: ${wallsOnRow10}`);
    }
    if (wallsOnCol5 > 15) {
        console.log(`Warning: Dense walls on Col 5: ${wallsOnCol5}`);
    }

  // 4. Run Dijkstra
  const reachable = dijkstra(grid, startNode, finishNode);
  if (!reachable) {
    console.log("CONNECTIVITY FAILURE!");
    failures++;
  }
}

console.log(`Connectivity Failures: ${failures}/${total}`);
