import { GridEnvironment, CellType, GridCell, DynamicObstacle } from '../types';

export class MapGenerator {
  
  static getCellCost(cellType: CellType): number {
    switch (cellType) {
      case CellType.ROAD:
        return 1;
      case CellType.EMPTY:
        return 2;
      case CellType.GRASS:
        return 3;
      case CellType.WATER:
        return 5;
      case CellType.OBSTACLE:
        return Infinity;
      default:
        return 1;
    }
  }

  static createSmallMap(): GridEnvironment {
    const width = 10;
    const height = 10;
    const cells: GridCell[][] = [];

    // Initialize grid
    for (let y = 0; y < height; y++) {
      cells[y] = [];
      for (let x = 0; x < width; x++) {
        const type = CellType.EMPTY;
        cells[y][x] = {
          x,
          y,
          type,
          cost: this.getCellCost(type)
        };
      }
    }

    // Add some obstacles
    const obstacles = [
      [2, 2], [3, 2], [4, 2],
      [6, 4], [6, 5], [6, 6],
      [2, 7], [3, 7]
    ];

    obstacles.forEach(([x, y]) => {
      if (cells[y] && cells[y][x]) {
        cells[y][x].type = CellType.OBSTACLE;
        cells[y][x].cost = this.getCellCost(CellType.OBSTACLE);
      }
    });

    // Add different terrain types
    for (let x = 0; x < 3; x++) {
      for (let y = 4; y < 6; y++) {
        if (cells[y][x].type === CellType.EMPTY) {
          cells[y][x].type = CellType.GRASS;
          cells[y][x].cost = this.getCellCost(CellType.GRASS);
        }
      }
    }

    return {
      width,
      height,
      cells,
      start: { x: 1, y: 1 },
      goal: { x: 8, y: 8 },
      dynamicObstacles: []
    };
  }

  static createMediumMap(): GridEnvironment {
    const width = 15;
    const height = 15;
    const cells: GridCell[][] = [];

    // Initialize grid
    for (let y = 0; y < height; y++) {
      cells[y] = [];
      for (let x = 0; x < width; x++) {
        const type = CellType.EMPTY;
        cells[y][x] = {
          x,
          y,
          type,
          cost: this.getCellCost(type)
        };
      }
    }

    // Create road network
    for (let x = 0; x < width; x++) {
      cells[3][x].type = CellType.ROAD;
      cells[3][x].cost = this.getCellCost(CellType.ROAD);
      
      cells[7][x].type = CellType.ROAD;
      cells[7][x].cost = this.getCellCost(CellType.ROAD);
      
      cells[11][x].type = CellType.ROAD;
      cells[11][x].cost = this.getCellCost(CellType.ROAD);
    }

    for (let y = 0; y < height; y++) {
      cells[y][4].type = CellType.ROAD;
      cells[y][4].cost = this.getCellCost(CellType.ROAD);
      
      cells[y][10].type = CellType.ROAD;
      cells[y][10].cost = this.getCellCost(CellType.ROAD);
    }

    // Add obstacles
    const obstacles = [
      [2, 1], [2, 2], [5, 5], [5, 6], [6, 5], [6, 6],
      [8, 1], [8, 2], [9, 1], [9, 2],
      [12, 8], [12, 9], [13, 8], [13, 9]
    ];

    obstacles.forEach(([x, y]) => {
      if (cells[y] && cells[y][x]) {
        cells[y][x].type = CellType.OBSTACLE;
        cells[y][x].cost = this.getCellCost(CellType.OBSTACLE);
      }
    });

    // Add water areas
    for (let x = 1; x < 4; x++) {
      for (let y = 8; y < 11; y++) {
        if (cells[y][x].type === CellType.EMPTY) {
          cells[y][x].type = CellType.WATER;
          cells[y][x].cost = this.getCellCost(CellType.WATER);
        }
      }
    }

    // Add grass areas
    for (let x = 11; x < 14; x++) {
      for (let y = 4; y < 7; y++) {
        if (cells[y][x].type === CellType.EMPTY) {
          cells[y][x].type = CellType.GRASS;
          cells[y][x].cost = this.getCellCost(CellType.GRASS);
        }
      }
    }

    return {
      width,
      height,
      cells,
      start: { x: 1, y: 1 },
      goal: { x: 13, y: 13 },
      dynamicObstacles: []
    };
  }

