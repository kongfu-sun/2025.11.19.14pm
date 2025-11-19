import React, { useState, useEffect } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import { GameBoard } from './components/GameBoard';
import { ThemeCreator } from './components/ThemeCreator';
import { ScoreBoard } from './components/ScoreBoard';
import { LevelSelector } from './components/LevelSelector';
import { SpeedSelector } from './components/SpeedSelector';
import { Direction, GameTheme, GameStatus, ScoreEntry } from './types';

// Default Theme
const DEFAULT_THEME: GameTheme = {
  name: "Retro Dark",
  backgroundColor: "#111827",
  gridColor: "#1f2937",
  snakeHeadColor: "#10b981",
  snakeBodyColor: "#34d399",
  foodColor: "#f59e0b",
  foodEmoji: "⚡",
  textColor: "#f9fafb"
};

const App: React.FC = () => {
  const {
    snake,
    food,
    direction,
    status,
    score,
    startGame,
    pauseGame,
    changeDirection,
    boardSize,
    currentLevel,
    levels,
    setLevel,
    speedMultiplier,
    setSpeedMultiplier
  } = useSnakeGame();

  const [theme, setTheme] = useState<GameTheme>(DEFAULT_THEME);
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>([]);
  const [highScore, setHighScore] = useState(0);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDirection(Direction.UP);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection(Direction.RIGHT);
          break;
        case ' ':
          if (status === GameStatus.GAME_OVER || status === GameStatus.IDLE) {
             startGame();
          } else {
             pauseGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, status, pauseGame, startGame]);

  // Update high score and history when game ends
  useEffect(() => {
    if (status === GameStatus.GAME_OVER) {
      if (score > highScore) setHighScore(score);
      setScoreHistory(prev => [...prev, { timestamp: Date.now(), score, levelName: currentLevel.name }]);
    }
  }, [status, score, highScore, currentLevel.name]);

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-500"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Header */}
      <header className="w-full max-w-2xl flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter" style={{ color: theme.textColor }}>
            GEN<span style={{ color: theme.snakeHeadColor }}>SNAKE</span>
          </h1>
          <p className="text-xs font-mono opacity-60" style={{ color: theme.textColor }}>
            Theme: {theme.name} | Level: {currentLevel.name}
          </p>
        </div>
        <div className="text-right">
           <div className="text-sm opacity-70" style={{ color: theme.textColor }}>SCORE</div>
           <div className="text-3xl font-mono font-bold" style={{ color: theme.textColor }}>{score}</div>
           <div className="text-xs opacity-50" style={{ color: theme.textColor }}>HIGH: {Math.max(score, highScore)}</div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-6xl">
        
        {/* Left Column: Game */}
        <div className="flex flex-col items-center w-full lg:w-auto">
          <GameBoard 
            snake={snake} 
            food={food}
            obstacles={currentLevel.obstacles} 
            boardSize={boardSize} 
            theme={theme}
            status={status}
          />

          {/* Mobile Controls */}
          <div className="mt-8 grid grid-cols-3 gap-2 lg:hidden">
            <div></div>
            <button 
              className="w-16 h-16 rounded-full bg-white/10 active:bg-white/30 flex items-center justify-center backdrop-blur-sm"
              onTouchStart={(e) => { e.preventDefault(); changeDirection(Direction.UP); }}
              onClick={() => changeDirection(Direction.UP)}
            >
              <span className="text-2xl text-white">↑</span>
            </button>
            <div></div>
            <button 
              className="w-16 h-16 rounded-full bg-white/10 active:bg-white/30 flex items-center justify-center backdrop-blur-sm"
              onTouchStart={(e) => { e.preventDefault(); changeDirection(Direction.LEFT); }}
              onClick={() => changeDirection(Direction.LEFT)}
            >
              <span className="text-2xl text-white">←</span>
            </button>
            <button 
              className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{ backgroundColor: theme.snakeHeadColor }}
              onClick={status === GameStatus.PLAYING ? pauseGame : startGame}
            >
              <span className="text-xs font-bold text-black">
                {status === GameStatus.PLAYING ? 'PAUSE' : status === GameStatus.GAME_OVER ? 'RETRY' : 'START'}
              </span>
            </button>
            <button 
              className="w-16 h-16 rounded-full bg-white/10 active:bg-white/30 flex items-center justify-center backdrop-blur-sm"
              onTouchStart={(e) => { e.preventDefault(); changeDirection(Direction.RIGHT); }}
              onClick={() => changeDirection(Direction.RIGHT)}
            >
              <span className="text-2xl text-white">→</span>
            </button>
            <div></div>
            <button 
              className="w-16 h-16 rounded-full bg-white/10 active:bg-white/30 flex items-center justify-center backdrop-blur-sm"
              onTouchStart={(e) => { e.preventDefault(); changeDirection(Direction.DOWN); }}
              onClick={() => changeDirection(Direction.DOWN)}
            >
              <span className="text-2xl text-white">↓</span>
            </button>
            <div></div>
          </div>

          {/* Desktop Start Button */}
          <div className="mt-6 hidden lg:block">
             <button 
                onClick={status === GameStatus.PLAYING ? pauseGame : startGame}
                className="px-8 py-3 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg"
                style={{ backgroundColor: theme.snakeHeadColor, color: theme.backgroundColor }}
             >
                {status === GameStatus.IDLE ? "START GAME" : 
                 status === GameStatus.PLAYING ? "PAUSE GAME" : 
                 status === GameStatus.PAUSED ? "RESUME" : "PLAY AGAIN"}
             </button>
             <p className="text-center text-xs mt-2 opacity-50" style={{ color: theme.textColor }}>Use Arrow Keys or WASD</p>
          </div>
        </div>

        {/* Right Column: Tools */}
        <div className="flex flex-col w-full max-w-md">
          <LevelSelector 
             levels={levels} 
             currentLevel={currentLevel} 
             onSelectLevel={setLevel} 
             theme={theme}
             status={status}
          />
          
          <SpeedSelector 
             speedMultiplier={speedMultiplier}
             onSelectSpeed={setSpeedMultiplier}
             theme={theme}
             status={status}
          />

          <ThemeCreator onThemeApply={setTheme} currentTheme={theme} />
          <ScoreBoard history={scoreHistory} theme={theme} />
          
          <div className="mt-6 p-4 rounded-xl bg-black/10 border border-white/10 text-xs opacity-60 leading-relaxed" style={{ color: theme.textColor }}>
             <h4 className="font-bold mb-2">About GenSnake</h4>
             <p>
               This game uses Google's Gemini 2.5 Flash model to generate custom color themes and visual styles on the fly. 
               Now features 5 difficulty levels and adjustable game speed.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;