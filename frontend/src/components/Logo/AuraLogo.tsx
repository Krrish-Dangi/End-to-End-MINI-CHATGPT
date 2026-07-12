import { useMemo } from 'react';

interface AuraLogoProps {
  size?: number;
  isVisible?: boolean;
}

// Particle configuration for orbiting dots
const PARTICLES = [
  { delay: '0s', duration: '6s', radius: 62, color: '#D946EF', size: 2.5 },
  { delay: '-1s', duration: '8s', radius: 58, color: '#8B5CF6', size: 2 },
  { delay: '-2.5s', duration: '10s', radius: 66, color: '#22D3EE', size: 1.8 },
  { delay: '-4s', duration: '7s', radius: 60, color: '#3B82F6', size: 2.2 },
  { delay: '-0.8s', duration: '9s', radius: 64, color: '#7C3AED', size: 1.6 },
  { delay: '-5.2s', duration: '11s', radius: 56, color: '#D946EF', size: 2 },
  { delay: '-3.3s', duration: '7.5s', radius: 68, color: '#22D3EE', size: 1.5 },
  { delay: '-6.1s', duration: '8.5s', radius: 54, color: '#8B5CF6', size: 1.8 },
];

// Spark elements that periodically detach and dissolve
const SPARKS = [
  { x: '25px', y: '-30px', delay: '0s', duration: '3s', color: '#D946EF' },
  { x: '-20px', y: '-25px', delay: '1.2s', duration: '2.5s', color: '#22D3EE' },
  { x: '15px', y: '20px', delay: '2.4s', duration: '2.8s', color: '#8B5CF6' },
];

// Ring layer configurations
const RING_LAYERS = [
  {
    color: '#D946EF',
    strokeWidth: 2.5,
    dashArray: '8 16',
    opacity: 0.7,
    pulseClass: 'animate-ring-pulse-1',
    radius: 38,
  },
  {
    color: '#8B5CF6',
    strokeWidth: 2,
    dashArray: '20 10 5 10',
    opacity: 0.6,
    pulseClass: 'animate-ring-pulse-2',
    radius: 34,
  },
  {
    color: '#7C3AED',
    strokeWidth: 3,
    dashArray: '4 24',
    opacity: 0.5,
    pulseClass: 'animate-ring-pulse-3',
    radius: 42,
  },
  {
    color: '#22D3EE',
    strokeWidth: 1.5,
    dashArray: '12 8 3 8',
    opacity: 0.45,
    pulseClass: 'animate-ring-pulse-1',
    radius: 36,
  },
  {
    color: '#3B82F6',
    strokeWidth: 1.8,
    dashArray: '6 20 12 20',
    opacity: 0.4,
    pulseClass: 'animate-ring-pulse-2',
    radius: 40,
  },
];

function AuraLogo({ size = 180, isVisible = true }: AuraLogoProps) {
  const scale = size / 180;
  const center = 50; // SVG viewBox center
  const svgSize = 100; // SVG viewBox size

  const particleElements = useMemo(
    () =>
      PARTICLES.map((p, i) => (
        <circle
          key={`particle-${i}`}
          cx={center}
          cy={center}
          r={p.size}
          fill={p.color}
          opacity={0.9}
          style={{
            transformOrigin: `${center}px ${center}px`,
            animation: `particle-orbit ${p.duration} linear infinite`,
            animationDelay: p.delay,
            // Override the translateX distance via CSS custom prop
            ['--orbit-radius' as string]: `${p.radius * (50 / 90)}px`,
          }}
        >
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur={p.duration}
            repeatCount="indefinite"
          />
        </circle>
      )),
    []
  );

  const sparkElements = useMemo(
    () =>
      SPARKS.map((s, i) => (
        <circle
          key={`spark-${i}`}
          cx={center}
          cy={center - 38}
          r={1.8}
          fill={s.color}
          style={{
            ['--spark-x' as string]: s.x,
            ['--spark-y' as string]: s.y,
            animation: `spark ${s.duration} ease-out infinite`,
            animationDelay: s.delay,
          }}
        />
      )),
    []
  );

  if (!isVisible) return null;

  return (
    <div
      className="animate-float relative"
      style={{ width: size, height: size }}
    >
      {/* Ambient background glow */}
      <div
        className="animate-glow-pulse absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(217, 70, 239, 0.08) 40%, transparent 70%)',
        }}
      />

      <svg
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        width={size}
        height={size}
        className="animate-spin-slow relative"
        style={{ transformOrigin: 'center center' }}
      >
        <defs>
          {/* Glow filter */}
          <filter id="aura-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Stronger glow for outer ring */}
          <filter id="aura-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Particle glow */}
          <filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ring layers — each with independent pulse animation */}
        {RING_LAYERS.map((layer, i) => (
          <circle
            key={`ring-${i}`}
            cx={center}
            cy={center}
            r={layer.radius}
            fill="none"
            stroke={layer.color}
            strokeWidth={layer.strokeWidth}
            strokeDasharray={layer.dashArray}
            strokeLinecap="round"
            opacity={layer.opacity}
            filter="url(#aura-glow)"
            className={layer.pulseClass}
            style={{ transformOrigin: `${center}px ${center}px` }}
          />
        ))}

        {/* Continuous energy ring — solid, dimmer */}
        <circle
          cx={center}
          cy={center}
          r={38}
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth={1}
          opacity={0.25}
          filter="url(#aura-glow-strong)"
          className="animate-breathe"
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Gradient for the continuous ring */}
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D946EF" />
            <stop offset="33%" stopColor="#8B5CF6" />
            <stop offset="66%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Orbiting particle dots */}
        <g filter="url(#particle-glow)">{particleElements}</g>

        {/* Spark elements */}
        <g filter="url(#particle-glow)">{sparkElements}</g>
      </svg>
    </div>
  );
}

export default AuraLogo;
