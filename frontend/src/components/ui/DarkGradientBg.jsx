import React from 'react';

export function DarkGradientBg({ children, className }) {
  return (
    <div className={`relative min-h-screen w-full bg-black overflow-hidden ${className || ''}`}>
      {/* Base radial gradient - dark gray to black */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(100% 100% at 0% 0%, rgb(46, 46, 46) 0%, rgb(0, 0, 0) 100%)',
            mask: 'radial-gradient(125% 100% at 0% 0%, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.224) 88.29%, rgba(0, 0, 0, 0) 100%)'
          }}
        >
          {/* Skewed cyan streaks — neural pathways */}
          {[
            '0% 0%, rgb(0,0,0) 20%, rgba(0,0,0,0) 36%, rgb(0,0,0) 55%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 78%, rgba(0,0,0,0) 97%',
            '0% 11%, rgb(0,0,0) 25%, rgba(0,0,0,0.55) 41%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 78%, rgba(0,0,0,0) 97%',
            '0% 9%, rgb(0,0,0) 20%, rgba(0,0,0,0.55) 28%, rgba(0,0,0,0.424) 40%, rgb(0,0,0) 48%, rgba(0,0,0,0.267) 54%, rgba(0,0,0,0.13) 78%, rgb(0,0,0) 88%, rgba(0,0,0,0) 97%',
            '0% 0%, rgb(0,0,0) 17%, rgba(0,0,0,0.55) 26%, rgb(0,0,0) 35%, rgba(0,0,0,0) 47%, rgba(0,0,0,0.13) 69%, rgb(0,0,0) 79%, rgba(0,0,0,0) 97%',
            '0% 0%, rgb(0,0,0) 20%, rgba(0,0,0,0.55) 27%, rgb(0,0,0) 42%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 74%, rgb(0,0,0) 82%, rgba(0,0,0,0.47) 88%, rgba(0,0,0,0) 97%',
          ].map((maskStops, i) => (
            <div
              key={i}
              className="absolute inset-0 opacity-20"
              style={{
                background: 'linear-gradient(rgb(0, 207, 255) 0%, rgba(0, 207, 255, 0) 100%)',
                mask: `linear-gradient(90deg, rgba(0,0,0,${maskStops})`,
                WebkitMask: `linear-gradient(90deg, rgba(0,0,0,${maskStops})`,
                transform: 'skewX(45deg)'
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS noise texture — no external dependency */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px'
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
