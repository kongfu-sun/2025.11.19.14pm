import React from 'react';
import { Level, GameTheme, GameStatus } from '../types';

interface LevelSelectorProps {
  levels: Level[];
  currentLevel: Level;
  onSelectLevel: (id: number) => void;
  theme: GameTheme;
  status: GameStatus;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ 
  levels, 
  currentLevel, 
  onSelectLevel, 
  theme,
  status
}) => {
  return (
    <div className="w-full max-w-md mb-4">
      <h3 className="text-sm font-bold mb-2 opacity-70" style={{ color: theme.textColor }}>SELECT LEVEL</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {levels.map((level) => {
          const isActive = level.id === currentLevel.id;
          return (
            <button
              key={level.id}
              onClick={() => onSelectLevel(level.id)}
              disabled={status === GameStatus.PLAYING || status === GameStatus.PAUSED}
              className={`
                flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all
                ${isActive ? 'scale-105 shadow-lg' : 'opacity-50 hover:opacity-80'}
                disabled:opacity-30 disabled:cursor-not-allowed
              `}
              style={{
                backgroundColor: isActive ? theme.snakeHeadColor : theme.gridColor,
                color: isActive ? theme.backgroundColor : theme.textColor,
                border: isActive ? `2px solid ${theme.snakeHeadColor}` : `1px solid ${theme.gridColor}`
              }}
            >
              <div className="whitespace-nowrap">{level.name}</div>
              {isActive && <div className="text-[10px] mt-0.5 opacity-75">{level.speed}ms</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
};