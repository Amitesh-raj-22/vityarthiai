import { GridCell, CellType, SearchResult, GridEnvironment } from '../types';

export class PathfindingAlgorithms {
  
  static bfs(grid: GridEnvironment): SearchResult {
    const startTime = performance.now();
    const queue: GridCell[] = [];
    const visited = new Set<string>();
    const cells = grid.cells;
    let nodesExplored = 0;

    const startCell = cells[grid.start.y][grid.start.x];
    const goalCell = cells[grid.goal.y][grid.goal.x];
    
    queue.push(startCell);
    visited.add(`${startCell.x},${startCell.y}`);

    while (queue.length > 0) {
      const current = queue.shift()!;
      nodesExplored++;

      if (current.x === goalCell.x && current.y === goalCell.y) {
        const path = this.reconstructPath(current);
        return {
          path,
          nodesExplored,
          pathCost: path.length - 1,
          executionTime: performance.now() - startTime,
          algorithm: 'BFS',
          success: true
        };
      }

      const neighbors = this.getNeighbors(current, cells);
      for (const neighbor of neighbors) {
        const key = `${neighbor.x},${neighbor.y}`;
        if (!visited.has(key) && neighbor.type !== CellType.OBSTACLE) {
          visited.add(key);
          neighbor.parent = current;
          queue.push(neighbor);
        }
      }
    }

    return {
      path: [],
      nodesExplored,
      pathCost: Infinity,
      executionTime: performance.now() - startTime,
      algorithm: 'BFS',
      success: false
    };
  }

