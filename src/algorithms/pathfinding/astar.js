// A* Search Algorithm
// Uses a heuristic (Manhattan distance) to find the shortest path more efficiently

export function astar(grid, startNode, finishNode) {
  const openSet = [];
  const closedSet = [];
  startNode.g = 0;
  startNode.h = heuristic(startNode, finishNode);
  startNode.f = startNode.g + startNode.h;
  openSet.push(startNode);
  
  while (openSet.length > 0) {
    // Get node with lowest f score
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    
    if (current.isWall) continue;
    
    if (current === finishNode) {
      return closedSet;
    }
    
    closedSet.push(current);
    current.isVisited = true;
    
    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (closedSet.includes(neighbor) || neighbor.isWall) continue;
      
      const tentativeG = current.g + 1;
      
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeG >= neighbor.g) {
        continue;
      }
      
      neighbor.previousNode = current;
      neighbor.g = tentativeG;
      neighbor.h = heuristic(neighbor, finishNode);
      neighbor.f = neighbor.g + neighbor.h;
    }
  }
  
  // No path found
  return closedSet;
}

function heuristic(nodeA, nodeB) {
  // Manhattan distance
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
