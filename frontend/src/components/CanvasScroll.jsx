import React, { useEffect, useRef, useState } from 'react';
import { FRAME_IMAGES } from '../data/framesData';

export default function CanvasScroll({ onFrameChange, currentFrameIndex, isAutoFlight }) {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  // Animation state refs for smooth lerping & parallax
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const animFrameIdRef = useRef(null);

  // Mouse cursor tracking for 3D parallax movement
  const targetMouseXRef = useRef(0);
  const targetMouseYRef = useRef(0);
  const currentMouseXRef = useRef(0);
  const currentMouseYRef = useRef(0);

  // Background floating dust particles for futuristic atmosphere
  const particlesRef = useRef([]);

  // Mouse move listener: tracks cursor to dynamically tilt & shift background image
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize cursor coordinate between -1.0 and 1.0 relative to window center
      targetMouseXRef.current = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseYRef.current = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mouse drag & touch drag listener: allows user to scrub frames by dragging cursor
  useEffect(() => {
    let isDragging = false;
    let startY = 0;
    let startScroll = 0;

    const handleMouseDown = (e) => {
      // Don't drag if clicking on buttons, links, or open modals
      if (e.target.closest('button, a, input, select, .pointer-events-auto')) return;
      isDragging = true;
      startY = e.clientY;
      startScroll = window.scrollY;
    };

    const handleMouseMoveDrag = (e) => {
      if (!isDragging) return;
      const deltaY = (startY - e.clientY) * 2.2;
      window.scrollTo({
        top: startScroll + deltaY,
        behavior: 'auto'
      });
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMoveDrag);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch support for mobile / tablets
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
        startScroll = window.scrollY;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        const deltaY = (startY - e.touches[0].clientY) * 1.5;
        window.scrollTo({
          top: startScroll + deltaY,
          behavior: 'auto'
        });
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMoveDrag);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Initialize atmospheric floating particles
  useEffect(() => {
    const particleCount = 45;
    const pts = [];
    for (let i = 0; i < particleCount; i++) {
      pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    particlesRef.current = pts;
  }, []);

  // Preload all 9 frames
  useEffect(() => {
    let loaded = 0;
    const imgArray = [];

    FRAME_IMAGES.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded += 1;
        setLoadedCount(loaded);
        if (loaded === FRAME_IMAGES.length) {
          setIsReady(true);
        }
      };
      img.onerror = () => {
        console.error(`Failed to load frame image: ${src}`);
        loaded += 1;
        setLoadedCount(loaded);
        if (loaded === FRAME_IMAGES.length) {
          setIsReady(true);
        }
      };
      imgArray[idx] = img;
    });

    setImages(imgArray);
  }, []);

  // Handle scroll listener to update targetFrameRef
  useEffect(() => {
    if (!isReady || isAutoFlight) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      const targetIndex = progress * (FRAME_IMAGES.length - 1);
      targetFrameRef.current = targetIndex;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isReady, isAutoFlight]);

  // Handle Auto-Flight Mode loop
  useEffect(() => {
    if (!isAutoFlight || !isReady) return;

    let startTime = null;
    const duration = 16000; // 16 seconds full loop cycle

    const autoFlightStep = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      targetFrameRef.current = progress * (FRAME_IMAGES.length - 1);
      animFrameIdRef.current = requestAnimationFrame(autoFlightStep);
    };

    animFrameIdRef.current = requestAnimationFrame(autoFlightStep);
    return () => cancelAnimationFrame(animFrameIdRef.current);
  }, [isAutoFlight, isReady]);

  // Canvas render animation loop with lerping, cross-fade & background scroll zoom effect
  useEffect(() => {
    if (!isReady || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const renderLoop = () => {
      // Lerp current frame towards target frame
      const diff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += diff * 0.08; // Smooth interpolation factor

      // Smoothly interpolate mouse parallax coordinates
      currentMouseXRef.current += (targetMouseXRef.current - currentMouseXRef.current) * 0.05;
      currentMouseYRef.current += (targetMouseYRef.current - currentMouseYRef.current) * 0.05;
      const mouseX = currentMouseXRef.current;
      const mouseY = currentMouseYRef.current;

      const exactFrame = currentFrameRef.current;
      const baseIndex = Math.floor(exactFrame);
      const nextIndex = Math.min(baseIndex + 1, FRAME_IMAGES.length - 1);
      const blendFactor = exactFrame - baseIndex;

      const roundedIndex = Math.round(exactFrame);
      const clampedIndex = Math.min(Math.max(roundedIndex, 0), FRAME_IMAGES.length - 1);

      if (onFrameChange && currentFrameIndex !== clampedIndex) {
        onFrameChange(clampedIndex);
      }

      // Resize canvas to window dimensions with DPR handling
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Compute background zoom/parallax scale effect based on scroll position + mouse cursor
      // Increase scrollZoom to allow for more aggressive parallax panning without revealing edges
      const scrollZoom = (1 + 0.04 * Math.sin(exactFrame * 0.8)) * 1.15; // Increased margin for stronger parallax

      // Parallax translation based on cursor position (stronger effect)
      const parallaxOffsetX = mouseX * 120; // Pans 120px horizontally with cursor
      const parallaxOffsetY = mouseY * 80;  // Pans 80px vertically with cursor

      // Helper function to draw an image frame with scale & cover aspect ratio
      const drawFrameImage = (img, alpha = 1.0) => {
        if (!img || !img.complete || img.naturalWidth === 0) return;
        ctx.globalAlpha = alpha;

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = width / height;

        let drawW, drawH, drawX, drawY;

        if (canvasRatio > imgRatio) {
          drawW = width * scrollZoom;
          drawH = (width / imgRatio) * scrollZoom;
          drawX = (width - drawW) / 2 + parallaxOffsetX;
          drawY = (height - drawH) / 2 + parallaxOffsetY;
        } else {
          drawH = height * scrollZoom;
          drawW = (height * imgRatio) * scrollZoom;
          drawX = (width - drawW) / 2 + parallaxOffsetX;
          drawY = (height - drawH) / 2 + parallaxOffsetY;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      };

      // Draw base frame image
      const baseImg = images[baseIndex];
      drawFrameImage(baseImg, 1.0);

      // Cross-fade blend with next frame image if scrubbing between frames
      if (blendFactor > 0.01 && baseIndex !== nextIndex) {
        const nextImg = images[nextIndex];
        drawFrameImage(nextImg, blendFactor);
      }

      ctx.globalAlpha = 1.0;

      // Add dark luxury gradient overlay for text legibility
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(3, 10, 23, 0.55)');
      gradient.addColorStop(0.5, 'rgba(3, 10, 23, 0.20)');
      gradient.addColorStop(1, 'rgba(3, 10, 23, 0.80)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle futuristic floating particles reacting to cursor with inverse parallax depth
      particlesRef.current.forEach((pt) => {
        pt.x += pt.speedX;
        pt.y += pt.speedY;

        if (pt.x < 0) pt.x = width;
        if (pt.x > width) pt.x = 0;
        if (pt.y < 0) pt.y = height;
        if (pt.y > height) pt.y = 0;

        const pX = pt.x - mouseX * 80;
        const pY = pt.y - mouseY * 50;

        ctx.beginPath();
        ctx.arc(pX, pY, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 204, 21, ${pt.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#fde047';
        ctx.fill();
      });

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isReady, images, onFrameChange, currentFrameIndex]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Preloader */}
      {!isReady && (
        <div className="absolute inset-0 bg-[#030a17] z-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-serif tracking-widest text-white mb-2">FOOD PACKAGING ENGINE</h2>
          <p className="text-sm font-mono text-amber-400/80 uppercase tracking-widest">
            LOADING PARALLAX ASCENT FRAMES ({loadedCount} / {FRAME_IMAGES.length})
          </p>
          <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300"
              style={{ width: `${(loadedCount / FRAME_IMAGES.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Main HTML5 Canvas */}
      <canvas ref={canvasRef} className="w-full h-full object-cover block" />
    </div>
  );
}
