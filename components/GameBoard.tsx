import React from 'react';
import { Coordinate, GameTheme, GameStatus } from '../types';

interface GameBoardProps {
  snake: Coordinate[];
  food: Coordinate;
  obstacles: Coordinate[];
  boardSize: number;
  theme: GameTheme;
  status: GameStatus;
}

export const GameBoard: React.FC<GameBoardProps> = ({ snake, food, obstacles, boardSize, theme, status }) => {
  // Create grid cells
  const cells = [];
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const isSnakeHead = snake.length > 0 && snake[0].x === x && snake[0].y === y;
      const isSnakeBody = !isSnakeHead && snake.some(s => s.x === x && s.y === y);
      const isFood = food.x === x && food.y === y;
      const isObstacle = obstacles.some(o => o.x === x && o.y === y);

      let cellStyle: React.CSSProperties = {
        backgroundColor: 'transparent',
      };
      
      let content = null;

      if (isObstacle) {
         cellStyle.backgroundColor = theme.textColor;
         cellStyle.opacity = 0.3;
         cellStyle.borderRadius = '4px';
         cellStyle.boxShadow = `inset 0 0 5px ${theme.backgroundColor}`;
      } else if (isSnakeHead) {
        cellStyle.backgroundColor = theme.snakeHeadColor;
        cellStyle.boxShadow = `0 0 10px ${theme.snakeHeadColor}`;
        cellStyle.borderRadius = '4px';
        // Add little eyes for fun
        content = (
            <div className="w-full h-full flex justify-center items-center gap-[2px]">
                 <div className="w-1 h-1 bg-white rounded-full"></div>
                 <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
        );
      } else if (isSnakeBody) {
        cellStyle.backgroundColor = theme.snakeBodyColor;
        cellStyle.borderRadius = '2px';
      } else if (isFood) {
        // Render emoji for food if available, else color
        if (theme.foodEmoji) {
           // Scale emoji to fit cell using viewport units to ensure it fits in the square
           content = <span className="text-sm md:text-lg leading-none select-none flex justify-center items-center w-full h-full" style={{ fontSize: 'min(3.5vw, 22px)' }}>{theme.foodEmoji}</span>;
           cellStyle.textShadow = `0 0 10px ${theme.foodColor}`;
        } else {
            cellStyle.backgroundColor = theme.foodColor;
            cellStyle.boxShadow = `0 0 10px ${theme.foodColor}`;
            cellStyle.borderRadius = '50%';
        }
      }

      cells.push(
        <div
          key={`${x}-${y}`}
          className="w-full h-full flex items-center justify-center transition-colors duration-100 overflow-hidden"
          style={cellStyle}
        >
          {content}
        </div>
      );
    }
  }

  return (
    <div className="relative">
      <div
        className="grid gap-[1px] p-1 rounded-lg shadow-2xl select-none aspect-square"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
          backgroundColor: theme.gridColor, // The gap color essentially
          width: 'min(90vw, 500px)',
          height: 'min(90vw, 500px)',
          borderColor: theme.gridColor,
          borderWidth: '2px'
        }}
      >
        {cells}
      </div>
      
      {/* Overlays */}
      {status === GameStatus.GAME_OVER && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg backdrop-blur-sm z-10">
          <div className="text-center p-6 rounded-xl border-2" style={{ borderColor: theme.snakeHeadColor, backgroundColor: theme.backgroundColor }}>
            <h2 className="text-3xl font-bold mb-2" style={{ color: theme.snakeHeadColor }}>GAME OVER</h2>
            <p style={{ color: theme.textColor }}>Press Start to try again</p>
          </div>
        </div>
      )}

      {status === GameStatus.PAUSED && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg backdrop-blur-sm z-10">
          <div className="px-6 py-3 rounded-lg bg-white/10 backdrop-blur-md">
            <h2 className="text-2xl font-bold tracking-widest text-white">PAUSED</h2>
          </div>
        </div>
      )}
    </div>
  );
};