  static uniformCostSearch(grid: GridEnvironment): SearchResult {
    const startTime = performance.now();
    const openSet: GridCell[] = [];
    const closedSet = new Set<string>();
    const cells = grid.cells;
    let nodesExplored = 0;

    const startCell = cells[grid.start.y][grid.start.x];
    const goalCell = cells[grid.goal.y][grid.goal.x];
    
    startCell.gScore = 0;
    openSet.push(startCell);

    while (openSet.length > 0) {
      // Sort by g-score (cost so far)
      openSet.sort((a, b) => (a.gScore || 0) - (b.gScore || 0));
      const current = openSet.shift()!;
      
      const currentKey = `${current.x},${current.y}`;
      if (closedSet.has(currentKey)) continue;
      
      closedSet.add(currentKey);
      nodesExplored++;

      if (current.x === goalCell.x && current.y === goalCell.y) {
        const path = this.reconstructPath(current);
        return {
          path,
          nodesExplored,
          pathCost: current.gScore || 0,
          executionTime: performance.now() - startTime,
          algorithm: 'Uniform Cost Search',
          success: true
        };
      }

      const neighbors = this.getNeighbors(current, cells);
      for (const neighbor of neighbors) {
        if (neighbor.type === CellType.OBSTACLE) continue;
        
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        if (closedSet.has(neighborKey)) continue;

        const tentativeG = (current.gScore || 0) + neighbor.cost;
        
        if (!neighbor.gScore || tentativeG < neighbor.gScore) {
          neighbor.parent = current;
          neighbor.gScore = tentativeG;
          
          if (!openSet.some(cell => cell.x === neighbor.x && cell.y === neighbor.y)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return {
      path: [],
      nodesExplored,
      pathCost: Infinity,
      executionTime: performance.now() - startTime,
      algorithm: 'Uniform Cost Search',
      success: false
    };
  }

  static aStar(grid: GridEnvironment): SearchResult {
    const startTime = performance.now();
    const openSet: GridCell[] = [];
    const closedSet = new Set<string>();
    const cells = grid.cells;
    let nodesExplored = 0;

    const startCell = cells[grid.start.y][grid.start.x];
    const goalCell = cells[grid.goal.y][grid.goal.x];
    
    startCell.gScore = 0;
    startCell.fScore = this.heuristic(startCell, goalCell);
    openSet.push(startCell);

    while (openSet.length > 0) {
      // Sort by f-score (g + h)
      openSet.sort((a, b) => (a.fScore || 0) - (b.fScore || 0));
      const current = openSet.shift()!;
      
      const currentKey = `${current.x},${current.y}`;
      if (closedSet.has(currentKey)) continue;
      
      closedSet.add(currentKey);
      nodesExplored++;

      if (current.x === goalCell.x && current.y === goalCell.y) {
        const path = this.reconstructPath(current);
        return {
          path,
          nodesExplored,
          pathCost: current.gScore || 0,
          executionTime: performance.now() - startTime,
          algorithm: 'A*',
          success: true
        };
      }

      const neighbors = this.getNeighbors(current, cells);
      for (const neighbor of neighbors) {
        if (neighbor.type === CellType.OBSTACLE) continue;
        
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        if (closedSet.has(neighborKey)) continue;

        const tentativeG = (current.gScore || 0) + neighbor.cost;
        
        if (!neighbor.gScore || tentativeG < neighbor.gScore) {
          neighbor.parent = current;
          neighbor.gScore = tentativeG;
          neighbor.fScore = tentativeG + this.heuristic(neighbor, goalCell);
          
          if (!openSet.some(cell => cell.x === neighbor.x && cell.y === neighbor.y)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return {
      path: [],
      nodesExplored,
      pathCost: Infinity,
      executionTime: performance.now() - startTime,
      algorithm: 'A*',
      success: false
    };
  }

  static hillClimbing(grid: GridEnvironment, maxRestarts: number = 5): SearchResult {
    const startTime = performance.now();
    let bestResult: SearchResult = {
      path: [],
      nodesExplored: 0,
      pathCost: Infinity,
      executionTime: 0,
      algorithm: 'Hill Climbing',
      success: false
    };

    for (let restart = 0; restart < maxRestarts; restart++) {
      const result = this.hillClimbingSingleRun(grid);
      if (result.success && result.pathCost < bestResult.pathCost) {
        bestResult = result;
      }
      bestResult.nodesExplored += result.nodesExplored;
    }

    bestResult.executionTime = performance.now() - startTime;
    return bestResult;
  }

  private static hillClimbingSingleRun(grid: GridEnvironment): SearchResult {
    const cells = grid.cells;
    const goalCell = cells[grid.goal.y][grid.goal.x];
    let current = cells[grid.start.y][grid.start.x];
    let nodesExplored = 0;
    const path: GridCell[] = [current];
    const visited = new Set<string>();

    while (current.x !== goalCell.x || current.y !== goalCell.y) {
      const currentKey = `${current.x},${current.y}`;
      visited.add(currentKey);
      
      const neighbors = this.getNeighbors(current, cells).filter(
        cell => cell.type !== CellType.OBSTACLE && 
                !visited.has(`${cell.x},${cell.y}`)
      );

      if (neighbors.length === 0) break;

      // Choose neighbor with best heuristic value
      let bestNeighbor = neighbors[0];
      let bestValue = this.heuristic(bestNeighbor, goalCell);

      for (const neighbor of neighbors) {
        const value = this.heuristic(neighbor, goalCell);
        if (value < bestValue) {
          bestValue = value;
          bestNeighbor = neighbor;
        }
      }

      // If no improvement, add some randomness
      if (this.heuristic(bestNeighbor, goalCell) >= this.heuristic(current, goalCell)) {
        bestNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      }

      current = bestNeighbor;
      path.push(current);
      nodesExplored++;

      if (path.length > 1000) break; // Prevent infinite loops
    }

    const success = current.x === goalCell.x && current.y === goalCell.y;
    return {
      path: success ? path : [],
      nodesExplored,
      pathCost: success ? path.reduce((sum, cell, i) => i > 0 ? sum + cell.cost : sum, 0) : Infinity,
      executionTime: 0,
      algorithm: 'Hill Climbing',
      success
    };
  }

  private static heuristic(cell1: GridCell, cell2: GridCell): number {
    // Manhattan distance
    return Math.abs(cell1.x - cell2.x) + Math.abs(cell1.y - cell2.y);
  }

  private static getNeighbors(cell: GridCell, cells: GridCell[][]): GridCell[] {
    const neighbors: GridCell[] = [];
    const directions = [
      { dx: 0, dy: -1 }, // Up
      { dx: 1, dy: 0 },  // Right
      { dx: 0, dy: 1 },  // Down
      { dx: -1, dy: 0 }  // Left
    ];

    for (const dir of directions) {
      const newX = cell.x + dir.dx;
      const newY = cell.y + dir.dy;

      if (newY >= 0 && newY < cells.length && 
          newX >= 0 && newX < cells[0].length) {
        neighbors.push(cells[newY][newX]);
      }
    }

    return neighbors;
  }

  private static reconstructPath(goalCell: GridCell): GridCell[] {
    const path: GridCell[] = [];
    let current: GridCell | undefined = goalCell;

    while (current) {
      path.unshift(current);
      current = current.parent;
    }

    return path;
  }

  static clearSearchData(cells: GridCell[][]): void {
    for (let y = 0; y < cells.length; y++) {
      for (let x = 0; x < cells[y].length; x++) {
        delete cells[y][x].gScore;
        delete cells[y][x].fScore;
        delete cells[y][x].parent;
        cells[y][x].isExplored = false;
        cells[y][x].isPath = false;
      }
    }
  }
}