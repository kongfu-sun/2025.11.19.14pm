import React, { useState } from 'react';
import { GameTheme } from '../types';
import { generateGameTheme } from '../services/geminiService';

interface ThemeCreatorProps {
  onThemeApply: (theme: GameTheme) => void;
  currentTheme: GameTheme;
}

export const ThemeCreator: React.FC<ThemeCreatorProps> = ({ onThemeApply, currentTheme }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const theme = await generateGameTheme(prompt);
      onThemeApply(theme);
    } catch (err) {
      setError("Failed to generate theme. Is the API Key valid?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="p-6 rounded-xl shadow-lg w-full max-w-md mb-6"
      style={{ backgroundColor: currentTheme.backgroundColor, border: `2px solid ${currentTheme.gridColor}` }}
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: currentTheme.textColor }}>AI Theme Studio</h3>
      
      <div className="flex flex-col gap-3">
        <label className="text-sm opacity-80" style={{ color: currentTheme.textColor }}>
          Describe a vibe (e.g., "Cyberpunk City", "Candy Land", "Matrix"):
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter theme idea..."
            className="flex-1 px-4 py-2 rounded-lg bg-black/20 border focus:outline-none focus:ring-2"
            style={{ 
              color: currentTheme.textColor, 
              borderColor: currentTheme.gridColor,
              caretColor: currentTheme.snakeHeadColor
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center min-w-[100px]`}
            style={{ 
              backgroundColor: currentTheme.snakeHeadColor, 
              color: currentTheme.backgroundColor 
            }}
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-b-transparent rounded-full" style={{ borderColor: currentTheme.backgroundColor }}></span>
            ) : (
              "Generate"
            )}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        <p className="text-xs opacity-50" style={{ color: currentTheme.textColor }}>
          Powered by Gemini 2.5 Flash
        </p>
      </div>
    </div>
  );
};