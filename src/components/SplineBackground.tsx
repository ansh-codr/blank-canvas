import { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

function SplineLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#000926]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-[#0f52ba]/20 border-t-[#0f52ba] animate-spin" />
        </div>
      </div>
    </div>
  );
}

export const SplineBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Suspense fallback={<SplineLoader />}>
        <Spline 
          scene="https://prod.spline.design/v1PGEa4gzxXiUSP1/scene.splinecode"
          className="w-full h-full"
        />
      </Suspense>
      {/* Overlay for better content readability */}
      <div className="absolute inset-0 bg-[#000926]/60" />
    </div>
  );
};

export default SplineBackground;
