export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Level {
  id: number;
  name: string;
  speed: number;
  obstacles: Coordinate[];
}

export interface GameTheme {
  name: string;
  backgroundColor: string; // CSS hex or valid color string
  gridColor: string;
  snakeHeadColor: string;
  snakeBodyColor: string;
  foodColor: string;
  foodEmoji: string;
  textColor: string;
}

export interface ScoreEntry {
  timestamp: number;
  score: number;
  levelName?: string;
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}