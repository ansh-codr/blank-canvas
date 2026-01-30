import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Login, Register, Profile, Dashboard, Leaderboard, Admin } from "@/pages";
import { SnakeGame, TicTacToe, MemoryMatch, RockPaperScissors } from "@/games";
import App from "@/app";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/snake"
            element={
              <ProtectedRoute>
                <SnakeGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/tictactoe"
            element={
              <ProtectedRoute>
                <TicTacToe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/memory"
            element={
              <ProtectedRoute>
                <MemoryMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/rps"
            element={
              <ProtectedRoute>
                <RockPaperScissors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
