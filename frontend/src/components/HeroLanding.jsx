import React, { useState, useEffect, useRef } from 'react';
import { IconZap, IconAlertTriangle, IconCheckCircle } from './ui/PremiumIcons.jsx';

export default function TendonLandingPage({ onEnterDashboard }) {
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });
  const [smoothMouse, setSmoothMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animFrameId;

    const handleMouseMove = (e) => {
      // Normalize target mouse position: -1.0 (left) to +1.0 (right)
      targetMouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    // Continuous Physics Damping Loop (Lerp)
    const lerpLoop = () => {
      // Damping factor: lower value = silkier inertia / smoother gliding
      const ease = 0.055;
      
      const dx = targetMouseRef.current.x - currentMouseRef.current.x;
      const dy = targetMouseRef.current.y - currentMouseRef.current.y;

      currentMouseRef.current.x += dx * ease;
      currentMouseRef.current.y += dy * ease;

      setSmoothMouse({
        x: currentMouseRef.current.x,
        y: currentMouseRef.current.y,
      });

      animFrameId = requestAnimationFrame(lerpLoop);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animFrameId = requestAnimationFrame(lerpLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div className="landing-root">

      {/* Arc Background — breathing atmospheric glow */}
      <div className="arc-background" />
      <div className="arc-particle" />
      <div className="arc-particle" />
      <div className="arc-particle" />
      <div className="arc-particle" />

      {/* ── Dark Pill Navbar ────────────────────────────── */}
      <nav className="pill-nav">
        <a href="#" className="pill-nav-brand" onClick={(e) => { e.preventDefault(); }}>
          <img 
            src="/logo.jpg" 
            alt="Tendon Logo" 
            style={{ width: 22, height: 22, borderRadius: 6, objectFit: 'cover', boxShadow: '0 0 10px rgba(56, 189, 248, 0.45)' }} 
          />
          <span>Tendon</span>
        </a>

        <div className="pill-nav-divider" />

        <a href="#how-it-works" className="pill-nav-link active">Overview</a>
        <a href="#architecture" className="pill-nav-link">Architecture</a>
        <a href="#why-tendon" className="pill-nav-link">Why Tendon</a>
        <a
          href="https://shannon-explorer.somnia.network"
          target="_blank"
          rel="noreferrer"
          className="pill-nav-link"
        >Explorer</a>

        <div className="pill-nav-divider" />

        <button
          onClick={onEnterDashboard}
          className="btn-glass pill-nav-cta"
          style={{ padding: '8px 20px', fontSize: 12 }}
        >
          Launch App →
        </button>
      </nav>

      {/* ── Hero Section ────────────────────────────────── */}
      <section className="landing-hero">
        {/* 3D Vertical Slat Architectural Backdrop with Ultra-Smooth Physics Lerp Curtain Opening */}
        <div className="slat-backdrop">
          {[...Array(10)].map((_, i) => {
            // Apply slight index-based inertia lag for a realistic fluid wave effect across curtain slats
            const waveLag = 1 - (i * 0.025);
            const mx = smoothMouse.x * waveLag;
            const my = smoothMouse.y * waveLag;

            const baseRotateY = -14;
            const baseRotateZ = -1;

            const rotateY = baseRotateY + (mx * 18) + (i * 0.6);
            const rotateX = my * -5;
            const shiftX = mx * (10 - i) * 4.2;
            const baseOpacity = 0.25 + (i * 0.08);
            const dynamicOpacity = Math.min(0.95, Math.max(0.18, baseOpacity + (mx * 0.14)));

            return (
              <div
                key={i}
                className="slat-pillar"
                style={{
                  opacity: dynamicOpacity,
                  transform: `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${baseRotateZ}deg) translateX(${shiftX}px)`,
                }}
              />
            );
          })}
        </div>

        {/* Floating Premium Brand Emblem */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            width: 130,
            height: 130,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(37, 99, 235, 0.1) 50%, transparent 70%)',
            filter: 'blur(22px)',
            pointerEvents: 'none',
          }} />
          <div style={{
            width: 76,
            height: 76,
            borderRadius: '22px',
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.03))',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow: '0 12px 36px -4px rgba(0, 0, 0, 0.65), 0 0 24px rgba(56, 189, 248, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backdropFilter: 'blur(12px)',
          }}>
            <img 
              src="/logo.jpg" 
              alt="Tendon Protocol Emblem" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        <div className="landing-hero-badge">
          <span className="landing-hero-badge-dot" />
          Somnia × DreamDEX Hackathon • Reactive Order Infrastructure
        </div>

        <h1 className="landing-hero-title">
          The Reflex Arc for<br />
          <span className="landing-hero-fade">Onchain Order Books</span>
        </h1>

        <p className="landing-hero-sub">
          Tendon is infrastructure for market makers on central limit order books.
          When oracle prices shift, Tendon atomically pulls your stale limit orders
          in the <strong style={{ color: 'var(--text-primary)' }}>exact same block</strong> —
          before MEV snipers can extract toxic flow.
        </p>

        <div className="landing-hero-actions">
          <button onClick={onEnterDashboard} className="btn-glass btn-glass-accent" style={{ padding: '16px 40px', fontSize: 15 }}>
            Enter Dashboard →
          </button>
          <a href="#how-it-works" className="btn-glass" style={{ padding: '16px 40px', fontSize: 15 }}>
            See How It Works
          </a>
        </div>

        <div className="landing-stats-row">
          <div className="landing-stat">
            <div className="landing-stat-value">0.00s</div>
            <div className="landing-stat-label">Exposure Window</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-value">100%</div>
            <div className="landing-stat-label">Order Protection</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-value">0x0100</div>
            <div className="landing-stat-label">Somnia Precompile</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-value">50312</div>
            <div className="landing-stat-label">Chain ID</div>
          </div>
        </div>
      </section>

      {/* ── The Problem ─────────────────────────────────── */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="feature-row">
            <div className="feature-text-block">
              <div className="feature-label">The Problem</div>
              <h3 className="feature-title">Market makers bleed on every price move</h3>
              <p className="feature-desc">
                On traditional CLOBs, when the oracle price shifts, stale limit orders
                sit exposed in the order book for multiple blocks. MEV bots scan the mempool,
                identify these stale quotes, and fill them at outdated prices — extracting
                value directly from market makers' pockets. This is called <strong>toxic flow</strong>,
                and it costs MMs millions annually.
              </p>
            </div>

            <div className="feature-visual">
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, opacity: 0.35 }}>
                  <IconAlertTriangle size={42} color="var(--status-danger)" />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-tertiary)' }}>
                  Block N: Price shifts<br/>
                  Block N+1: MM orders still live<br/>
                  Block N+1: Sniper fills stale quotes<br/>
                  <span style={{ color: 'var(--status-danger)', fontWeight: 600 }}>Result: MM loses spread + slippage</span>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-row" style={{ direction: 'rtl' }}>
            <div className="feature-text-block" style={{ direction: 'ltr' }}>
              <div className="feature-label">The Solution</div>
              <h3 className="feature-title">Intra-block reactive protection</h3>
              <p className="feature-desc">
                Tendon uses Somnia's native <code style={{
                  color: 'var(--accent)', background: 'var(--accent-muted)',
                  padding: '2px 8px', borderRadius: 4, fontSize: 13
                }}>0x0100</code> precompile to subscribe to Data Stream price events
                and fire callbacks <em>within the same block</em>. Your orders are pulled
                before any sniper transaction can execute. Zero exposure window. Zero toxic fills.
              </p>
            </div>

            <div className="feature-visual" style={{ direction: 'ltr' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, opacity: 0.85 }}>
                  <IconZap size={42} />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-tertiary)' }}>
                  Block N: Price shifts<br/>
                  Block N: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Tendon pulls orders (same block)</span><br/>
                  Block N: Sniper tx → <span style={{ color: 'var(--status-danger)', fontWeight: 600 }}>REVERTS</span><br/>
                  <span style={{ color: 'var(--status-safe)', fontWeight: 600 }}>Result: MM fully protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────── */}
      <section className="landing-section" id="how-it-works">
        <div className="landing-container">
          <div className="landing-section-label">THE REFLEX ARC</div>
          <h2 className="landing-section-title">Four-stage protection pipeline</h2>
          <p className="landing-section-desc">
            Like a biological reflex arc — stimulus to response without conscious thought.
            Tendon fires before the mempool even processes the next transaction.
          </p>

          <div className="landing-flow-grid">
            <div className="landing-flow-card">
              <div className="landing-flow-num">1</div>
              <h3 className="landing-flow-card-title">Detect</h3>
              <p className="landing-flow-card-desc">
                Somnia Data Streams broadcast oracle price updates in real-time.
                TendonProxy is subscribed via the 0x0100 precompile to watch
                for threshold-breaking price shifts.
              </p>
            </div>

            <div className="landing-flow-card">
              <div className="landing-flow-num">2</div>
              <h3 className="landing-flow-card-title">Trigger</h3>
              <p className="landing-flow-card-desc">
                When the price delta exceeds the market maker's configured threshold
                (in basis points), the precompile fires the callback — atomically,
                in the same block.
              </p>
            </div>

            <div className="landing-flow-card">
              <div className="landing-flow-num">3</div>
              <h3 className="landing-flow-card-title">Protect</h3>
              <p className="landing-flow-card-desc">
                TendonProxy executes the configured action (CANCEL_ALL or REQUOTE)
                on dreamDEX's CLOB. All matching stale orders are pulled before any
                sniper can reach them.
              </p>
            </div>

            <div className="landing-flow-card">
              <div className="landing-flow-num">4</div>
              <h3 className="landing-flow-card-title">Log</h3>
              <p className="landing-flow-card-desc">
                TendonLogger commits an immutable audit trail — block number,
                trigger price, orders protected, fee paid, tx hash — for
                compliance and analytics.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <div className="landing-callout">
              <span className="landing-callout-label">Latency from price shock to order cancellation:</span>
              <span className="landing-callout-value">0 blocks</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Architecture ────────────────────────────────── */}
      <section className="landing-section" id="architecture">
        <div className="landing-container">
          <div className="landing-section-label">ARCHITECTURE</div>
          <h2 className="landing-section-title">Three contracts, one reflex</h2>
          <p className="landing-section-desc">
            Minimal surface area. Each contract has a single responsibility.
            No oracles to maintain, no keepers to run, no cross-chain bridges.
          </p>

          <div className="landing-arch-grid">
            <div className="landing-arch-card">
              <div className="landing-arch-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h3 className="landing-arch-title">TendonProxy</h3>
              <p className="landing-arch-desc">
                The core contract. Market makers deposit collateral, register declarative rules
                (market, threshold, action), and subscribe to Data Stream events. When triggered,
                it atomically cancels orders on dreamDEX.
              </p>
              <div className="landing-arch-tag">Reactive Proxy</div>
            </div>

            <div className="landing-arch-card">
              <div className="landing-arch-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="landing-arch-title">TendonGuard</h3>
              <p className="landing-arch-desc">
                Validates every pull request with on-chain delta proofs. Ensures the price shift
                is genuine, the threshold was actually breached, and the orders belong to the
                requesting market maker.
              </p>
              <div className="landing-arch-tag">Validation Layer</div>
            </div>

            <div className="landing-arch-card">
              <div className="landing-arch-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h3 className="landing-arch-title">TendonLogger</h3>
              <p className="landing-arch-desc">
                Immutable audit trail. Every pull event is recorded with full context —
                block number, trigger price, protected orders, gas cost — queryable
                on-chain for analytics and compliance.
              </p>
              <div className="landing-arch-tag">Audit Trail</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Tendon ──────────────────────────────────── */}
      <section className="landing-section" id="why-tendon">
        <div className="landing-container">
          <div className="landing-section-label">WHY TENDON</div>
          <h2 className="landing-section-title">Not a bot. Not a dashboard. Infrastructure.</h2>
          <p className="landing-section-desc">
            Tendon is the thing the thing needs — the missing infrastructure layer between
            market makers and on-chain CLOBs that makes reactive protection possible.
          </p>

          <div className="landing-flow-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="landing-flow-card">
              <div className="landing-flow-num">→</div>
              <h3 className="landing-flow-card-title">Zero Latency</h3>
              <p className="landing-flow-card-desc">
                Uses Somnia's native precompile — not off-chain keepers, not relayers,
                not multi-block settlement. Same-block execution.
              </p>
            </div>

            <div className="landing-flow-card">
              <div className="landing-flow-num">⊕</div>
              <h3 className="landing-flow-card-title">Declarative Rules</h3>
              <p className="landing-flow-card-desc">
                Market makers set rules, not code. "If BTC moves 100bps, cancel all my orders."
                Tendon handles the execution. Set it and forget it.
              </p>
            </div>

            <div className="landing-flow-card">
              <div className="landing-flow-num" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconCheckCircle size={16} color="var(--status-safe)" />
              </div>
              <h3 className="landing-flow-card-title">Fully On-Chain</h3>
              <p className="landing-flow-card-desc">
                No off-chain components. No API keys. No cloud functions. Every trigger,
                every cancellation, every proof is verifiable on-chain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="landing-section" style={{ paddingBottom: 120 }}>
        <div className="landing-container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="landing-section-title" style={{ marginBottom: 16 }}>Try it live</h2>
          <p className="landing-section-desc centered">
            Trigger a price shock. Watch Tendon pull your orders in the same block.
            See the sniper's transaction revert. All simulated on real Solidity contracts.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button
              onClick={onEnterDashboard}
              className="btn-glass btn-glass-accent"
              style={{ padding: '16px 40px', fontSize: 15 }}
            >
              Launch Live Demo →
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/logo.jpg" alt="Tendon" style={{ width: 18, height: 18, borderRadius: 4, objectFit: 'cover' }} />
              <span className="landing-footer-brand">Tendon Protocol</span>
            </div>
            <span className="landing-footer-sub">Somnia × DreamDEX Hackathon 2026 • Chain 50312</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
