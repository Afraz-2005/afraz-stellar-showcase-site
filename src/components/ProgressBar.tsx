
import { useEffect, useState } from 'react';
import { useCarousel } from "@/components/ui/carousel";

export const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const { api } = useCarousel();

  useEffect(() => {
    if (!api) return;

    const updateProgress = () => {
      const scrollSnaps = api.scrollSnapList();
      const selectedSnap = api.selectedScrollSnap();
      const percentage = (selectedSnap / (scrollSnaps.length - 1)) * 100;
      setProgress(percentage);
    };

    api.on('select', updateProgress);
    // Initialize progress
    updateProgress();

    return () => {
      api.off('select', updateProgress);
    };
  }, [api]);

  return (
    <div className="fixed bottom-0 left-0 w-full h-1 bg-black/30 z-50">
      <div
        className="h-full bg-primary"
        style={{ 
          width: `${progress}%`,
          transition: 'width 0.3s ease-out'
        }}
      />
    </div>
  );
};
