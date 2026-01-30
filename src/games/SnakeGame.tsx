import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaRedo, FaTrophy } from 'react-icons/fa';
import { useAuth } from '@/contexts';
import { addScore } from '@/firebase';
import { SplineBackground } from '@/components/SplineBackground';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

export const SnakeGame = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const directionRef = useRef(direction);

  // Generate random food position
  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setGameRunning(false);
  }, [generateFood]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning && !gameOver && e.key === ' ') {
        setGameRunning(true);
        return;
      }

      const keyDirections: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        w: 'UP',
        s: 'DOWN',
        a: 'LEFT',
        d: 'RIGHT',
        W: 'UP',
        S: 'DOWN',
        A: 'LEFT',
        D: 'RIGHT',
      };

      const newDirection = keyDirections[e.key];
      if (!newDirection) return;

      const opposites: Record<Direction, Direction> = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT',
      };

      if (opposites[newDirection] !== directionRef.current) {
        setDirection(newDirection);
        directionRef.current = newDirection;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameRunning, gameOver]);

  // Game loop
  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };

        switch (directionRef.current) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          setGameRunning(false);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          setGameRunning(false);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => {
            const newScore = prev + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
            }
            return newScore;
          });
          setFood(generateFood(newSnake));
          // Increase speed every 50 points
          setSpeed(prev => Math.max(50, prev - 5));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [gameRunning, gameOver, food, generateFood, highScore, speed]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000926';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(15, 82, 186, 0.2)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake with glow effect
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const alpha = 1 - (index / snake.length) * 0.5;
      
      // Glow effect
      ctx.shadowColor = '#0f52ba';
      ctx.shadowBlur = isHead ? 15 : 10;
      
      // Snake body
      const gradient = ctx.createRadialGradient(
        segment.x * CELL_SIZE + CELL_SIZE / 2,
        segment.y * CELL_SIZE + CELL_SIZE / 2,
        0,
        segment.x * CELL_SIZE + CELL_SIZE / 2,
        segment.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2
      );
      
      if (isHead) {
        gradient.addColorStop(0, '#D6E6F3');
        gradient.addColorStop(1, '#0f52ba');
      } else {
        gradient.addColorStop(0, `rgba(166, 197, 215, ${alpha})`);
        gradient.addColorStop(1, `rgba(15, 82, 186, ${alpha})`);
      }
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2,
        4
      );
      ctx.fill();
      
      ctx.shadowBlur = 0;
    });

    // Draw food with pulsing glow
    const time = Date.now() / 500;
    const pulse = Math.sin(time) * 0.3 + 0.7;
    
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 20 * pulse;
    
    const foodGradient = ctx.createRadialGradient(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      0,
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2
    );
    foodGradient.addColorStop(0, '#ff6b6b');
    foodGradient.addColorStop(1, '#ee5a5a');
    
    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [snake, food]);

  // Animation frame for food pulse
  useEffect(() => {
    if (!gameRunning) return;
    
    let animationId: number;
    const animate = () => {
      // Force re-render for food pulse animation
      setFood(f => ({ ...f }));
      animationId = requestAnimationFrame(animate);
    };
    
    const intervalId = setInterval(() => {
      setFood(f => ({ ...f }));
    }, 100);
    
    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(intervalId);
    };
  }, [gameRunning]);

  // Save score when game ends
  useEffect(() => {
    if (gameOver && score > 0 && user) {
      addScore(
        user.uid,
        userProfile?.displayName || 'Anonymous',
        'neon-snake',
        'Neon Snake',
        score
      ).catch(console.error);
    }
  }, [gameOver, score, user, userProfile]);

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden bg-transparent">
      {/* Spline 3D Background */}
      <SplineBackground />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: 'rgba(166, 197, 215, 0.2)', color: '#D6E6F3' }}
          >
            <FaArrowLeft />
            Back
          </button>
          
          <h1 className="text-3xl font-bold" style={{ color: '#D6E6F3' }}>
            🐍 Neon Snake
          </h1>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)' }}>
            <FaTrophy className="text-yellow-400" />
            <span style={{ color: '#D6E6F3' }}>{highScore}</span>
          </div>
        </div>

        {/* Game Container */}
        <div 
          className="rounded-2xl p-6 backdrop-blur-xl"
          style={{ backgroundColor: 'rgba(0, 9, 38, 0.8)', border: '1px solid rgba(166, 197, 215, 0.2)' }}
        >
          {/* Score Display */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg" style={{ color: '#A6c5d7' }}>
              Score: <span className="font-bold text-2xl" style={{ color: '#D6E6F3' }}>{score}</span>
            </div>
            <div className="text-sm" style={{ color: '#A6c5d7' }}>
              Speed: {Math.round((INITIAL_SPEED - speed) / 5) + 1}x
            </div>
          </div>

          {/* Canvas */}
          <div className="relative flex justify-center">
            <canvas
              ref={canvasRef}
              width={GRID_SIZE * CELL_SIZE}
              height={GRID_SIZE * CELL_SIZE}
              className="rounded-xl"
              style={{ border: '2px solid rgba(15, 82, 186, 0.5)' }}
            />

            {/* Overlay for game states */}
            {(!gameRunning || gameOver) && (
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(0, 9, 38, 0.85)' }}
              >
                {gameOver ? (
                  <>
                    <h2 className="text-3xl font-bold mb-2" style={{ color: '#ff6b6b' }}>
                      Game Over!
                    </h2>
                    <p className="text-xl mb-4" style={{ color: '#D6E6F3' }}>
                      Final Score: {score}
                    </p>
                    {score === highScore && score > 0 && (
                      <p className="text-lg mb-4 text-yellow-400">🎉 New High Score!</p>
                    )}
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: '#0f52ba', color: '#D6E6F3' }}
                    >
                      <FaRedo />
                      Play Again
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#D6E6F3' }}>
                      Ready to Play?
                    </h2>
                    <p className="text-sm mb-6 text-center" style={{ color: '#A6c5d7' }}>
                      Use Arrow Keys or WASD to move<br />
                      Eat the red food to grow<br />
                      Don't hit the walls or yourself!
                    </p>
                    <button
                      onClick={() => setGameRunning(true)}
                      className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: '#0f52ba', color: '#D6E6F3' }}
                    >
                      <FaPlay />
                      Start Game
                    </button>
                    <p className="text-xs mt-4" style={{ color: '#A6c5d7' }}>
                      or press SPACE to start
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          {gameRunning && !gameOver && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setGameRunning(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: 'rgba(166, 197, 215, 0.2)', color: '#D6E6F3' }}
              >
                <FaPause />
                Pause
              </button>
            </div>
          )}

          {/* Mobile Controls */}
          <div className="mt-6 grid grid-cols-3 gap-2 max-w-[200px] mx-auto md:hidden">
            <div />
            <button
              onTouchStart={() => { if (directionRef.current !== 'DOWN') { setDirection('UP'); directionRef.current = 'UP'; }}}
              className="p-4 rounded-xl text-2xl"
              style={{ backgroundColor: 'rgba(15, 82, 186, 0.3)', color: '#D6E6F3' }}
            >
              ↑
            </button>
            <div />
            <button
              onTouchStart={() => { if (directionRef.current !== 'RIGHT') { setDirection('LEFT'); directionRef.current = 'LEFT'; }}}
              className="p-4 rounded-xl text-2xl"
              style={{ backgroundColor: 'rgba(15, 82, 186, 0.3)', color: '#D6E6F3' }}
            >
              ←
            </button>
            <button
              onTouchStart={() => { if (directionRef.current !== 'UP') { setDirection('DOWN'); directionRef.current = 'DOWN'; }}}
              className="p-4 rounded-xl text-2xl"
              style={{ backgroundColor: 'rgba(15, 82, 186, 0.3)', color: '#D6E6F3' }}
            >
              ↓
            </button>
            <button
              onTouchStart={() => { if (directionRef.current !== 'LEFT') { setDirection('RIGHT'); directionRef.current = 'RIGHT'; }}}
              className="p-4 rounded-xl text-2xl"
              style={{ backgroundColor: 'rgba(15, 82, 186, 0.3)', color: '#D6E6F3' }}
            >
              →
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-sm" style={{ color: '#A6c5d7' }}>
          <p>🎮 Desktop: Arrow Keys or WASD | 📱 Mobile: Touch Controls</p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
