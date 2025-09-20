export interface GridCell {
  x: number;
  y: number;
  type: CellType;
  cost: number;
  isOccupied?: boolean;
  isStart?: boolean;
  isGoal?: boolean;
  isPath?: boolean;
  isExplored?: boolean;
  gScore?: number;
  fScore?: number;
  parent?: GridCell;
}

export enum CellType {
  EMPTY = 'empty',
  OBSTACLE = 'obstacle',
  START = 'start',
  GOAL = 'goal',
  ROAD = 'road',
  GRASS = 'grass',
  WATER = 'water',
  AGENT = 'agent',
  DYNAMIC_OBSTACLE = 'dynamic_obstacle'
}

export interface SearchResult {
  path: GridCell[];
  nodesExplored: number;
  pathCost: number;
  executionTime: number;
  algorithm: string;
  success: boolean;
}

export interface DynamicObstacle {
  id: string;
  x: number;
  y: number;
  schedule: { x: number; y: number; time: number }[];
  currentScheduleIndex: number;
}

export interface GridEnvironment {
  width: number;
  height: number;
  cells: GridCell[][];
  start: { x: number; y: number };
  goal: { x: number; y: number };
  dynamicObstacles: DynamicObstacle[];
}