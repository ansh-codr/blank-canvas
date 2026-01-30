import { useEffect, useRef, useState } from 'react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const VIDEO_SOURCES = [
  '/videos/feature-1.mp4',
  '/videos/feature-2.mp4',
  '/videos/feature-3.mp4',
];

const AUDIO_SOURCE = '/audio/loop.mp3';

export const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Video cycling
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setCurrentVideo((prev) => (prev + 1) % VIDEO_SOURCES.length);
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
          src={VIDEO_SOURCES[currentVideo]}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-[#000926]/80" />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000926]/50 to-[#000926]" />
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

