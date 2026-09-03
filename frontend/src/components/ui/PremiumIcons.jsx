import React from 'react';

// Common default props
const defaultProps = (size = 18, className = "") => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  className,
});

/** Official Tendon Protocol Monogram Logo SVG */
export function TendonLogo({ size = 24, style, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} className={className}>
      <defs>
        <linearGradient id="tendon-primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#4A7FC7" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="tendon-glow-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
        <filter id="tendon-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Left Interwoven Tendon Cord */}
      <path
        d="M4.5 8.5C4.5 7.12 5.62 6 7 6H16C16 6 12.5 12 11 17C9.5 22 7.5 26 7.5 26"
        stroke="url(#tendon-primary-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Interwoven Tendon Cord */}
      <path
        d="M27.5 8.5C27.5 7.12 26.38 6 25 6H16C16 6 19.5 12 21 17C22.5 22 24.5 26 24.5 26"
        stroke="url(#tendon-glow-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Central Kinetic Tendon Spine */}
      <path
        d="M16 6V27"
        stroke="url(#tendon-primary-grad)"
        strokeWidth="2.75"
        strokeLinecap="round"
        filter="url(#tendon-soft-glow)"
      />
      {/* Nodes and Cross Ties */}
      <circle cx="16" cy="6.5" r="1.5" fill="#38BDF8" />
      <circle cx="16" cy="26.5" r="1.5" fill="#38BDF8" />
      <path
        d="M10.5 13.5C12.5 15 14 15.5 16 15.5C18 15.5 19.5 15 21.5 13.5"
        stroke="#38BDF8"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

/** Premium Zap / Lightning SVG with Gradient Glow */
export function IconZap({ size = 18, color = "currentColor", style }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <defs>
        <linearGradient id="zap-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B94E0" />
          <stop offset="100%" stopColor="#4A7FC7" />
        </linearGradient>
      </defs>
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        fill="url(#zap-grad)"
        stroke="url(#zap-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Premium Shield Icon */
export function IconShield({ size = 18, color = "currentColor", style }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <defs>
        <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A7FC7" />
          <stop offset="100%" stopColor="#2EAE7B" />
        </linearGradient>
      </defs>
      <path
        d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
        fill="none"
        stroke="url(#shield-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6V18M12 6L8 9M12 6L16 9"
        stroke="url(#shield-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}

/** Premium CPU / Microchip Architecture SVG */
export function IconCpu({ size = 18, color = "currentColor", style }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.75" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 1V4M15 1V4M9 20V23M15 20V23M1 9H4M1 15H4M20 9H23M20 15H23" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

/** Premium External Link SVG */
export function IconExternalLink({ size = 14, color = "currentColor", style }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <path d="M15 3H21V9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14L21 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 13V19C18 20.1 17.1 21 16 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6H11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

/** Premium Swords / Battle Arena SVG */
export function IconSwords({ size = 18, style, color = "#D1494E" }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <path d="M14.5 17.5L3 6V3H6L17.5 14.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 19L19 13" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M16 16L21 21" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M9.5 17.5L21 6V3H18L6.5 14.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 19L5 13" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M8 16L3 21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Premium Scroll / Ledger SVG */
export function IconScroll({ size = 18, style, color = "currentColor" }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <path d="M8 3H19C20.1 3 21 3.9 21 5V17C21 18.1 20.1 19 19 19H6C4.34 19 3 17.66 3 16V6C3 4.34 4.34 3 6 3H8Z" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 3V19" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7H17" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M12 11H17" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M12 15H15" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

/** Premium Sliders / Risk Configurator SVG */
export function IconSliders({ size = 18, style }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <line x1="4" y1="21" x2="4" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="10" x2="4" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="21" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="8" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="21" x2="20" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="12" x2="20" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="2" y="10" width="4" height="4" rx="1" fill="currentColor" />
      <rect x="10" y="8" width="4" height="4" rx="1" fill="currentColor" />
      <rect x="18" y="12" width="4" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

/** Premium Layers / CLOB Orderbook SVG */
export function IconLayers({ size = 18, style }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Premium BarChart / Edge Analytics SVG */
export function IconBarChart({ size = 18, style }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <path d="M12 20V10" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M18 20V4" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M6 20V14" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  );
}

/** Premium Database / Audit Ledger SVG */
export function IconDatabase({ size = 18, style }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="1.75" />
      <path d="M21 12C21 13.66 16.97 15 12 15C7.03 15 3 13.66 3 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M3 5V19C3 20.66 7.03 22 12 22C16.97 22 21 20.66 21 19V5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

/** Premium Refresh / Sim Reset SVG */
export function IconRefresh({ size = 14, style }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <path d="M23 4V10H17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 20V14H7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.51 9A9 9 0 0 1 18.36 5.64L23 10M1 14L5.64 18.36A9 9 0 0 0 20.49 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Premium Check Circle SVG */
export function IconCheckCircle({ size = 16, style, color = "#2EAE7B" }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.75" fill="none" />
      <path d="M9 12L11 14L15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Premium Alert / Warning Triangle SVG */
export function IconAlertTriangle({ size = 16, style, color = "#D4930D" }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <path d="M10.29 3.86L1.82 18C1.44 18.66 1.92 19.5 2.68 19.5H19.62C20.38 19.5 20.86 18.66 20.48 18L12.01 3.86C11.63 3.22 10.67 3.22 10.29 3.86Z" stroke={color} strokeWidth="1.75" fill="none" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Premium Alert Octagon / Revert SVG */
export function IconAlertOctagon({ size = 16, style, color = "#D1494E" }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" stroke={color} strokeWidth="1.75" fill="none" strokeLinejoin="round" />
      <line x1="12" y1="8" x2="12" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12.01" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Premium Plus / Add SVG */
export function IconPlus({ size = 14, style }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Premium Shield Check SVG */
export function IconShieldCheck({ size = 18, style, color = "#2EAE7B" }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <path d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke={color} strokeWidth="1.75" fill="none" strokeLinejoin="round" />
      <path d="M9 12L11 14L15 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Premium Trending Down SVG */
export function IconTrendingDown({ size = 18, style, color = "#D1494E" }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 18 23 18 23 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Premium Trending Up SVG */
export function IconTrendingUp({ size = 18, style, color = "#2EAE7B" }) {
  return (
    <svg {...defaultProps(size)} style={style}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 6 23 6 23 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
