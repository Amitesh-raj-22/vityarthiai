import React from 'react';
import { GridEnvironment as GridEnvType, GridCell as GridCellType } from '../types';
import { GridCell } from './GridCell';

interface GridEnvironmentProps {
  environment: GridEnvType;
  agentPosition: { x: number; y: number };
  onCellClick: (cell: GridCellType) => void;
}

export const GridEnvironment: React.FC<GridEnvironmentProps> = ({
  environment,
  agentPosition,
  onCellClick
}) => {
  const cellSize = Math.min(600 / Math.max(environment.width, environment.height), 40);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
      <div 
        className="grid gap-1 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${environment.width}, ${cellSize}px)`,
          width: 'fit-content'
        }}
      >
        {environment.cells.flat().map((cell) => (
          <GridCell
            key={`${cell.x}-${cell.y}`}
            cell={cell}
            isAgent={agentPosition.x === cell.x && agentPosition.y === cell.y}
            onClick={onCellClick}
            size={cellSize}
          />
        ))}
      </div>
    </div>
  );
};