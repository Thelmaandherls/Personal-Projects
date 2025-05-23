module.exports = {
  content: ['./**/*.html', './**/*.src', './**/*.css','./**/*.scss','./**/*.js', './**/*.tsx'], // Adjusted paths to include .tsx files
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(255,255,255,0)' },
          '50%': { boxShadow: '0 0 8px rgba(255,255,255,0.5)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out infinite',
        glow: 'pulseGlow 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
// This Tailwind CSS configuration file extends the default theme with custom keyframes and animations.
// The `wiggle` animation rotates an element slightly back and forth, while the `pulseGlow` animation creates a glowing effect by changing the box shadow.