import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRedo, FaTrophy, FaUser, FaRobot } from 'react-icons/fa';
import { useAuth } from '@/contexts';
import { addScore, incrementPlayCount, getGameIdBySlug } from '@/firebase';
import { SplineBackground } from '@/components/SplineBackground';

type Player = 'X' | 'O' | null;
type Board = Player[];
type Difficulty = 'easy' | 'medium' | 'hard';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6], // Diagonals
];

export const TicTacToe = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'ai' | 'draw' | null>(null);
  const [score, setScore] = useState({ player: 0, ai: 0, draws: 0 });
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  // Check for winner
  const checkWinner = useCallback((squares: Board): { winner: Player; line: number[] | null } => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: combo };
      }
    }
    return { winner: null, line: null };
  }, []);

  // Check if board is full
  const isBoardFull = useCallback((squares: Board): boolean => {
    return squares.every(square => square !== null);
  }, []);

  // Get available moves
  const getAvailableMoves = useCallback((squares: Board): number[] => {
    return squares.reduce<number[]>((moves, square, index) => {
      if (square === null) moves.push(index);
      return moves;
    }, []);
  }, []);

  // Minimax algorithm for AI
  const minimax = useCallback((squares: Board, depth: number, isMaximizing: boolean, alpha: number, beta: number): number => {
    const { winner } = checkWinner(squares);
    
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (isBoardFull(squares)) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of getAvailableMoves(squares)) {
        const newBoard = [...squares];
        newBoard[move] = 'O';
        const evaluation = minimax(newBoard, depth + 1, false, alpha, beta);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of getAvailableMoves(squares)) {
        const newBoard = [...squares];
        newBoard[move] = 'X';
        const evaluation = minimax(newBoard, depth + 1, true, alpha, beta);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }, [checkWinner, isBoardFull, getAvailableMoves]);

  // AI Move
  const getAIMove = useCallback((squares: Board): number => {
    const availableMoves = getAvailableMoves(squares);
    
    if (difficulty === 'easy') {
      // Random move
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    if (difficulty === 'medium') {
      // 50% chance of optimal, 50% random
      if (Math.random() < 0.5) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }
    }
    
    // Hard - use minimax
    let bestMove = availableMoves[0];
    let bestScore = -Infinity;
    
    for (const move of availableMoves) {
      const newBoard = [...squares];
      newBoard[move] = 'O';
      const moveScore = minimax(newBoard, 0, false, -Infinity, Infinity);
      if (moveScore > bestScore) {
        bestScore = moveScore;
        bestMove = move;
      }
    }
    
    return bestMove;
  }, [difficulty, getAvailableMoves, minimax]);

  // Handle cell click
  const handleCellClick = useCallback((index: number) => {
    if (board[index] || gameOver || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const { winner: cellWinner, line } = checkWinner(newBoard);
    
    if (cellWinner === 'X') {
      setWinner('player');
      setWinningLine(line);
      setGameOver(true);
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
      // Save score to Firebase
      if (user) {
        const points = difficulty === 'hard' ? 30 : difficulty === 'medium' ? 20 : 10;
        addScore(user.uid, userProfile?.displayName || 'Anonymous', 'tic-tac-toe', 'Tic Tac Toe', points).catch(console.error);
      }
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner('draw');
      setGameOver(true);
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    setIsPlayerTurn(false);
    
    // AI move with delay
    setTimeout(() => {
      const aiMove = getAIMove(newBoard);
      const aiBoard = [...newBoard];
      aiBoard[aiMove] = 'O';
      setBoard(aiBoard);

      const { winner: aiWinner, line: aiLine } = checkWinner(aiBoard);
      
      if (aiWinner === 'O') {
        setWinner('ai');
        setWinningLine(aiLine);
        setGameOver(true);
        setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
      } else if (isBoardFull(aiBoard)) {
        setWinner('draw');
        setGameOver(true);
        setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
      } else {
        setIsPlayerTurn(true);
      }
    }, 500);
  }, [board, gameOver, isPlayerTurn, checkWinner, isBoardFull, getAIMove, user, userProfile, difficulty]);

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
    setWinningLine(null);
  }, []);

  // Track play count on first game start
  useEffect(() => {
    const trackPlayCount = async () => {
      try {
        const gameId = await getGameIdBySlug('tic-tac-toe');
        if (gameId) {
          await incrementPlayCount(gameId);
        }
      } catch (error) {
        console.error('Error incrementing play count:', error);
      }
    };
    trackPlayCount();
  }, []); // Run once on mount

  // Get cell style
  const getCellStyle = (index: number) => {
    const isWinningCell = winningLine?.includes(index);
    const baseStyle = {
      backgroundColor: isWinningCell ? 'rgba(34, 197, 94, 0.3)' : 'rgba(0, 9, 38, 0.6)',
      border: `2px solid ${isWinningCell ? '#22c55e' : 'rgba(166, 197, 215, 0.3)'}`,
    };
    return baseStyle;
  };

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden bg-transparent">
      <SplineBackground />

      <div className="max-w-lg mx-auto relative z-10">
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
          
          <h1 className="text-2xl font-bold" style={{ color: '#D6E6F3' }}>
            ⭕ Tic Tac Toe ❌
          </h1>
          
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: 'rgba(15, 82, 186, 0.5)', color: '#D6E6F3' }}
          >
            <FaRedo />
          </button>
        </div>

        {/* Difficulty Selector */}
        <div className="flex justify-center gap-2 mb-6">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => { setDifficulty(diff); resetGame(); }}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 capitalize ${
                difficulty === diff ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: difficulty === diff ? '#0f52ba' : 'rgba(166, 197, 215, 0.2)', 
                color: '#D6E6F3' 
              }}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Score Board */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', border: '1px solid rgba(166, 197, 215, 0.2)' }}>
            <FaUser className="mx-auto mb-2 text-xl" style={{ color: '#22c55e' }} />
            <p className="text-sm" style={{ color: '#A6c5d7' }}>You (X)</p>
            <p className="text-2xl font-bold" style={{ color: '#D6E6F3' }}>{score.player}</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', border: '1px solid rgba(166, 197, 215, 0.2)' }}>
            <FaTrophy className="mx-auto mb-2 text-xl text-yellow-400" />
            <p className="text-sm" style={{ color: '#A6c5d7' }}>Draws</p>
            <p className="text-2xl font-bold" style={{ color: '#D6E6F3' }}>{score.draws}</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', border: '1px solid rgba(166, 197, 215, 0.2)' }}>
            <FaRobot className="mx-auto mb-2 text-xl" style={{ color: '#ef4444' }} />
            <p className="text-sm" style={{ color: '#A6c5d7' }}>AI (O)</p>
            <p className="text-2xl font-bold" style={{ color: '#D6E6F3' }}>{score.ai}</p>
          </div>
        </div>

        {/* Game Board */}
        <div 
          className="rounded-2xl p-6 backdrop-blur-xl mb-6"
          style={{ backgroundColor: 'rgba(0, 9, 38, 0.8)', border: '1px solid rgba(166, 197, 215, 0.2)' }}
        >
          {/* Turn Indicator */}
          <div className="text-center mb-4">
            {gameOver ? (
              <p className="text-xl font-bold" style={{ color: winner === 'player' ? '#22c55e' : winner === 'ai' ? '#ef4444' : '#eab308' }}>
                {winner === 'player' ? '🎉 You Win!' : winner === 'ai' ? '🤖 AI Wins!' : "🤝 It's a Draw!"}
              </p>
            ) : (
              <p style={{ color: '#A6c5d7' }}>
                {isPlayerTurn ? "Your turn (X)" : "AI is thinking..."}
              </p>
            )}
          </div>

          {/* Board Grid */}
          <div className="grid grid-cols-3 gap-3 max-w-[300px] mx-auto">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={!!cell || gameOver || !isPlayerTurn}
                className="aspect-square rounded-xl text-5xl font-bold transition-all duration-200 hover:scale-105 disabled:hover:scale-100 flex items-center justify-center"
                style={getCellStyle(index)}
              >
                {cell === 'X' && <span style={{ color: '#22c55e' }}>X</span>}
                {cell === 'O' && <span style={{ color: '#ef4444' }}>O</span>}
              </button>
            ))}
          </div>

          {/* Play Again Button */}
          {gameOver && (
            <button
              onClick={resetGame}
              className="w-full mt-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: '#0f52ba', color: '#D6E6F3' }}
            >
              Play Again
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center text-sm" style={{ color: '#A6c5d7' }}>
          <p>Click a cell to place your X. Beat the AI!</p>
          <p className="mt-1">🏆 Points: Easy +10 | Medium +20 | Hard +30</p>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
