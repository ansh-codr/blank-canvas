import { useEffect, useMemo, useRef, useState } from 'react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { VIDEO_LINKS } from '@/constants';

const DEFAULT_VIDEOS = [
  VIDEO_LINKS.feature1,
  VIDEO_LINKS.feature2,
  VIDEO_LINKS.feature3,
];

const ROUTE_VIDEOS: Record<string, string[]> = {
  '/dashboard': [VIDEO_LINKS.hero1],
  '/leaderboard': [VIDEO_LINKS.hero2],
  '/profile': [VIDEO_LINKS.feature2],
  '/admin': [VIDEO_LINKS.feature4],
};

const GAME_VIDEOS: Record<string, string> = {
  'snake': VIDEO_LINKS.feature5,
  'tictactoe': VIDEO_LINKS.hero3,
  'memory': VIDEO_LINKS.feature1,
  'rps': VIDEO_LINKS.hero4,
  'coin-flip': VIDEO_LINKS.feature2,
  'dice-roll': VIDEO_LINKS.feature3,
  'number-guess': VIDEO_LINKS.hero2,
  'color-match': VIDEO_LINKS.hero1,
  'quick-tap': VIDEO_LINKS.feature4,
  'reaction-time': VIDEO_LINKS.hero3,
  'word-scramble': VIDEO_LINKS.feature5,
  'pattern-memory': VIDEO_LINKS.hero4,
  'lights-out': VIDEO_LINKS.feature1,
  'emoji-hunt': VIDEO_LINKS.feature2,
};

const AUDIO_SOURCE = '/audio/loop.mp3';

export const VideoBackground = () => {
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoSources = useMemo(() => {
    const routeMatch = ROUTE_VIDEOS[location.pathname];
    if (routeMatch?.length) return routeMatch;

    if (location.pathname.startsWith('/games/')) {
      const slug = location.pathname.replace('/games/', '');
      const video = GAME_VIDEOS[slug];
      return video ? [video] : DEFAULT_VIDEOS;
    }

    return DEFAULT_VIDEOS;
  }, [location.pathname]);

  useEffect(() => {
    setCurrentVideo(0);
  }, [videoSources]);

  // Video cycling
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setCurrentVideo((prev) => (prev + 1) % videoSources.length);
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play().catch(() => {});
    }
  }, [currentVideo]);

  // Audio control
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; // 30% volume
      if (!isMuted) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }
  }, [isMuted]);

  const toggleAudio = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Video */}
        <video
          ref={videoRef}
          src={videoSources[currentVideo]}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-[#000926]/60" />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000926]/40 to-[#000926]" />
      </div>

      {/* Background Audio */}
      <audio ref={audioRef} src={AUDIO_SOURCE} loop preload="auto" />

      {/* Audio Toggle Button */}
      <button
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110"
        style={{ 
          backgroundColor: 'rgba(15, 82, 186, 0.5)', 
          border: '1px solid rgba(166, 197, 215, 0.3)' 
        }}
        title={isMuted ? 'Turn on sound' : 'Turn off sound'}
      >
        {isMuted ? (
          <FaVolumeMute className="text-xl text-[#D6E6F3]" />
        ) : (
          <FaVolumeUp className="text-xl text-[#D6E6F3]" />
        )}
      </button>
    </>
  );
};

// Keep SplineBackground as an alias for backward compatibility
export const SplineBackground = VideoBackground;

export default VideoBackground;

