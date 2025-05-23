import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInOut = keyframes`
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const Container = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--background-color);
  color: var(--text-color);
  z-index: 1000;
  animation: ${({ isVisible }) => (isVisible ? fadeIn : fadeOut)} 1s forwards;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }
`;

const LoadingText = styled.div`
  margin-top: 30px;
  font-size: 1.5rem;
  font-weight: bold;
  animation: ${fadeInOut} 2s infinite;
`;

export default function LoadingPage({ onEnter }: { onEnter: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showStart, setShowStart] = useState(false);

  useEffect(() => {
    let start = Date.now();
    const duration = 3000; // 3 seconds
    const animate = () => {
      const elapsed = Date.now() - start;
      const percent = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(percent);
      // Animate paintbrush and drawing
      const canvas = document.getElementById('loading-art-canvas') as HTMLCanvasElement | null;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw a simple image: a smiley face being painted
        // Draw face
        ctx.beginPath();
        ctx.arc(160, 110, 80, 0, 2 * Math.PI);
        ctx.fillStyle = '#fde047';
        ctx.fill();
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 4;
        ctx.stroke();
        // Eyes
        ctx.beginPath();
        ctx.arc(130, 90, 12, 0, 2 * Math.PI);
        ctx.arc(190, 90, 12, 0, 2 * Math.PI);
        ctx.fillStyle = '#222';
        ctx.fill();
        // Smile (drawn progressively)
        ctx.beginPath();
        const smileProgress = Math.max(0, Math.min(1, (percent - 20) / 60));
        ctx.arc(160, 120, 40, Math.PI * (0.15), Math.PI * (0.85 * smileProgress + 0.15), false);
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#222';
        if (smileProgress > 0) ctx.stroke();
      }
      // Animate paintbrush position
      const brush = document.getElementById('paintbrush-svg');
      if (brush) {
        // Move brush exactly along the drawn smile arc
        const smileProgress = Math.max(0, Math.min(1, (percent - 20) / 60));
        // If smileProgress <= 0, keep brush at start of smile
        // If smileProgress >= 1, keep brush at end of smile
        let angle;
        if (smileProgress <= 0) {
          angle = Math.PI * 0.15;
        } else if (smileProgress >= 1) {
          angle = Math.PI * 0.85;
        } else {
          angle = Math.PI * (0.15 + 0.7 * smileProgress);
        }
        const bx = 160 + 40 * Math.cos(angle) - 24;
        const by = 120 + 40 * Math.sin(angle) - 24;
        brush.style.left = `${bx}px`;
        brush.style.top = `${by}px`;
      }
      if (percent < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setShowStart(true);
        }, 400); // slight pause at 100%
      }
    };
    animate();
    // eslint-disable-next-line
  }, [onEnter]);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Fredoka+One&display=swap" rel="stylesheet" />
    <Container isVisible={isVisible}>
      {!showStart ? (
        <div style={{
          textAlign: 'center',
          fontFamily: 'Luckiest Guy, Fredoka One, cursive',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
        }}>
          <div style={{ position: 'relative', width: 320, height: 220, marginBottom: 24 }}>
            {/* Canvas for drawing image */}
            <canvas id="loading-art-canvas" width={320} height={220} style={{ borderRadius: 16, background: '#fff', boxShadow: '0 2px 16px #0002', display: 'block', margin: '0 auto' }} />
            {/* Paintbrush SVG */}
            <svg id="paintbrush-svg" width="48" height="48" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 2 }} viewBox="0 0 48 48">
              <rect x="20" y="10" width="8" height="24" rx="4" fill="#222" />
              <ellipse cx="24" cy="8" rx="8" ry="6" fill="#eab308" stroke="#222" strokeWidth="2" />
              <rect x="22" y="34" width="4" height="8" rx="2" fill="#a3a3a3" />
            </svg>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 16, letterSpacing: 2, display: 'block' }}>
            Creating Something Good (Hopefully)...
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: 4, color: 'var(--text-color)', transition: 'color 0.3s', display: 'block' }}>
            {progress}%
          </div>
        </div>
      ) : (
        <div
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--text-color)',
            textAlign: 'center',
            letterSpacing: 4,
            textShadow: '0 0 2px #fff, 0 0 6px #8b0000',
            animation: 'creepylight 4s infinite alternate',
            margin: '0 auto',
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            background: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            fontFamily: 'Luckiest Guy, Fredoka One, cursive',
            opacity: 1,
            transition: 'none',
            zIndex: 2000,
          }}
          onClick={() => {
            setIsVisible(false);
            setTimeout(onEnter, 1000);
          }}
        >
          <span style={{ fontSize: '4.2rem', fontWeight: 400, display: 'block', background: 'black', borderRadius: '18px', padding: '0.4em 1.2em', margin: '0 auto', boxShadow: '0 0 16px #0008' }}>
            Click on Me<br />
            <br />
          </span>
          <span style={{ fontSize: '0.6rem', fontWeight: 400, textShadow: 'none', animation: 'none', display: 'block', color: 'red' }}>
            I know you want to 🤭👀
          </span>
        </div>
      )}
      <style>{`
        @keyframes creepylight {
          0% {
            text-shadow: 0 0 2px #fff, 0 0 6px #8b0000;
            color: var(--text-color);
            filter: brightness(0.9) contrast(1.1);
          }
          40% {
            text-shadow: 0 0 8px #fff, 0 0 18px #8b0000;
            color: #8b0000;
            filter: brightness(1.1) contrast(1.2);
          }
          60% {
            text-shadow: 0 0 4px #fff, 0 0 10px #8b0000;
            color: #3b82f6;
            filter: brightness(0.8) contrast(1.3);
          }
          100% {
            text-shadow: 0 0 2px #fff, 0 0 6px #8b0000;
            color: var(--text-color);
            filter: brightness(1) contrast(1);
          }
        }
      `}</style>
    </Container>
    </>
  );
}