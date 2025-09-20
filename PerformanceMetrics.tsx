import React from 'react';
import { SearchResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceMetricsProps {
  results: SearchResult[];
  onClear: () => void;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ results, onClear }) => {
  const chartData = results.map(result => ({
    algorithm: result.algorithm,
    pathCost: result.success ? result.pathCost : 0,
    nodesExplored: result.nodesExplored,
    executionTime: Math.round(result.executionTime * 100) / 100,
    success: result.success
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Performance Metrics</h3>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Clear Results
        </button>
      </div>

      {results.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No results yet. Run some algorithms to see performance comparison.</p>
      ) : (
        <div className="space-y-6">
          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Algorithm</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Path Cost</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nodes Explored</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time (ms)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{result.algorithm}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        result.success 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.success ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {result.success ? result.pathCost.toFixed(2) : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{result.nodesExplored}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{result.executionTime.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Path Cost Comparison</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="algorithm" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pathCost" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Nodes Explored</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="algorithm" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="nodesExplored" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Analysis */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-blue-900">Performance Analysis</h4>
            <div className="space-y-2 text-sm text-blue-800">
              {results.length > 0 && (
                <>
                  <p><strong>Best Path Cost:</strong> {Math.min(...results.filter(r => r.success).map(r => r.pathCost)).toFixed(2)} 
                     ({results.find(r => r.success && r.pathCost === Math.min(...results.filter(r => r.success).map(r => r.pathCost)))?.algorithm})</p>
                  <p><strong>Fewest Nodes Explored:</strong> {Math.min(...results.map(r => r.nodesExplored))} 
                     ({results.find(r => r.nodesExplored === Math.min(...results.map(r => r.nodesExplored)))?.algorithm})</p>
                  <p><strong>Fastest Execution:</strong> {Math.min(...results.map(r => r.executionTime)).toFixed(2)}ms 
                     ({results.find(r => r.executionTime === Math.min(...results.map(r => r.executionTime)))?.algorithm})</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};