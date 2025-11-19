import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ScoreEntry, GameTheme } from '../types';

interface ScoreBoardProps {
  history: ScoreEntry[];
  theme: GameTheme;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ history, theme }) => {
  if (history.length === 0) return null;

  const data = history.slice(-10).map((entry, index) => ({
    name: `Game ${index + 1}`,
    score: entry.score
  }));

  return (
    <div className="w-full max-w-md mt-6 p-4 rounded-xl bg-black/20 backdrop-blur-sm">
      <h3 className="text-lg font-bold mb-4 text-center" style={{ color: theme.textColor }}>Recent Performance</h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" hide />
            <YAxis stroke={theme.gridColor} tick={{ fill: theme.textColor, fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.backgroundColor, 
                borderColor: theme.gridColor,
                color: theme.textColor
              }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke={theme.snakeHeadColor} 
              strokeWidth={3}
              dot={{ fill: theme.foodColor }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};