import React, { useState } from 'react';
import { IconSliders, IconShieldCheck, IconRefresh } from './ui/PremiumIcons.jsx';

export const MARKETS = [
  {
    symbol: "WBTC:USDso",
    name: "Bitcoin / USDso",
    pool: "0x3605f28aA7C50e7441211e77Cb0762d49539326C",
    defaultPrice: 60000,
    decimals: 8
  },
  {
    symbol: "WETH:USDso",
    name: "Ethereum / USDso",
    pool: "0xD180195da5459C7a0DEA188ed61216ec43682b50",
    defaultPrice: 3400,
    decimals: 18
  },
  {
    symbol: "SOMI:USDso",
    name: "Somnia Native / USDso",
    pool: "0x259fD6559214dd5aD3752322426eA9F9fABEFff4",
    defaultPrice: 1.25,
    decimals: 18
  }
];

export default function MMRuleManager({
  rule,
  onSaveRule,
  collateral,
  onDeposit,
  onWithdraw,
  selectedMarket,
  setSelectedMarket
}) {
  const [thresholdBps, setThresholdBps] = useState(rule?.thresholdBps || 100);
  const [refPrice, setRefPrice] = useState(rule?.referencePrice || selectedMarket.defaultPrice);
  const [action, setAction] = useState(rule?.action || 'CANCEL_ALL');
  const [depositAmount, setDepositAmount] = useState('0.5');

  const handleMarketChange = (symbol) => {
    const market = MARKETS.find(m => m.symbol === symbol) || MARKETS[0];
    setSelectedMarket(market);
    setRefPrice(market.defaultPrice);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveRule({
      market: selectedMarket.symbol,
      pool: selectedMarket.pool,
      referencePrice: Number(refPrice),
      thresholdBps: Number(thresholdBps),
      action: action,
      active: true
    });
  };

  const styles = {
    container: {
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-neu-out)',
      border: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: '16px',
      borderBottom: '1px solid var(--border-default)'
    },
    titleGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    title: {
      fontWeight: '600',
      fontSize: '14px',
      letterSpacing: '0.5px',
      color: 'var(--text-primary)',
      margin: 0
    },
    proxyBadge: {
      fontSize: '12px',
      fontFamily: 'var(--font-mono)',
      padding: '4px 10px',
      borderRadius: 'var(--radius-pill)',
      backgroundColor: 'var(--bg-inset)',
      color: 'var(--status-safe)',
      boxShadow: 'var(--shadow-neu-in)',
      fontWeight: '600'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    label: {
      display: 'block',
      fontSize: '12px',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-secondary)',
      marginBottom: '8px',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      backgroundColor: 'var(--bg-inset)',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
      fontSize: '13px',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-primary)',
      boxShadow: 'var(--shadow-neu-in)',
      outline: 'none',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      backgroundColor: 'var(--bg-inset)',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
      fontSize: '13px',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-primary)',
      boxShadow: 'var(--shadow-neu-in)',
      outline: 'none',
      boxSizing: 'border-box',
      appearance: 'none',
      cursor: 'pointer'
    },
    grid2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    helperText: {
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-tertiary)',
      marginTop: '6px',
      margin: 0
    },
    accentText: {
      color: 'var(--accent)'
    },
    actionGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '12px'
    },
    actionBtn: (isActive) => ({
      padding: '10px 8px',
      borderRadius: 'var(--radius-sm)',
      border: 'none',
      textAlign: 'center',
      fontSize: '12px',
      fontFamily: 'var(--font-mono)',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontWeight: isActive ? '700' : '500',
      backgroundColor: isActive ? 'var(--bg-surface)' : 'var(--bg-base)',
      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
      boxShadow: isActive ? 'var(--shadow-neu-in)' : 'var(--shadow-neu-out-sm)',
    }),
    noticeBox: {
      padding: '16px',
      backgroundColor: 'var(--bg-elevated)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      boxShadow: 'var(--shadow-neu-in)'
    },
    noticeText: {
      fontSize: '12px',
      color: 'var(--text-secondary)',
      lineHeight: '1.5',
      margin: 0
    },
    codeSnippet: {
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      color: 'var(--status-warn)',
      backgroundColor: 'var(--bg-inset)',
      padding: '2px 6px',
      borderRadius: '4px',
      boxShadow: 'var(--shadow-neu-in)'
    },
    submitBtn: {
      width: '100%',
      padding: '14px',
      borderRadius: 'var(--radius-md)',
      backgroundColor: 'var(--bg-surface)',
      color: 'var(--accent)',
      fontWeight: '700',
      fontSize: '13px',
      fontFamily: 'var(--font-mono)',
      letterSpacing: '1px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      boxShadow: 'var(--shadow-neu-out)',
      transition: 'all 0.2s'
    },
    collateralSection: {
      marginTop: '8px',
      paddingTop: '20px',
      borderTop: '1px solid var(--border-default)'
    },
    collateralHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '13px',
      fontFamily: 'var(--font-mono)',
      marginBottom: '12px'
    },
    collateralRow: {
      display: 'flex',
      gap: '12px'
    },
    collateralInput: {
      width: '100px',
      backgroundColor: 'var(--bg-inset)',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      padding: '10px 12px',
      fontSize: '13px',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-primary)',
      boxShadow: 'var(--shadow-neu-in)',
      outline: 'none'
    },
    depositBtn: {
      flex: 1,
      padding: '10px',
      backgroundColor: 'var(--bg-surface)',
      color: 'var(--status-safe)',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      fontSize: '13px',
      fontFamily: 'var(--font-mono)',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-neu-out-sm)',
    }
  };

  return (
    <div className="dash-card" style={{ padding: '24px', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <IconSliders size={20} />
          <h2 style={styles.title}>MM RISK RULE CONFIGURATOR</h2>
        </div>
        <span style={styles.proxyBadge}>
          Proxy: Tendon.sol
        </span>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label style={styles.label}>Target dreamDEX Market</label>
          <select
            value={selectedMarket.symbol}
            onChange={(e) => handleMarketChange(e.target.value)}
            className="dash-select"
          >
            {MARKETS.map(m => (
              <option key={m.symbol} value={m.symbol}>
                {m.symbol} — ({m.name})
              </option>
            ))}
          </select>
          <p style={styles.helperText}>
            Pool Contract: {selectedMarket.pool}
          </p>
        </div>

        <div style={styles.grid2}>
          <div>
            <label style={styles.label}>Reference Price ($)</label>
            <input
              type="number"
              step="any"
              value={refPrice}
              onChange={(e) => setRefPrice(e.target.value)}
              className="dash-input"
              required
            />
          </div>

          <div>
            <label style={styles.label}>Threshold (BPS)</label>
            <input
              type="number"
              value={thresholdBps}
              onChange={(e) => setThresholdBps(e.target.value)}
              className="dash-input"
              required
            />
            <p style={{ ...styles.helperText, ...styles.accentText }}>
              = {(thresholdBps / 100).toFixed(2)}% price deviation
            </p>
          </div>
        </div>

        <div>
          <label style={styles.label}>Reactivity Action</label>
          <div style={styles.actionGrid}>
            {['CANCEL_ALL', 'CANCEL_BIDS', 'CANCEL_ASKS'].map((act) => (
              <button
                type="button"
                key={act}
                onClick={() => setAction(act)}
                style={styles.actionBtn(action === act)}
              >
                {act.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="dash-notice">
          <IconShieldCheck size={18} />
          <p style={styles.noticeText}>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Tendon Builder Fee:</span> 0.10% (10 bps) charged only upon successful intra-block reactive cancellation. Stale orders are pulled directly via <code style={styles.codeSnippet}>0x0100</code> precompile.
          </p>
        </div>

        <button
          type="submit"
          className="dash-btn dash-btn-full"
          style={{ padding: '14px', fontSize: '13px', letterSpacing: '1px' }}
        >
          <IconRefresh size={16} />
          REGISTER REACTIVE RULE
        </button>
      </form>

      <div style={styles.collateralSection}>
        <div style={styles.collateralHeader}>
          <span style={{ color: 'var(--text-secondary)' }}>MM Gas/Fee Collateral:</span>
          <span style={{ color: 'var(--status-safe)', fontWeight: 700 }}>{collateral.toFixed(3)} STT</span>
        </div>
        <div style={styles.collateralRow}>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="dash-input"
            style={{ width: '100px' }}
          />
          <button
            onClick={() => onDeposit(depositAmount)}
            className="dash-btn dash-btn-safe"
            style={{ flex: 1, padding: '10px', fontSize: '13px' }}
          >
            Deposit Collateral
          </button>
        </div>
      </div>
    </div>
  );
}
