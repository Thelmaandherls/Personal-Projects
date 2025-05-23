import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import CartoonWorld from '../components/CartoonWorld';

const AnimatedStory = dynamic(() => import('../components/AnimatedStory'), { ssr: false });

export default function Home() {
  const [showStory, setShowStory] = useState(true);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', background: 'black' }}>
      <CartoonWorld />
      {/* Overlay UI: show story overlay only if showStory is true */}
      {showStory && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
          background: 'rgba(0,0,0,0.45)',
        }}>
          <motion.div
            id="story-overlay"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(0,0,0,0.65)',
              borderRadius: '2rem',
              padding: '2.5rem 2rem',
              maxWidth: 480,
              textAlign: 'center',
              color: '#fff',
              fontFamily: 'Luckiest Guy, Fredoka One, cursive',
              fontSize: '2.1rem',
              boxShadow: '0 0 32px #000a',
              margin: '0 auto',
              transition: 'opacity 0.7s',
            }}
          >
            <AnimatedStory />
            <button
              onClick={() => setShowStory(false)}
              style={{
                marginTop: 32,
                background: '#fde047',
                color: '#222',
                borderRadius: 12,
                padding: '0.5em 1.2em',
                fontWeight: 700,
                fontFamily: 'Fredoka One, cursive',
                fontSize: '1.1rem',
                cursor: 'pointer',
                border: '2px solid #fff',
                outline: '2px solid #222',
                boxShadow: '0 2px 8px #0003',
                transition: 'background 0.2s',
              }}
            >
              Close Story
            </button>
          </motion.div>
        </div>
      )}
      {/* Reopen story button (shows only when story is closed) */}
      {!showStory && (
        <button
          onClick={() => setShowStory(true)}
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            zIndex: 20,
            background: '#fde047',
            color: '#222',
            borderRadius: 12,
            padding: '0.5em 1.2em',
            fontWeight: 700,
            fontFamily: 'Fredoka One, cursive',
            fontSize: '1.1rem',
            cursor: 'pointer',
            border: '2px solid #fff',
            outline: '2px solid #222',
            boxShadow: '0 2px 8px #0003',
            transition: 'background 0.2s',
          }}
        >
          Reopen Story
        </button>
      )}
      <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Fredoka+One&display=swap" rel="stylesheet" />
    </div>
  );
}