import React from 'react';
import { IconLayers, IconPlus, IconCheckCircle, IconAlertOctagon } from './ui/PremiumIcons.jsx';

export default function CLOBOrderbook({ orders, market, onAddOrder }) {
  const bids = orders.filter(o => o.isBid);
  const asks = orders.filter(o => !o.isBid);

  const styles = {
    container: {
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-neu-out)',
      border: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)',
      boxSizing: 'border-box'
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
    addBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      fontSize: '12px',
      fontFamily: 'var(--font-mono)',
      fontWeight: '600',
      borderRadius: 'var(--radius-sm)',
      backgroundColor: 'var(--bg-surface)',
      color: 'var(--accent)',
      border: 'none',
      boxShadow: 'var(--shadow-neu-out-sm)',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    bookContent: {
      marginTop: '20px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '20px'
    },
    sectionHeader: {
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
      marginBottom: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: '600'
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '12px 0',
      color: 'var(--text-tertiary)',
      fontSize: '12px',
      fontStyle: 'italic',
      fontFamily: 'var(--font-mono)'
    },
    orderRow: (isCancelled, type) => ({
      padding: '12px 16px',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'var(--bg-surface)',
      boxShadow: isCancelled ? 'var(--shadow-neu-in)' : 'var(--shadow-neu-out-sm)',
      opacity: isCancelled ? 0.7 : 1,
      textDecoration: isCancelled ? 'line-through' : 'none',
      border: '1px solid var(--border-subtle)',
      color: isCancelled 
        ? 'var(--text-secondary)' 
        : (type === 'ask' ? 'var(--status-danger)' : 'var(--status-safe)')
    }),
    rowLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    rowRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '13px',
      fontFamily: 'var(--font-mono)'
    },
    orderIdBadge: {
      fontSize: '11px',
      padding: '2px 6px',
      borderRadius: 'var(--radius-sm)',
      backgroundColor: 'var(--bg-inset)',
      color: 'var(--text-secondary)',
      boxShadow: 'var(--shadow-neu-in)',
      fontFamily: 'var(--font-mono)'
    },
    price: {
      fontWeight: '700',
      fontSize: '13px',
      fontFamily: 'var(--font-mono)'
    },
    spreadDivider: {
      padding: '12px 16px',
      backgroundColor: 'var(--bg-inset)',
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '12px',
      fontFamily: 'var(--font-mono)',
      boxShadow: 'var(--shadow-neu-in)',
      margin: '10px 0'
    }
  };

  return (
    <div className="dash-card" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)',
      boxSizing: 'border-box'
    }}>
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <IconLayers size={20} />
          <h2 style={styles.title}>
            dreamDEX CLOB ORDERBOOK ({market.symbol})
          </h2>
        </div>
        <button onClick={onAddOrder} className="dash-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
          <IconPlus size={14} />
          <span>Stage Limit Order</span>
        </button>
      </div>

      <div style={styles.bookContent}>
        {/* Asks (Sells) */}
        <div>
          <div style={styles.sectionHeader}>
            <span>Asks (Sell Orders)</span>
            <span>Price ($) / Size</span>
          </div>
          <div style={styles.list}>
            {asks.length === 0 ? (
              <div style={styles.emptyState}>No active asks</div>
            ) : (
              asks.map((o) => {
                const isCancelled = o.status === 'CANCELLED_BY_TENDON';
                return (
                  <div key={o.id} className="dash-order-row" style={styles.orderRow(isCancelled, 'ask')}>
                    <div style={styles.rowLeft}>
                      <span style={styles.orderIdBadge}>#{o.id}</span>
                      <span style={styles.price}>${o.price.toLocaleString()}</span>
                    </div>
                    <div style={styles.rowRight}>
                      <span>{o.quantity} {market.symbol.split(':')[0]}</span>
                      <StatusBadge status={o.status} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Spread Divider */}
        <div style={styles.spreadDivider}>
          <span style={{ color: 'var(--text-secondary)' }}>Venue Mid-Price:</span>
          <span style={{ color: 'var(--accent)', fontWeight: '700', letterSpacing: '0.5px' }}>
            ${market.defaultPrice.toLocaleString()} USDso
          </span>
          <span style={{ fontSize: '11px', color: 'var(--status-safe)' }}>Spread: ~5.25 bps</span>
        </div>

        {/* Bids (Buys) */}
        <div>
          <div style={styles.sectionHeader}>
            <span>Bids (Buy Orders)</span>
            <span>Price ($) / Size</span>
          </div>
          <div style={styles.list}>
            {bids.length === 0 ? (
              <div style={styles.emptyState}>No active bids</div>
            ) : (
              bids.map((o) => {
                const isCancelled = o.status === 'CANCELLED_BY_TENDON';
                return (
                  <div key={o.id} className="dash-order-row" style={styles.orderRow(isCancelled, 'bid')}>
                    <div style={styles.rowLeft}>
                      <span style={styles.orderIdBadge}>#{o.id}</span>
                      <span style={styles.price}>${o.price.toLocaleString()}</span>
                    </div>
                    <div style={styles.rowRight}>
                      <span>{o.quantity} {market.symbol.split(':')[0]}</span>
                      <StatusBadge status={o.status} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const baseStyle = {
    padding: '4px 8px',
    borderRadius: 'var(--radius-pill)',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: 'var(--shadow-neu-in)',
    backgroundColor: 'var(--bg-inset)'
  };

  if (status === 'ACTIVE') {
    return (
      <span style={{ ...baseStyle, color: 'var(--status-safe)' }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--status-safe)'
        }}></span>
        RESTING
      </span>
    );
  }
  if (status === 'CANCELLED_BY_TENDON') {
    return (
      <span style={{ ...baseStyle, color: 'var(--accent)' }}>
        <IconCheckCircle size={12} color="var(--accent)" />
        PULLED BY TENDON
      </span>
    );
  }
  if (status === 'SNIPER_FAILED') {
    return (
      <span style={{ ...baseStyle, color: 'var(--status-warn)' }}>
        <IconAlertOctagon size={12} color="var(--status-warn)" />
        SNIPER REVERTED
      </span>
    );
  }
  return null;
}
