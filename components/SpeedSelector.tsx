import React from 'react';
import { GameTheme, GameStatus } from '../types';

interface SpeedSelectorProps {
  speedMultiplier: number;
  onSelectSpeed: (multiplier: number) => void;
  theme: GameTheme;
  status: GameStatus;
}

export const SpeedSelector: React.FC<SpeedSelectorProps> = ({
  speedMultiplier,
  onSelectSpeed,
  theme,
  status
}) => {
  // Multiplier logic: 10 is slow (1/10th speed), 1 is fast (original speed)
  const speeds = [
    { label: '1', value: 10, desc: 'Crawl' },
    { label: '2', value: 5, desc: 'Slow' },
    { label: '3', value: 2.5, desc: 'Normal' },
    { label: '4', value: 1.5, desc: 'Fast' },
    { label: '5', value: 1, desc: 'Turbo' },
  ];

  return (
    <div className="w-full max-w-md mb-4">
      <h3 className="text-sm font-bold mb-2 opacity-70" style={{ color: theme.textColor }}>SPEED SETTING</h3>
      <div className="flex gap-2">
        {speeds.map((speed) => {
          const isActive = speed.value === speedMultiplier;
          return (
            <button
              key={speed.label}
              onClick={() => onSelectSpeed(speed.value)}
              className={`
                flex-1 py-2 rounded-lg text-sm font-bold transition-all flex flex-col items-center justify-center
                ${isActive ? 'scale-105 shadow-lg' : 'opacity-50 hover:opacity-80'}
              `}
              style={{
                backgroundColor: isActive ? theme.snakeHeadColor : theme.gridColor,
                color: isActive ? theme.backgroundColor : theme.textColor,
                border: isActive ? `2px solid ${theme.snakeHeadColor}` : `1px solid ${theme.gridColor}`
              }}
            >
              <span className="text-lg">{speed.label}</span>
              <span className="text-[9px] uppercase mt-0 opacity-80">{speed.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};