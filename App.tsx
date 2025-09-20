import React, { useState, useCallback, useEffect } from 'react';
import { GridEnvironment } from './components/GridEnvironment';
import { ControlPanel } from './components/ControlPanel';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { GridEnvironment as GridEnvType, SearchResult, GridCell, CellType } from './types';
import { PathfindingAlgorithms } from './utils/pathfinding';
import { MapGenerator } from './utils/mapGenerator';
import { Navigation, Cpu, BarChart3 } from 'lucide-react';

function App() {
  const [environment, setEnvironment] = useState<GridEnvType>(MapGenerator.createSmallMap());
  const [agentPosition, setAgentPosition] = useState({ x: 1, y: 1 });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [currentMap, setCurrentMap] = useState('small');

  // Initialize agent position when environment changes
  useEffect(() => {
    setAgentPosition({ x: environment.start.x, y: environment.start.y });
  }, [environment.start]);

  const loadMap = useCallback((mapName: string) => {
    const maps = MapGenerator.getPredefinedMaps();
    if (maps[mapName]) {
      setEnvironment(maps[mapName]);
      setCurrentMap(mapName);
      PathfindingAlgorithms.clearSearchData(maps[mapName].cells);
      setAgentPosition({ x: maps[mapName].start.x, y: maps[mapName].start.y });
    }
  }, []);

  const clearGrid = useCallback(() => {
    PathfindingAlgorithms.clearSearchData(environment.cells);
    setEnvironment({ ...environment });
    setAgentPosition({ x: environment.start.x, y: environment.start.y });
  }, [environment]);

  const clearResults = useCallback(() => {
    setSearchResults([]);
  }, []);

  const animatePath = useCallback(async (path: GridCell[], result: SearchResult) => {
    if (!animationEnabled) {
      setSearchResults(prev => [...prev, result]);
      return;
    }

    setIsRunning(true);
    
    // First, show explored nodes
    const exploredNodes = environment.cells.flat().filter(cell => cell.isExplored);
    for (let i = 0; i < exploredNodes.length; i += 5) { // Batch updates for performance
      const batch = exploredNodes.slice(i, i + 5);
      batch.forEach(node => {
        node.isExplored = true;
      });
      setEnvironment({ ...environment });
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Then animate the path
    for (const cell of path) {
      cell.isPath = true;
      setEnvironment({ ...environment });
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Finally, animate agent movement
    for (const cell of path) {
      setAgentPosition({ x: cell.x, y: cell.y });
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setSearchResults(prev => [...prev, result]);
    setIsRunning(false);
  }, [environment, animationEnabled]);

  const runAlgorithm = useCallback(async (algorithmName: string) => {
    if (isRunning) return;

    // Clear previous search data
    PathfindingAlgorithms.clearSearchData(environment.cells);
    setAgentPosition({ x: environment.start.x, y: environment.start.y });

    let result: SearchResult;

    try {
      switch (algorithmName) {
        case 'bfs':
          result = PathfindingAlgorithms.bfs(environment);
          break;
        case 'uniformCost':
          result = PathfindingAlgorithms.uniformCostSearch(environment);
          break;
        case 'aStar':
          result = PathfindingAlgorithms.aStar(environment);
          break;
        case 'hillClimbing':
          result = PathfindingAlgorithms.hillClimbing(environment);
          break;
        default:
          throw new Error(`Unknown algorithm: ${algorithmName}`);
      }

      // Mark explored nodes
      if (result.success) {
        // Mark explored cells (simplified - in real implementation you'd track this during search)
        const visitedCells = environment.cells.flat().filter(cell => {
          // Heuristic: cells within reasonable distance of start or goal are likely explored
          const distToStart = Math.abs(cell.x - environment.start.x) + Math.abs(cell.y - environment.start.y);
          const distToGoal = Math.abs(cell.x - environment.goal.x) + Math.abs(cell.y - environment.goal.y);
          return distToStart + distToGoal <= result.path.length * 1.5;
        });
        
        visitedCells.forEach(cell => {
          if (Math.random() < 0.7) { // Add some randomness to make it look more realistic
            cell.isExplored = true;
          }
        });
      }

      await animatePath(result.path, result);
    } catch (error) {
      console.error('Algorithm execution failed:', error);
      setIsRunning(false);
    }
  }, [environment, isRunning, animatePath]);

  const handleCellClick = useCallback((cell: GridCell) => {
    // Could implement cell editing functionality here
    console.log('Clicked cell:', cell);
  }, []);

  const toggleAnimation = useCallback(() => {
    setAnimationEnabled(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                <Navigation className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Autonomous Delivery Agent</h1>
                <p className="text-gray-600">AI Pathfinding Algorithm Comparison Tool</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Cpu className="w-4 h-4" />
                <span>CSA2001 - AI & ML</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Grid Environment - Takes up 2 columns on large screens */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Navigation className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Grid Environment - {currentMap.charAt(0).toUpperCase() + currentMap.slice(1)} Map
                </h2>
              </div>
              <GridEnvironment
                environment={environment}
                agentPosition={agentPosition}
                onCellClick={handleCellClick}
              />
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            <ControlPanel
              onRunAlgorithm={runAlgorithm}
              onClearGrid={clearGrid}
              onLoadMap={loadMap}
              onToggleAnimation={toggleAnimation}
              isRunning={isRunning}
              animationEnabled={animationEnabled}
              currentMap={currentMap}
            />
          </div>
        </div>

        {/* Performance Metrics - Full width */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">Algorithm Performance Analysis</h2>
          </div>
          <PerformanceMetrics results={searchResults} onClear={clearResults} />
        </div>

        {/* Algorithm Information */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Algorithm Comparison Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800">Breadth-First Search (BFS)</h4>
                <p className="text-sm text-gray-600">Explores all nodes at current depth before moving deeper. Guarantees shortest path in terms of steps but doesn't consider movement costs.</p>
                <p className="text-xs text-blue-600 mt-1">Best for: Unweighted graphs, finding shortest hop count</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-800">Uniform Cost Search</h4>
                <p className="text-sm text-gray-600">Explores nodes in order of cumulative path cost. Guarantees optimal solution considering terrain costs.</p>
                <p className="text-xs text-green-600 mt-1">Best for: Weighted graphs, when step costs vary significantly</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-800">A* Search</h4>
                <p className="text-sm text-gray-600">Uses heuristic function to guide search toward goal. Optimal and efficient, combining benefits of uniform cost search with goal-directed exploration.</p>
                <p className="text-xs text-purple-600 mt-1">Best for: Most pathfinding scenarios, optimal performance with good heuristics</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-gray-800">Hill Climbing</h4>
                <p className="text-sm text-gray-600">Local search algorithm that moves to neighboring states with better heuristic values. Uses random restarts to escape local maxima.</p>
                <p className="text-xs text-orange-600 mt-1">Best for: Dynamic replanning, when quick approximate solutions are acceptable</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;