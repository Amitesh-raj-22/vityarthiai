import React, { useState } from 'react';
import { Play, Square, RotateCcw, Map, Settings } from 'lucide-react';

interface ControlPanelProps {
  onRunAlgorithm: (algorithm: string) => void;
  onClearGrid: () => void;
  onLoadMap: (mapName: string) => void;
  onToggleAnimation: () => void;
  isRunning: boolean;
  animationEnabled: boolean;
  currentMap: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onRunAlgorithm,
  onClearGrid,
  onLoadMap,
  onToggleAnimation,
  isRunning,
  animationEnabled,
  currentMap
}) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('aStar');

  const algorithms = [
    { value: 'bfs', label: 'Breadth-First Search', description: 'Uninformed search, guarantees shortest path (in steps)' },
    { value: 'uniformCost', label: 'Uniform Cost Search', description: 'Uninformed search, guarantees optimal path by cost' },
    { value: 'aStar', label: 'A* Search', description: 'Informed search with heuristic, optimal and efficient' },
    { value: 'hillClimbing', label: 'Hill Climbing', description: 'Local search with random restarts' }
  ];

  const maps = [
    { value: 'small', label: 'Small Map (10x10)', description: 'Simple test case with basic obstacles' },
    { value: 'medium', label: 'Medium Map (15x15)', description: 'Road network with varied terrain' },
    { value: 'large', label: 'Large Map (20x20)', description: 'Complex environment with random terrain' },
    { value: 'dynamic', label: 'Dynamic Map (15x15)', description: 'Moving obstacles for replanning tests' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Settings className="w-5 h-5" />
        Control Panel
      </h3>

      {/* Algorithm Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Algorithm
        </label>
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isRunning}
        >
          {algorithms.map(alg => (
            <option key={alg.value} value={alg.value}>
              {alg.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {algorithms.find(alg => alg.value === selectedAlgorithm)?.description}
        </p>
      </div>

      {/* Map Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Map className="inline w-4 h-4 mr-1" />
          Environment
        </label>
        <select
          value={currentMap}
          onChange={(e) => onLoadMap(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isRunning}
        >
          {maps.map(map => (
            <option key={map.value} value={map.value}>
              {map.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {maps.find(map => map.value === currentMap)?.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => onRunAlgorithm(selectedAlgorithm)}
          disabled={isRunning}
          className={`
            flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium
            ${isRunning 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors
          `}
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Running...' : 'Run Algorithm'}
        </button>

        <button
          onClick={onClearGrid}
          disabled={isRunning}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Clear Results
        </button>
      </div>

      {/* Animation Toggle */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="animation"
          checked={animationEnabled}
          onChange={onToggleAnimation}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="animation" className="text-sm font-medium text-gray-700">
          Enable Animation
        </label>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Legend</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded border"></div>
            <span>Start (🏁)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded border"></div>
            <span>Goal (🎯)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded border"></div>
            <span>Agent (🤖)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-800 rounded border"></div>
            <span>Obstacle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded border"></div>
            <span>Path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 rounded border"></div>
            <span>Explored</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded border"></div>
            <span>Road (1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 rounded border"></div>
            <span>Grass (3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 rounded border"></div>
            <span>Water (5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded border"></div>
            <span>Vehicle (🚗)</span>
          </div>
        </div>
      </div>
    </div>
  );
};