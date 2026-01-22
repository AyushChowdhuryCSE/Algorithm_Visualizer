// Depth-First Search Algorithm
// Explores as far as possible along each branch before backtracking

export function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const stack = [startNode];
  
  while (stack.length > 0) {
    const current = stack.pop();
    
    if (current.isWall || current.isVisited) continue;
    
    current.isVisited = true;
    visitedNodesInOrder.push(current);
    
    if (current === finishNode) {
      return visitedNodesInOrder;
    }
    
    const neighbors = getUnvisitedNeighbors(current, grid);
    for (const neighbor of neighbors) {
      neighbor.previousNode = current;
      stack.push(neighbor);
    }
  }
  
  return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  // Order matters for DFS visual effect - try different directions
  if (row > 0) neighbors.push(grid[row - 1][col]); // Up
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
  if (col > 0) neighbors.push(grid[row][col - 1]); // Left
  return neighbors.filter(neighbor => !neighbor.isVisited);
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
