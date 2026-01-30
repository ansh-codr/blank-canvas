import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFire, FaHandRock, FaHandPaper, FaHandScissors } from 'react-icons/fa';
import { useAuth } from '@/contexts';
import { addScore, incrementPlayCount, getGameIdBySlug } from '@/firebase';
import { SplineBackground } from '@/components/SplineBackground';

type Choice = 'rock' | 'paper' | 'scissors' | null;
type Result = 'win' | 'lose' | 'draw' | null;
type GameMode = 'best-of-3' | 'best-of-5' | 'endless';

const CHOICES: { id: Choice; emoji: string; icon: React.ComponentType<{ className?: string }>; beats: Choice }[] = [
  { id: 'rock', emoji: '🪨', icon: FaHandRock, beats: 'scissors' },
  { id: 'paper', emoji: '📄', icon: FaHandPaper, beats: 'rock' },
  { id: 'scissors', emoji: '✂️', icon: FaHandScissors, beats: 'paper' },
];

const RESULT_MESSAGES = {
  win: ['Crushing it! 💪', 'You rock! 🔥', 'Unstoppable! ⚡', 'Legendary! 👑'],
  lose: ['Ouch! 😵', 'Try again! 💀', 'So close! 😤', 'Next time! 🎯'],
  draw: ["It's a tie! 🤝", 'Great minds! 🧠', 'Balanced! ⚖️', 'Even match! 🎭'],
};

