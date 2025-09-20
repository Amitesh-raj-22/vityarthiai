import React from 'react';
import { GridCell as GridCellType, CellType } from '../types';

interface GridCellProps {
  cell: GridCellType;
  isAgent: boolean;
  onClick: (cell: GridCellType) => void;
  size: number;
}

export const GridCell: React.FC<GridCellProps> = ({ cell, isAgent, onClick, size }) => {
  const getCellColor = () => {
    if (isAgent) return 'bg-purple-600 border-purple-800';
    if (cell.type === CellType.START) return 'bg-green-500 border-green-600';
    if (cell.type === CellType.GOAL) return 'bg-red-500 border-red-600';
    if (cell.isPath) return 'bg-blue-400 border-blue-500';
    if (cell.isExplored) return 'bg-yellow-200 border-yellow-300';
    
    switch (cell.type) {
      case CellType.OBSTACLE:
        return 'bg-gray-800 border-gray-900';
      case CellType.ROAD:
        return 'bg-gray-300 border-gray-400';
      case CellType.GRASS:
        return 'bg-green-200 border-green-300';
      case CellType.WATER:
        return 'bg-blue-200 border-blue-300';
      case CellType.DYNAMIC_OBSTACLE:
        return 'bg-orange-500 border-orange-600';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getCellText = () => {
    if (isAgent) return '🤖';
    if (cell.type === CellType.START) return '🏁';
    if (cell.type === CellType.GOAL) return '🎯';
    if (cell.type === CellType.DYNAMIC_OBSTACLE) return '🚗';
    if (cell.cost > 1 && cell.type !== CellType.OBSTACLE) return cell.cost.toString();
    return '';
  };

  return (
    <div
      className={`
        ${getCellColor()}
        border-2 flex items-center justify-center cursor-pointer
        transition-all duration-200 hover:scale-105
        text-xs font-bold select-none
      `}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(8, size * 0.3)
      }}
      onClick={() => onClick(cell)}
      title={`(${cell.x}, ${cell.y}) - ${cell.type} - Cost: ${cell.cost}`}
    >
      {getCellText()}
    </div>
  );
};