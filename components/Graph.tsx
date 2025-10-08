import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Scatter,
} from 'recharts';
import type { EquationParams, Point, GraphDataPoint } from '../types';

interface GraphProps {
  eq1: EquationParams;
  eq2: EquationParams;
  solution: Point;
  showSolution?: boolean;
}

const Graph: React.FC<GraphProps> = ({ eq1, eq2, solution, showSolution = true }) => {
  const chartData = useMemo(() => {
    const data: GraphDataPoint[] = [];
    const step = 0.25;
    const range = 3;
    const startX = Math.max(0, solution.x - range);
    const endX = solution.x + range;

    for (let x = startX; x <= endX; x += step) {
      data.push({
        x: parseFloat(x.toFixed(2)),
        line1: parseFloat((eq1.a * x + eq1.b).toFixed(2)),
        line2: parseFloat((eq2.a * x + eq2.b).toFixed(2)),
      });
    }
    return data;
  }, [eq1, eq2, solution]);

  const solutionData = [{ x: solution.x, y: solution.y }];

  return (
    <div className="w-full h-80 bg-white/10 rounded-lg p-4 mt-6 animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: -10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
          <XAxis 
            dataKey="x" 
            name="Maré (m)" 
            type="number" 
            domain={['dataMin', 'dataMax']}
            stroke="#e0f2fe"
            label={{ value: 'Altura da Maré (m)', position: 'insideBottom', offset: -15, fill: '#e0f2fe' }}
          />
          <YAxis 
            stroke="#e0f2fe"
            label={{ value: 'Pico da Onda (m)', angle: -90, position: 'insideLeft', fill: '#e0f2fe' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              borderColor: '#06b6d4',
              color: '#f0f9ff'
            }}
            labelStyle={{ color: '#67e8f9' }}
          />
          <Legend wrapperStyle={{ color: '#e0f2fe' }}/>
          <Line type="monotone" dataKey="line1" stroke="#38bdf8" strokeWidth={2} name="Relação 1" dot={false}/>
          <Line type="monotone" dataKey="line2" stroke="#67e8f9" strokeWidth={2} name="Relação 2" dot={false}/>
          {showSolution && (
            <Scatter name="Ponto Ideal" data={solutionData} fill="#facc15">
            </Scatter>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;