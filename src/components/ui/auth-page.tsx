'use client';

import React, { useState, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import { Button } from './button';
import { Input } from './input';
import { useAuth } from '@/contexts';
import {
  AtSignIcon,
  ChevronLeftIcon,
  LockIcon,
  GamepadIcon,
  UserIcon,
  Loader2Icon,
} from 'lucide-react';

interface AuthPageProps {
  mode?: 'login' | 'register';
}

export function AuthPage({ mode = 'login' }: AuthPageProps) {
  const navigate = useNavigate();
  const { login, register, loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });

  const isRegister = mode === 'register';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegister) {
        await register(formData.email, formData.password, formData.displayName);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Google login failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2 bg-[#000926]">
      {/* Left Side - Visual */}
      <div className="relative hidden h-full flex-col border-r border-[#0f52ba]/30 lg:flex overflow-hidden" style={{ background: '#000926' }}>
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/img/swordman.webp"
            alt="Katana warrior"
            className="h-full w-full object-cover object-center"
          />
        </div>
        
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#000926] via-[#000926]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent to-[#000926]/60 pointer-events-none" />
        
        {/* Logo */}
        <div className="z-20 flex items-center gap-2 p-10">
          <GamepadIcon className="size-8 text-[#F1F5FF]" />
          <p className="text-2xl font-bold text-[#F1F5FF]">GameHub</p>
        </div>
        
        {/* Quote at bottom */}
        <div className="z-20 mt-auto p-10">
          <blockquote className="space-y-2">
            <p className="text-xl text-[#F1F5FF]">
              {isRegister
                ? '"Sharpen your skills and enter the arena."'
                : '"Join thousands of gamers competing for glory on the ultimate gaming platform."'}
            </p>
            <footer className="font-mono text-sm font-semibold text-[#C4D4EA]">
              {isRegister ? '~ The Katana League' : '~ The Gaming Community'}
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="relative flex min-h-screen flex-col justify-center p-4" style={{ background: 'linear-gradient(180deg, #000926 0%, #0a1628 100%)' }}>
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-96 h-96 rounded-full blur-3xl animate-pulse"
            style={{ backgroundColor: 'rgba(15, 82, 186, 0.2)', top: '10%', right: '10%' }}
          />
          <div 
            className="absolute w-80 h-80 rounded-full blur-3xl animate-pulse"
            style={{ backgroundColor: 'rgba(166, 197, 215, 0.1)', bottom: '20%', left: '5%', animationDelay: '1s' }}
          />
        </div>

        <Button 
          variant="ghost" 
          className="absolute top-7 left-5 text-[#A6c5d7] hover:text-[#D6E6F3] hover:bg-[#0f52ba]/20" 
          asChild
        >
          <Link to="/">
            <ChevronLeftIcon className='size-4 me-2' />
            Home
          </Link>
        </Button>

        <div className="mx-auto space-y-6 w-full max-w-sm relative z-10">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <GamepadIcon className="size-8 text-[#F1F5FF]" />
            <p className="text-2xl font-bold text-[#F1F5FF]">GameHub</p>
          </div>

          <div className="flex flex-col space-y-1">
            <h1 className="text-2xl font-bold tracking-wide text-[#F1F5FF]">
              {isRegister ? 'Create Account' : 'Welcome Back!'}
            </h1>
            <p className="text-base text-[#B9C7D6]">
              {isRegister 
                ? 'Join the gaming community today.' 
                : 'Sign in to continue your gaming journey.'}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Google Login */}
          <div className="space-y-2">
            <Button 
              type="button" 
              size="lg" 
              className="w-full bg-[#0f52ba] hover:bg-[#0f52ba]/80 text-[#D6E6F3]"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2Icon className="size-4 me-2 animate-spin" />
              ) : (
                <GoogleIcon className='size-4 me-2' />
              )}
              Continue with Google
            </Button>
          </div>

          <AuthSeparator />

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isRegister && (
              <div className="relative">
                <Input
                  placeholder="Display Name"
                  className="ps-9 bg-[#000926]/60 border-[#A6c5d7]/30 text-[#D6E6F3] placeholder:text-[#A6c5d7]/60 focus:border-[#0f52ba] focus:ring-[#0f52ba]"
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  required
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                  <UserIcon className="size-4 text-[#A6c5d7]" aria-hidden="true" />
                </div>
              </div>
            )}

            <div className="relative">
              <Input
                placeholder="your.email@example.com"
                className="ps-9 bg-[#000926]/60 border-[#A6c5d7]/30 text-[#D6E6F3] placeholder:text-[#A6c5d7]/60 focus:border-[#0f52ba] focus:ring-[#0f52ba]"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                <AtSignIcon className="size-4 text-[#A6c5d7]" aria-hidden="true" />
              </div>
            </div>

            <div className="relative">
              <Input
                placeholder="Password"
                className="ps-9 bg-[#000926]/60 border-[#A6c5d7]/30 text-[#D6E6F3] placeholder:text-[#A6c5d7]/60 focus:border-[#0f52ba] focus:ring-[#0f52ba]"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                <LockIcon className="size-4 text-[#A6c5d7]" aria-hidden="true" />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#0f52ba] hover:bg-[#0f52ba]/80 text-[#D6E6F3]"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2Icon className="size-4 me-2 animate-spin" />
              ) : null}
              {isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <p className="text-[#B9C7D6] text-sm text-center">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <Link to="/login" className="text-[#0f52ba] hover:text-[#D6E6F3] underline underline-offset-4">
                  Sign In
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/register" className="text-[#0f52ba] hover:text-[#D6E6F3] underline underline-offset-4">
                  Create one
                </Link>
              </>
            )}
          </p>

          <p className="text-[#B9C7D6]/70 text-xs text-center">
            By continuing, you agree to our{' '}
            <a href="#" className="hover:text-[#0f52ba] underline underline-offset-4">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="hover:text-[#0f52ba] underline underline-offset-4">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

function SplineLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#000926]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-[#0f52ba]/20 border-t-[#0f52ba] animate-spin" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-b-[#A6c5d7]/30 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <p className="text-[#A6c5d7] text-sm animate-pulse">Loading 3D Scene...</p>
      </div>
    </div>
  );
}

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <g>
      <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
    </g>
  </svg>
);

const AuthSeparator = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="h-px w-full bg-[#A6c5d7]/30" />
      <span className="text-[#A6c5d7] px-2 text-xs">OR</span>
      <div className="h-px w-full bg-[#A6c5d7]/30" />
    </div>
  );
};

export default AuthPage;
