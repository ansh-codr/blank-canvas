import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRedo, FaTrophy, FaClock, FaBrain, FaStar } from 'react-icons/fa';
import { useAuth } from '@/contexts';
import { addScore, incrementPlayCount, getGameIdBySlug } from '@/firebase';
import { SplineBackground } from '@/components/SplineBackground';

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type Difficulty = 'easy' | 'medium' | 'hard';

const EMOJIS = ['🎮', '🎯', '🎪', '🎨', '🎭', '🎰', '🎲', '🎸', '🎹', '🎺', '🎻', '🎼', '🏆', '🏅', '⭐', '💎', '🔮', '🌟'];

const DIFFICULTY_CONFIG = {
  easy: { pairs: 6, gridCols: 4, timeBonus: 5 },
  medium: { pairs: 8, gridCols: 4, timeBonus: 10 },
  hard: { pairs: 12, gridCols: 6, timeBonus: 15 },
};

export const MemoryMatch = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timer, setTimer] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Initialize cards
  const initializeGame = useCallback(() => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const selectedEmojis = EMOJIS.slice(0, config.pairs);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    
    // Shuffle cards
    const shuffled = cardPairs
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimer(0);
    setGameOver(false);
    setShowCelebration(false);
  }, [difficulty]);

  // Start game
  const startGame = useCallback(async () => {
    initializeGame();
    setGameStarted(true);
    
    try {
      const gameId = await getGameIdBySlug('memory-match');
      if (gameId) {
        await incrementPlayCount(gameId);
      }
    } catch (error) {
      console.error('Error incrementing play count:', error);
    }
  }, [initializeGame]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2) return;
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return;

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        // Match found!
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Check for win
  useEffect(() => {
    const config = DIFFICULTY_CONFIG[difficulty];
    if (matchedPairs === config.pairs && gameStarted) {
      setGameOver(true);
      setShowCelebration(true);
      
      // Calculate score
      const timeBonus = Math.max(0, 300 - timer) * config.timeBonus;
      const moveBonus = Math.max(0, (config.pairs * 3 - moves) * 10);
      const baseScore = config.pairs * 50;
      const totalScore = baseScore + timeBonus + moveBonus;
      
      // Save best time
      if (!bestTime || timer < bestTime) {
        setBestTime(timer);
      }
      
      // Save score to Firebase
      if (user && totalScore > 0) {
        addScore(
          user.uid,
          userProfile?.displayName || 'Anonymous',
          'memory-match',
          'Memory Match',
          totalScore
        ).catch(console.error);
      }
    }
  }, [matchedPairs, gameStarted, difficulty, timer, moves, user, userProfile, bestTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const config = DIFFICULTY_CONFIG[difficulty];

  return (
    <div className="min-h-screen py-6 px-4 relative overflow-hidden bg-transparent">
      <SplineBackground />

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              <FaStar className="text-yellow-400 text-2xl" />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(166, 197, 215, 0.2)', color: '#D6E6F3' }}
          >
            <FaArrowLeft />
            Back
          </button>
          
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3" style={{ color: '#D6E6F3' }}>
            <FaBrain className="text-purple-400" />
            Memory Match
          </h1>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl" style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)' }}>
            <FaTrophy className="text-yellow-400" />
            <span style={{ color: '#D6E6F3' }}>{bestTime ? formatTime(bestTime) : '--:--'}</span>
          </div>
        </div>

        {/* Game Container */}
        <div 
          className="rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden"
          style={{ 
            backgroundColor: 'rgba(0, 9, 38, 0.8)', 
            border: '1px solid rgba(166, 197, 215, 0.2)',
            boxShadow: '0 0 60px rgba(15, 82, 186, 0.3), inset 0 0 60px rgba(15, 82, 186, 0.1)'
          }}
        >
          {/* Animated background glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30 animate-pulse" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-30 animate-pulse" style={{ background: 'radial-gradient(circle, #0f52ba, transparent)', animationDelay: '1s' }} />

          {!gameStarted ? (
            // Start Screen
            <div className="text-center py-12 relative z-10">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center animate-bounce" style={{ background: 'linear-gradient(135deg, #8b5cf6, #0f52ba)' }}>
                <span className="text-5xl">🧠</span>
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#D6E6F3' }}>Ready to Test Your Memory?</h2>
              <p className="mb-8" style={{ color: '#A6c5d7' }}>Match all the pairs as fast as you can!</p>
              
              {/* Difficulty Selection */}
              <div className="flex justify-center gap-3 mb-8">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 capitalize ${
                      difficulty === diff ? 'scale-105' : 'opacity-70'
                    }`}
                    style={{
                      background: difficulty === diff 
                        ? diff === 'easy' ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                        : diff === 'medium' ? 'linear-gradient(135deg, #eab308, #ca8a04)'
                        : 'linear-gradient(135deg, #ef4444, #dc2626)'
                        : 'rgba(166, 197, 215, 0.1)',
                      color: '#D6E6F3',
                      border: difficulty === diff ? 'none' : '1px solid rgba(166, 197, 215, 0.2)',
                    }}
                  >
                    {diff}
                    <span className="block text-xs opacity-70">{DIFFICULTY_CONFIG[diff].pairs} pairs</span>
                  </button>
                ))}
              </div>

              <button
                onClick={startGame}
                className="px-10 py-4 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-110 animate-pulse"
                style={{ 
                  background: 'linear-gradient(135deg, #8b5cf6, #0f52ba)',
                  color: '#D6E6F3',
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)'
                }}
              >
                🎮 Start Game
              </button>
            </div>
          ) : (
            // Game Board
            <div className="relative z-10">
              {/* Stats Bar */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}>
                  <FaClock className="text-purple-400" />
                  <span className="font-mono text-xl font-bold" style={{ color: '#D6E6F3' }}>{formatTime(timer)}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xs" style={{ color: '#A6c5d7' }}>Moves</p>
                    <p className="text-2xl font-bold" style={{ color: '#D6E6F3' }}>{moves}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs" style={{ color: '#A6c5d7' }}>Matched</p>
                    <p className="text-2xl font-bold" style={{ color: '#22c55e' }}>{matchedPairs}/{config.pairs}</p>
                  </div>
                </div>

                <button
                  onClick={initializeGame}
                  className="p-3 rounded-xl transition-all duration-300 hover:scale-110"
                  style={{ backgroundColor: 'rgba(166, 197, 215, 0.2)', color: '#D6E6F3' }}
                >
                  <FaRedo />
                </button>
              </div>

              {/* Cards Grid */}
              <div 
                className="grid gap-3 justify-center"
                style={{ 
                  gridTemplateColumns: `repeat(${config.gridCols}, minmax(0, 1fr))`,
                  maxWidth: config.gridCols === 6 ? '600px' : '400px',
                  margin: '0 auto'
                }}
              >
                {cards.map((card, index) => (
                  <div
                    key={card.id}
                    onClick={() => !gameOver && handleCardClick(index)}
                    className="aspect-square cursor-pointer perspective-1000"
                    style={{ perspective: '1000px' }}
                  >
                    <div
                      className="relative w-full h-full transition-all duration-500 preserve-3d"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}
                    >
                      {/* Card Back */}
                      <div
                        className="absolute inset-0 rounded-xl flex items-center justify-center backface-hidden transition-all duration-300 hover:scale-105"
                        style={{
                          backfaceVisibility: 'hidden',
                          background: 'linear-gradient(135deg, #0f52ba, #000926)',
                          border: '2px solid rgba(139, 92, 246, 0.5)',
                          boxShadow: '0 0 20px rgba(15, 82, 186, 0.3), inset 0 0 20px rgba(139, 92, 246, 0.1)',
                        }}
                      >
                        <span className="text-3xl opacity-50">❓</span>
                      </div>
                      
                      {/* Card Front */}
                      <div
                        className="absolute inset-0 rounded-xl flex items-center justify-center backface-hidden"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          background: card.isMatched 
                            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.4), rgba(22, 163, 74, 0.4))'
                            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(15, 82, 186, 0.3))',
                          border: card.isMatched 
                            ? '2px solid rgba(34, 197, 94, 0.8)'
                            : '2px solid rgba(139, 92, 246, 0.5)',
                          boxShadow: card.isMatched 
                            ? '0 0 30px rgba(34, 197, 94, 0.5)'
                            : '0 0 20px rgba(139, 92, 246, 0.3)',
                        }}
                      >
                        <span className={`text-3xl md:text-4xl ${card.isMatched ? 'animate-bounce' : ''}`}>
                          {card.emoji}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Win Modal */}
              {gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl">
                  <div 
                    className="text-center p-8 rounded-2xl animate-bounce-in"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(15, 82, 186, 0.9))',
                      boxShadow: '0 0 60px rgba(139, 92, 246, 0.5)'
                    }}
                  >
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-3xl font-bold mb-2" style={{ color: '#D6E6F3' }}>Amazing!</h3>
                    <p className="mb-4" style={{ color: '#A6c5d7' }}>
                      Time: {formatTime(timer)} | Moves: {moves}
                    </p>
                    <button
                      onClick={startGame}
                      className="px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: '#22c55e', color: 'white' }}
                    >
                      Play Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MemoryMatch;