export const RockPaperScissors = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [aiChoice, setAiChoice] = useState<Choice>(null);
  const [result, setResult] = useState<Result>(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [gameMode, setGameMode] = useState<GameMode>('best-of-3');
  const [gameStarted, setGameStarted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [roundNumber, setRoundNumber] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [shakeHands, setShakeHands] = useState(false);

  // Track play count
  useEffect(() => {
    const trackPlayCount = async () => {
      try {
        const gameId = await getGameIdBySlug('rock-paper-scissors');
        if (gameId) {
          await incrementPlayCount(gameId);
        }
      } catch (error) {
        console.error('Error incrementing play count:', error);
      }
    };
    if (gameStarted) {
      trackPlayCount();
    }
  }, [gameStarted]);

  // Determine winner
  const determineWinner = useCallback((player: Choice, ai: Choice): Result => {
    if (player === ai) return 'draw';
    const playerData = CHOICES.find(c => c.id === player);
    return playerData?.beats === ai ? 'win' : 'lose';
  }, []);

  // Handle choice
  const handleChoice = useCallback((choice: Choice) => {
    if (isAnimating || gameOver) return;

    setIsAnimating(true);
    setShakeHands(true);
    setPlayerChoice(choice);
    setShowResult(false);

    // Shake animation
    setTimeout(() => {
      setShakeHands(false);
      
      // AI chooses
      const aiPick = CHOICES[Math.floor(Math.random() * 3)].id;
      setAiChoice(aiPick);

      // Determine result
      const roundResult = determineWinner(choice, aiPick);
      setResult(roundResult);
      setRoundNumber(prev => prev + 1);

      // Update scores
      if (roundResult === 'win') {
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
        setStreak(prev => {
          const newStreak = prev + 1;
          if (newStreak > bestStreak) setBestStreak(newStreak);
          return newStreak;
        });
      } else if (roundResult === 'lose') {
        setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
        setStreak(0);
      }

      // Set result message
      const messages = RESULT_MESSAGES[roundResult!];
      setResultMessage(messages[Math.floor(Math.random() * messages.length)]);
      setShowResult(true);
      setIsAnimating(false);
    }, 1500);
  }, [isAnimating, gameOver, determineWinner, bestStreak]);

  // Check for game end
  useEffect(() => {
    const requiredWins = gameMode === 'best-of-3' ? 2 : gameMode === 'best-of-5' ? 3 : Infinity;
    
    if (score.player >= requiredWins || score.ai >= requiredWins) {
      setGameOver(true);
      
      // Save score to Firebase
      if (user && score.player > 0) {
        const points = score.player * 10 + bestStreak * 5;
        addScore(
          user.uid,
          userProfile?.displayName || 'Anonymous',
          'rock-paper-scissors',
          'Rock Paper Scissors',
          points
        ).catch(console.error);
      }
    }
  }, [score, gameMode, user, userProfile, bestStreak]);

  // Reset game
  const resetGame = () => {
    setPlayerChoice(null);
    setAiChoice(null);
    setResult(null);
    setScore({ player: 0, ai: 0 });
    setStreak(0);
    setRoundNumber(0);
    setGameOver(false);
    setShowResult(false);
  };

  // Start game
  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameStarted(true);
    resetGame();
  };

  const getChoiceData = (choice: Choice) => CHOICES.find(c => c.id === choice);

  return (
    <div className="min-h-screen py-6 px-4 relative overflow-hidden bg-transparent">
      <SplineBackground />

      <div className="max-w-2xl mx-auto relative z-10">
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
          
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: '#D6E6F3' }}>
            ✊ Rock Paper Scissors ✂️
          </h1>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl" style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)' }}>
            <FaFire className="text-orange-400" />
            <span style={{ color: '#D6E6F3' }}>{bestStreak}</span>
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
          {/* Animated orbs */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-40 animate-pulse" style={{ background: 'radial-gradient(circle, #ef4444, transparent)' }} />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-40 animate-pulse" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-20 animate-ping" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', animationDuration: '3s' }} />

          {!gameStarted ? (
            // Mode Selection
            <div className="text-center py-8 relative z-10">
              <div className="flex justify-center gap-4 mb-6 text-6xl">
                <span className="animate-bounce" style={{ animationDelay: '0s' }}>✊</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>✋</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>✌️</span>
              </div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#D6E6F3' }}>Choose Your Battle!</h2>
              <p className="mb-8" style={{ color: '#A6c5d7' }}>Select a game mode to begin</p>
              
              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <button
                  onClick={() => startGame('best-of-3')}
                  className="p-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 group"
                  style={{ 
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <span className="text-white">🎯 Best of 3</span>
                  <p className="text-sm text-green-100 opacity-80">Quick match • First to 2 wins</p>
                </button>
                
                <button
                  onClick={() => startGame('best-of-5')}
                  className="p-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
                  style={{ 
                    background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                    boxShadow: '0 0 30px rgba(234, 179, 8, 0.3)'
                  }}
                >
                  <span className="text-white">⚔️ Best of 5</span>
                  <p className="text-sm text-yellow-100 opacity-80">Standard match • First to 3 wins</p>
                </button>
                
                <button
                  onClick={() => startGame('endless')}
                  className="p-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
                  style={{ 
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <span className="text-white">🔥 Endless Mode</span>
                  <p className="text-sm text-red-100 opacity-80">Infinite rounds • Build your streak!</p>
                </button>
              </div>
            </div>
          ) : (
            // Game Screen
            <div className="relative z-10">
              {/* Score Board */}
              <div className="flex justify-between items-center mb-8">
                <div className="text-center flex-1">
                  <p className="text-sm mb-1" style={{ color: '#A6c5d7' }}>You</p>
                  <p className="text-4xl font-bold" style={{ color: '#22c55e' }}>{score.player}</p>
                </div>
                
                <div className="text-center px-6">
                  <div className="text-3xl font-bold" style={{ color: '#D6E6F3' }}>VS</div>
                  <p className="text-xs" style={{ color: '#A6c5d7' }}>Round {roundNumber + 1}</p>
                  {streak > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <FaFire className="text-orange-400 animate-pulse" />
                      <span className="text-orange-400 font-bold">{streak}</span>
                    </div>
                  )}
                </div>
                
                <div className="text-center flex-1">
                  <p className="text-sm mb-1" style={{ color: '#A6c5d7' }}>AI</p>
                  <p className="text-4xl font-bold" style={{ color: '#ef4444' }}>{score.ai}</p>
                </div>
              </div>

              {/* Battle Arena */}
              <div className="flex justify-center items-center gap-8 mb-8 min-h-[150px]">
                {/* Player Choice */}
                <div className={`text-center transition-all duration-300 ${shakeHands ? 'animate-shake' : ''}`}>
                  <div 
                    className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-5xl md:text-6xl transition-all duration-500 ${
                      showResult && result === 'win' ? 'scale-110 ring-4 ring-green-400' : 
                      showResult && result === 'lose' ? 'scale-90 opacity-60' : ''
                    }`}
                    style={{ 
                      background: playerChoice ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(166, 197, 215, 0.1)',
                      boxShadow: playerChoice ? '0 0 40px rgba(59, 130, 246, 0.5)' : 'none'
                    }}
                  >
                    {playerChoice ? getChoiceData(playerChoice)?.emoji : '❓'}
                  </div>
                  <p className="mt-2 font-medium capitalize" style={{ color: '#D6E6F3' }}>
                    {playerChoice || 'Choose...'}
                  </p>
                </div>

                {/* VS Divider */}
                <div className="text-4xl font-bold animate-pulse" style={{ color: 'rgba(166, 197, 215, 0.5)' }}>⚡</div>

                {/* AI Choice */}
                <div className={`text-center transition-all duration-300 ${shakeHands ? 'animate-shake' : ''}`}>
                  <div 
                    className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-5xl md:text-6xl transition-all duration-500 ${
                      showResult && result === 'lose' ? 'scale-110 ring-4 ring-red-400' : 
                      showResult && result === 'win' ? 'scale-90 opacity-60' : ''
                    }`}
                    style={{ 
                      background: aiChoice ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(166, 197, 215, 0.1)',
                      boxShadow: aiChoice ? '0 0 40px rgba(239, 68, 68, 0.5)' : 'none'
                    }}
                  >
                    {shakeHands ? '🤜' : aiChoice ? getChoiceData(aiChoice)?.emoji : '🤖'}
                  </div>
                  <p className="mt-2 font-medium capitalize" style={{ color: '#D6E6F3' }}>
                    {aiChoice || 'Waiting...'}
                  </p>
                </div>
              </div>

              {/* Result Message */}
              {showResult && !gameOver && (
                <div 
                  className={`text-center py-4 mb-6 rounded-2xl animate-bounce-in ${
                    result === 'win' ? 'bg-green-500/20' : result === 'lose' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                  }`}
                >
                  <p className={`text-2xl font-bold ${
                    result === 'win' ? 'text-green-400' : result === 'lose' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {resultMessage}
                  </p>
                </div>
              )}

              {/* Choice Buttons */}
              {!gameOver && (
                <div className="flex justify-center gap-4">
                  {CHOICES.map((choice) => {
                    const Icon = choice.icon;
                    return (
                      <button
                        key={choice.id}
                        onClick={() => handleChoice(choice.id)}
                        disabled={isAnimating}
                        className={`group relative p-4 md:p-6 rounded-2xl transition-all duration-300 hover:scale-110 ${
                          isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'
                        } ${playerChoice === choice.id && showResult ? 'ring-2 ring-blue-400' : ''}`}
                        style={{ 
                          background: 'linear-gradient(135deg, rgba(15, 82, 186, 0.4), rgba(0, 9, 38, 0.6))',
                          border: '2px solid rgba(166, 197, 215, 0.3)',
                        }}
                      >
                        <span className="text-4xl md:text-5xl block group-hover:scale-125 transition-transform">
                          {choice.emoji}
                        </span>
                        <Icon className="absolute -bottom-1 -right-1 text-white/30 text-2xl" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Game Over */}
              {gameOver && (
                <div className="text-center py-6">
                  <div className={`text-6xl mb-4 ${score.player > score.ai ? 'animate-bounce' : ''}`}>
                    {score.player > score.ai ? '🏆' : '😵'}
                  </div>
                  <h3 className="text-3xl font-bold mb-2" style={{ color: score.player > score.ai ? '#22c55e' : '#ef4444' }}>
                    {score.player > score.ai ? 'Victory!' : 'Defeat!'}
                  </h3>
                  <p className="mb-2" style={{ color: '#A6c5d7' }}>
                    Final Score: {score.player} - {score.ai}
                  </p>
                  <p className="mb-6" style={{ color: '#A6c5d7' }}>
                    Best Streak: {bestStreak} 🔥
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={resetGame}
                      className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white' }}
                    >
                      Play Again
                    </button>
                    <button
                      onClick={() => setGameStarted(false)}
                      className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                      style={{ background: 'rgba(166, 197, 215, 0.2)', color: '#D6E6F3' }}
                    >
                      Change Mode
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out infinite;
        }
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

export default RockPaperScissors;
