import React from 'react';
import { IconDatabase, IconExternalLink } from './ui/PremiumIcons.jsx';

const EXPLORER_BASE = "https://shannon-explorer.somnia.network";

export default function AuditLedger({ pullRecords, loggerAddress }) {
  return (
    <div className="dash-card" style={{
      padding: '24px',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-default)',
        flexWrap: 'wrap',
        gap: '12px'
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
            <IconDatabase size={20} />
          </div>
          <div>
            <h2 style={{
              margin: 0,
              fontWeight: 600,
              fontSize: '14px',
              letterSpacing: '0.05em',
              color: 'var(--text-primary)'
            }}>
              IMMUTABLE AUDIT LAYER (TendonLogger.sol)
            </h2>
            <p style={{
              margin: 0,
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              marginTop: '2px'
            }}>
              Judge verification surface — every pull record is permanent and non-custodial.
            </p>
          </div>
        </div>

        <a
          href={`${EXPLORER_BASE}/address/${loggerAddress || '0x3c0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a'}`}
          target="_blank"
          rel="noreferrer"
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-neu-out-sm)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--accent)',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          <span>Contract on Explorer</span>
          <IconExternalLink size={14} />
        </a>
      </div>

      {/* Pulls Table */}
      <div style={{
        marginTop: '24px',
        overflowX: 'auto',
        background: 'var(--bg-inset)',
        boxShadow: 'var(--shadow-neu-in)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)',
        padding: '12px'
      }}>
        <table style={{
          width: '100%',
          textAlign: 'left',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              fontSize: '10px',
              borderBottom: '1px solid var(--border-default)'
            }}>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Pull ID</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Market Maker</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Trigger Price</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Protected Orders</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Block #</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Builder Fee</th>
              <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Proof</th>
            </tr>
          </thead>
          <tbody>
            {pullRecords.length === 0 ? (
              <tr>
                <td colSpan="7" style={{
                  padding: '24px',
                  textAlign: 'center',
                  color: 'var(--text-tertiary)',
                  fontStyle: 'italic'
                }}>
                  No reactive pulls recorded yet. Trigger a price shock in the Arena to generate on-chain proof.
                </td>
              </tr>
            ) : (
              pullRecords.map((p, i) => (
                <tr key={p.pullId} style={{
                  background: i % 2 === 0 ? 'transparent' : 'var(--accent-muted)',
                  borderBottom: '1px solid var(--border-default)',
                  transition: 'background 0.2s'
                }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--accent)' }}>
                    #{p.pullId}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                    {p.mm.slice(0, 6)}...{p.mm.slice(-4)}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    ${Number(p.triggerPrice).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-pill)',
                      background: 'var(--bg-surface)',
                      boxShadow: 'var(--shadow-neu-out-sm)',
                      color: 'var(--status-safe)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '10px'
                    }}>
                      {p.ordersProtected} Orders
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--accent-bright)' }}>
                    #{p.blockNumber}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--status-warn)' }}>
                    {p.feePaid}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <a
                      href={`${EXPLORER_BASE}/tx/${p.txHash || '0x4d1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b'}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Verify</span>
                      <IconExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
