import { useEffect, useRef, useState } from 'react';

const VIDEO_SOURCES = [
  '/videos/feature-1.mp4',
  '/videos/feature-2.mp4',
  '/videos/feature-3.mp4',
];

export const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideo, setCurrentVideo] = useState(0);

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

  return (
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
  );
};

// Keep SplineBackground as an alias for backward compatibility
export const SplineBackground = VideoBackground;

export default VideoBackground;

