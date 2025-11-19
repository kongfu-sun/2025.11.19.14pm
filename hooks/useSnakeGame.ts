import { useState, useEffect, useCallback, useRef } from 'react';
import { Coordinate, Direction, GameStatus, Level } from '../types';

const BOARD_SIZE = 20;

// Define Levels with Symmetrical Obstacles
const generateLevels = (): Level[] => {
  const levels: Level[] = [];

  // Level 1: Open Field
  levels.push({ id: 1, name: "1. Open Field", speed: 150, obstacles: [] });

  // Level 2: Four Corners (Symmetrical)
  const l2Obstacles: Coordinate[] = [];
  [3, 4, 15, 16].forEach(x => {
    [3, 4, 15, 16].forEach(y => {
      l2Obstacles.push({ x, y });
    });
  });
  levels.push({ id: 2, name: "2. The Pillars", speed: 130, obstacles: l2Obstacles });

  // Level 3: Vertical Gates
  const l3Obstacles: Coordinate[] = [];
  for (let y = 4; y <= 15; y++) {
    if (y !== 9 && y !== 10) { // Leave a gap in the middle
        l3Obstacles.push({ x: 5, y });
        l3Obstacles.push({ x: 14, y });
    }
  }
  levels.push({ id: 3, name: "3. The Gates", speed: 110, obstacles: l3Obstacles });

  // Level 4: The Cross (Avoids center spawn area)
  const l4Obstacles: Coordinate[] = [];
  // Horizontal bars
  for (let x = 2; x <= 7; x++) { l4Obstacles.push({ x, y: 5 }); l4Obstacles.push({ x, y: 14 }); }
  for (let x = 12; x <= 17; x++) { l4Obstacles.push({ x, y: 5 }); l4Obstacles.push({ x, y: 14 }); }
  levels.push({ id: 4, name: "4. The Tracks", speed: 90, obstacles: l4Obstacles });

  // Level 5: The Maze Box
  const l5Obstacles: Coordinate[] = [];
  // Outer Box with gaps
  for(let i = 4; i <= 15; i++) {
      if (i % 2 === 0) { // Dotted lines
          l5Obstacles.push({ x: i, y: 4 });
          l5Obstacles.push({ x: i, y: 15 });
          l5Obstacles.push({ x: 4, y: i });
          l5Obstacles.push({ x: 15, y: i });
      }
  }
  // Inner Xs
  l5Obstacles.push({ x: 7, y: 7 }, { x: 12, y: 7 }, { x: 7, y: 12 }, { x: 12, y: 12 });
  
  levels.push({ id: 5, name: "5. The Grid", speed: 70, obstacles: l5Obstacles });

  return levels;
};

const LEVELS = generateLevels();

const INITIAL_SNAKE: Coordinate[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = Direction.UP;

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Coordinate>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevelState] = useState<Level>(LEVELS[0]);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  // Refs
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const gameLoopRef = useRef<number | null>(null);

  // Reset game state when level changes (but stay IDLE)
  const setLevel = useCallback((levelId: number) => {
    const newLevel = LEVELS.find(l => l.id === levelId) || LEVELS[0];
    setCurrentLevelState(newLevel);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setStatus(GameStatus.IDLE);
  }, []);

  // Helper to check if a coordinate hits an obstacle
  const isObstacle = useCallback((x: number, y: number, level: Level) => {
      return level.obstacles.some(obs => obs.x === x && obs.y === y);
  }, []);

  // Random food position that doesn't overlap snake or obstacles
  const spawnFood = useCallback((currentSnake: Coordinate[], level: Level) => {
    let newFood: Coordinate;
    let isValid = false;
    let attempts = 0;
    
    // Safety break to prevent infinite loop if board is full
    while (!isValid && attempts < 500) {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
      
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      const isOnObstacle = isObstacle(newFood.x, newFood.y, level);
      
      if (!isOnSnake && !isOnObstacle) {
        setFood(newFood);
        isValid = true;
      }
      attempts++;
    }
  }, [isObstacle]);

  // Initialize game
  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setStatus(GameStatus.PLAYING);
    spawnFood(INITIAL_SNAKE, currentLevel);
  }, [currentLevel, spawnFood]);

  const pauseGame = useCallback(() => {
    if (status === GameStatus.PLAYING) {
      setStatus(GameStatus.PAUSED);
    } else if (status === GameStatus.PAUSED) {
      setStatus(GameStatus.PLAYING);
    }
  }, [status]);

  const changeDirection = useCallback((newDir: Direction) => {
    const currentDir = directionRef.current;
    // Prevent 180 degree turns
    if (newDir === Direction.UP && currentDir === Direction.DOWN) return;
    if (newDir === Direction.DOWN && currentDir === Direction.UP) return;
    if (newDir === Direction.LEFT && currentDir === Direction.RIGHT) return;
    if (newDir === Direction.RIGHT && currentDir === Direction.LEFT) return;
    
    directionRef.current = newDir;
    setDirection(newDir);
  }, []);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const currentDir = directionRef.current;
      const newHead = { ...head };

      switch (currentDir) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      // Wall Collision
      if (
        newHead.x < 0 ||
        newHead.x >= BOARD_SIZE ||
        newHead.y < 0 ||
        newHead.y >= BOARD_SIZE
      ) {
        setStatus(GameStatus.GAME_OVER);
        return prevSnake;
      }

      // Self Collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus(GameStatus.GAME_OVER);
        return prevSnake;
      }

      // Obstacle Collision
      if (isObstacle(newHead.x, newHead.y, currentLevel)) {
        setStatus(GameStatus.GAME_OVER);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check Food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        spawnFood(newSnake, currentLevel);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, currentLevel, isObstacle, spawnFood]);

  // Game Loop
  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      // Calculate actual speed interval: base level speed * multiplier
      // Multiplier 1 = Fast (normal), Multiplier 10 = Slow (1/10th speed)
      const tickRate = currentLevel.speed * speedMultiplier;
      gameLoopRef.current = window.setInterval(moveSnake, tickRate);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, moveSnake, currentLevel.speed, speedMultiplier]);

  return {
    snake,
    food,
    direction,
    status,
    score,
    startGame,
    pauseGame,
    changeDirection,
    boardSize: BOARD_SIZE,
    currentLevel,
    levels: LEVELS,
    setLevel,
    speedMultiplier,
    setSpeedMultiplier
  };
};