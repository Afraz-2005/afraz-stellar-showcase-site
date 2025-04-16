
import React, { useEffect, useRef } from 'react';

export const BackgroundAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Gradient spots
    const spots = Array.from({ length: 3 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: Math.random() * 300 + 100,
    }));

    const animate = () => {
      ctx.fillStyle = 'rgba(26, 31, 44, 0.1)'; // Dark background with slight transparency
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      spots.forEach((spot) => {
        // Move spot
        spot.x += spot.vx;
        spot.y += spot.vy;

        // Bounce off walls
        if (spot.x < 0 || spot.x > canvas.width) spot.vx *= -1;
        if (spot.y < 0 || spot.y > canvas.height) spot.vy *= -1;

        // Create gradient
        const gradient = ctx.createRadialGradient(
          spot.x, spot.y, 0,
          spot.x, spot.y, spot.radius
        );
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.2)'); // Primary color
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ background: '#1A1F2C' }}
    />
  );
};

