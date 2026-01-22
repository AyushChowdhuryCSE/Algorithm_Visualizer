import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../../algorithms/pathfinding/dijkstra';
import { astar, getNodesInShortestPathOrder as astarPath } from '../../algorithms/pathfinding/astar';
import { dfs, getNodesInShortestPathOrder as dfsPath } from '../../algorithms/pathfinding/dfs';
import { bfs, getNodesInShortestPathOrder as bfsPath } from '../../algorithms/pathfinding/bfs';
import { recursiveDivisionMaze } from '../../algorithms/pathfinding/mazeGenerator';
import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 45;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      algorithm: 'dijkstra',
      isRunning: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    if (this.state.isRunning) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed || this.state.isRunning) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited';
        }
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path';
        }
        if (i === nodesInShortestPathOrder.length - 1) {
          this.setState({ isRunning: false });
        }
      }, 50 * i);
    }
    if (nodesInShortestPathOrder.length === 0) {
      this.setState({ isRunning: false });
    }
  }

  visualize() {
    const { grid, algorithm } = this.state;
    this.setState({ isRunning: true });
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    
    let visitedNodesInOrder;
    let nodesInShortestPathOrder;
    
    switch (algorithm) {
      case 'dijkstra':
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        break;
      case 'astar':
        visitedNodesInOrder = astar(grid, startNode, finishNode);
        nodesInShortestPathOrder = astarPath(finishNode);
        break;
      case 'bfs':
        visitedNodesInOrder = bfs(grid, startNode, finishNode);
        nodesInShortestPathOrder = bfsPath(finishNode);
        break;
      case 'dfs':
        visitedNodesInOrder = dfs(grid, startNode, finishNode);
        nodesInShortestPathOrder = dfsPath(finishNode);
        break;
      default:
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    }
    
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  generateMaze() {
    if (this.state.isRunning) return;
    const grid = getInitialGrid();
    this.setState({ grid }, () => {
      const { grid } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const walls = recursiveDivisionMaze(grid, startNode, finishNode);
      this.animateWalls(walls);
    });
  }

  animateWalls(walls) {
    this.setState({ isRunning: true });
    for (let i = 0; i < walls.length; i++) {
      setTimeout(() => {
        const [row, col] = walls[i];
        const node = this.state.grid[row][col];
        if (!node.isStart && !node.isFinish) {
          const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
          this.setState({ grid: newGrid });
        }
        if (i === walls.length - 1) {
          this.setState({ isRunning: false });
        }
      }, 10 * i);
    }
  }

  clearGrid() {
    if (this.state.isRunning) return;
    const newGrid = getInitialGrid();
    this.setState({ grid: newGrid });
    // Also reset DOM classes for visited nodes
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 50; col++) {
        const nodeElement = document.getElementById(`node-${row}-${col}`);
        if (nodeElement) {
          const isStart = row === START_NODE_ROW && col === START_NODE_COL;
          const isFinish = row === FINISH_NODE_ROW && col === FINISH_NODE_COL;
          if (isStart) {
            nodeElement.className = 'node node-start';
          } else if (isFinish) {
            nodeElement.className = 'node node-finish';
          } else {
            nodeElement.className = 'node';
          }
        }
      }
    }
  }

  render() {
    const { grid, mouseIsPressed, algorithm, isRunning } = this.state;

    return (
      <div className="pathfinding-container">
        <div className="controls-bar">
          <div className="algo-select-group">
            <label>
              Algorithm
              <select 
                value={algorithm} 
                onChange={(e) => this.setState({ algorithm: e.target.value })}
                disabled={isRunning}
                className="algo-select"
              >
                <option value="dijkstra">Dijkstra</option>
                <option value="astar">A* (A-Star)</option>
                <option value="bfs">Breadth First Search</option>
                <option value="dfs">Depth First Search</option>
              </select>
            </label>
          </div>
          <div className="buttons-group">
            <button 
              className="control-btn primary" 
              onClick={() => this.visualize()}
              disabled={isRunning}
            >
              Visualize
            </button>
            <button 
              className="control-btn secondary" 
              onClick={() => this.generateMaze()}
              disabled={isRunning}
            >
              Generate Maze
            </button>
            <button 
              className="control-btn secondary" 
              onClick={() => this.clearGrid()}
              disabled={isRunning}
            >
              Clear
            </button>
          </div>
          <div className="legend">
            <span className="legend-item"><div className="node node-start"></div> Start</span>
            <span className="legend-item"><div className="node node-finish"></div> Target</span>
            <span className="legend-item"><div className="node node-wall"></div> Wall</span>
          </div>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="grid-row">
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    g: Infinity,
    h: 0,
    f: Infinity,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (node.isStart || node.isFinish) return grid; // Don't toggle start/finish
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
