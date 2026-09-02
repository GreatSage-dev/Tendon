import React from 'react';
import { IconBarChart, IconTrendingDown, IconShieldCheck } from './ui/PremiumIcons.jsx';

export default function EdgeAnalyticsCard() {
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
            <IconBarChart size={20} />
          </div>
          <div>
            <h2 style={{
              margin: 0,
              fontWeight: 600,
              fontSize: '14px',
              letterSpacing: '0.05em'
            }}>
              EDGE ANALYTICS (tools/edge-analytics)
            </h2>
            <p style={{
              margin: 0,
              fontSize: '11px',
              color: 'var(--text-secondary)',
              marginTop: '2px'
            }}>
              Glosten–Milgrom Market-Maker Spread Preservation Model
            </p>
          </div>
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
          Drey Metric Standard
        </span>
      </div>

      <div style={{
        marginTop: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {/* Unprotected Maker */}
        <div style={{
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-inset)',
          boxShadow: 'var(--shadow-neu-in)',
          border: '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <span style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'bold',
              color: 'var(--status-danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <IconTrendingDown size={16} />
              1. Unprotected MM (Offchain Bot)
            </span>
            <span style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--status-danger)',
              background: 'var(--bg-surface)',
              boxShadow: 'var(--shadow-neu-out-sm)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              BLEEDING SPREAD
            </span>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Gross Captured Spread:</span>
              <span style={{ color: 'var(--status-safe)' }}>+5.25 bps</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Adverse Selection (60s):</span>
              <span style={{ color: 'var(--status-danger)', fontWeight: 'bold' }}>-28.50 bps</span>
            </div>
            <div style={{
              paddingTop: '10px',
              borderTop: '1px solid var(--border-default)',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold'
            }}>
              <span style={{ color: 'var(--text-primary)' }}>Net Edge at Horizon:</span>
              <span style={{ color: 'var(--status-danger)', fontSize: '13px' }}>-23.25 bps</span>
            </div>
          </div>
          <p style={{
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            marginTop: '16px',
            marginBottom: 0,
            fontStyle: 'italic',
            lineHeight: 1.4
          }}>
            *Sniper bots fill stale quotes before keeper cancellation tx arrives in mempool.
          </p>
        </div>

        {/* Protected Maker */}
        <div style={{
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-inset)',
          boxShadow: 'var(--shadow-neu-in)',
          border: '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <span style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'bold',
              color: 'var(--status-safe)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <IconShieldCheck size={16} />
              2. Tendon Protected (Somnia 0x100)
            </span>
            <span style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--status-safe)',
              background: 'var(--bg-surface)',
              boxShadow: 'var(--shadow-neu-out-sm)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              100% PRESERVED
            </span>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            marginTop: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Gross Captured Spread:</span>
              <span style={{ color: 'var(--status-safe)' }}>+5.25 bps</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Adverse Selection (60s):</span>
              <span style={{ color: 'var(--status-safe)', fontWeight: 'bold' }}>0.00 bps (Pulled)</span>
            </div>
            <div style={{
              paddingTop: '12px',
              borderTop: '1px solid var(--border-default)',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold'
            }}>
              <span style={{ color: 'var(--text-primary)' }}>Net Edge at Horizon:</span>
              <span style={{ color: 'var(--status-safe)', fontSize: '14px' }}>+5.25 bps</span>
            </div>
          </div>
          <p style={{
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            marginTop: '16px',
            fontStyle: 'italic',
            lineHeight: 1.4
          }}>
            *Intra-block reactive cancellation pulls orders in the SAME consensus block.
          </p>
        </div>
      </div>
    </div>
  );
}