  static createLargeMap(): GridEnvironment {
    const width = 20;
    const height = 20;
    const cells: GridCell[][] = [];

    // Initialize grid with random terrain
    for (let y = 0; y < height; y++) {
      cells[y] = [];
      for (let x = 0; x < width; x++) {
        const rand = Math.random();
        let type: CellType;
        
        if (rand < 0.6) type = CellType.EMPTY;
        else if (rand < 0.75) type = CellType.GRASS;
        else if (rand < 0.85) type = CellType.WATER;
        else type = CellType.ROAD;

        cells[y][x] = {
          x,
          y,
          type,
          cost: this.getCellCost(type)
        };
      }
    }

    // Create main roads
    for (let x = 0; x < width; x++) {
      cells[5][x].type = CellType.ROAD;
      cells[5][x].cost = this.getCellCost(CellType.ROAD);
      
      cells[10][x].type = CellType.ROAD;
      cells[10][x].cost = this.getCellCost(CellType.ROAD);
      
      cells[15][x].type = CellType.ROAD;
      cells[15][x].cost = this.getCellCost(CellType.ROAD);
    }

    for (let y = 0; y < height; y++) {
      cells[y][5].type = CellType.ROAD;
      cells[y][5].cost = this.getCellCost(CellType.ROAD);
      
      cells[y][10].type = CellType.ROAD;
      cells[y][10].cost = this.getCellCost(CellType.ROAD);
      
      cells[y][15].type = CellType.ROAD;
      cells[y][15].cost = this.getCellCost(CellType.ROAD);
    }

    // Add random obstacles
    const numObstacles = Math.floor(width * height * 0.15);
    for (let i = 0; i < numObstacles; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      
      if ((x !== 1 || y !== 1) && (x !== 18 || y !== 18)) {
        cells[y][x].type = CellType.OBSTACLE;
        cells[y][x].cost = this.getCellCost(CellType.OBSTACLE);
      }
    }

    return {
      width,
      height,
      cells,
      start: { x: 1, y: 1 },
      goal: { x: 18, y: 18 },
      dynamicObstacles: []
    };
  }

  static createDynamicMap(): GridEnvironment {
    const baseMap = this.createMediumMap();
    
    // Add dynamic obstacles
    const dynamicObstacles: DynamicObstacle[] = [
      {
        id: 'vehicle1',
        x: 4,
        y: 1,
        currentScheduleIndex: 0,
        schedule: [
          { x: 4, y: 1, time: 0 },
          { x: 4, y: 3, time: 2 },
          { x: 4, y: 7, time: 4 },
          { x: 4, y: 11, time: 6 },
          { x: 4, y: 13, time: 8 },
          { x: 4, y: 11, time: 10 },
          { x: 4, y: 7, time: 12 },
          { x: 4, y: 3, time: 14 },
          { x: 4, y: 1, time: 16 }
        ]
      },
      {
        id: 'vehicle2',
        x: 1,
        y: 7,
        currentScheduleIndex: 0,
        schedule: [
          { x: 1, y: 7, time: 0 },
          { x: 4, y: 7, time: 3 },
          { x: 7, y: 7, time: 6 },
          { x: 10, y: 7, time: 9 },
          { x: 13, y: 7, time: 12 },
          { x: 10, y: 7, time: 15 },
          { x: 7, y: 7, time: 18 },
          { x: 4, y: 7, time: 21 },
          { x: 1, y: 7, time: 24 }
        ]
      }
    ];

    return {
      ...baseMap,
      dynamicObstacles
    };
  }

  static getPredefinedMaps(): { [key: string]: GridEnvironment } {
    return {
      small: this.createSmallMap(),
      medium: this.createMediumMap(),
      large: this.createLargeMap(),
      dynamic: this.createDynamicMap()
    };
  }
}