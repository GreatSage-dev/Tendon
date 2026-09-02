import React from 'react';
import { IconCpu, IconShieldCheck } from './ui/PremiumIcons.jsx';

export default function SomniaArchitectureMatrix() {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-neu-out)',
      border: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-default)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-neu-out-sm)',
            color: 'var(--accent)'
          }}>
            <IconCpu size={20} />
          </div>
          <h2 style={{
            margin: 0,
            fontWeight: 600,
            fontSize: '14px',
            letterSpacing: '0.05em',
            color: 'var(--text-primary)'
          }}>
            WHY TENDON ONLY WORKS ON SOMNIA
          </h2>
        </div>
        <span style={{
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          padding: '4px 8px',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--bg-inset)',
          boxShadow: 'var(--shadow-neu-in)',
          color: 'var(--accent-bright)',
          border: '1px solid var(--border-default)'
        }}>
          Native Consensus Reactivity
        </span>
      </div>

      <div style={{
        marginTop: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px'
      }}>
        
        {/* Ethereum */}
        <div style={{
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-neu-out-sm)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Ethereum / L2s
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '4px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Reaction Speed:</span>
              <span style={{ color: 'var(--status-danger)' }}>12.0s Block</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Intra-Block Pull:</span>
              <span style={{ color: 'var(--status-danger)' }}>NO (Impossible)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Keeper Dependency:</span>
              <span style={{ color: 'var(--status-warn)' }}>YES (Offchain)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>MM Exposure:</span>
              <span style={{ color: 'var(--status-danger)', fontWeight: 'bold' }}>100% Bleed</span>
            </div>
          </div>
        </div>

        {/* Solana */}
        <div style={{
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-neu-out-sm)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Solana
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '4px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Reaction Speed:</span>
              <span style={{ color: 'var(--status-warn)' }}>400ms Block</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Intra-Block Pull:</span>
              <span style={{ color: 'var(--status-danger)' }}>NO (External Tx)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Keeper Dependency:</span>
              <span style={{ color: 'var(--status-warn)' }}>YES (Offchain)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>MM Exposure:</span>
              <span style={{ color: 'var(--status-warn)', fontWeight: 'bold' }}>Latency Arbitraged</span>
            </div>
          </div>
        </div>

        {/* Somnia */}
        <div style={{
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-inset)',
          boxShadow: 'var(--shadow-neu-in)',
          border: '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{
            fontWeight: 'bold',
            color: 'var(--accent)',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Somnia + Tendon</span>
            <IconShieldCheck size={16} />
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '4px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Reaction Speed:</span>
              <span style={{ color: 'var(--status-safe)', fontWeight: 'bold' }}>Intra-Consensus</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Intra-Block Pull:</span>
              <span style={{ color: 'var(--status-safe)', fontWeight: 'bold' }}>YES (0x0100)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Keeper Dependency:</span>
              <span style={{ color: 'var(--status-safe)', fontWeight: 'bold' }}>ZERO (Autonomous)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>MM Exposure:</span>
              <span style={{ color: 'var(--status-safe)', fontWeight: 'bold' }}>0.00 Seconds</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
