import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { IconShield, IconZap, IconExternalLink, IconCpu, IconSwords, IconSliders, IconBarChart, IconScroll, TendonLogo } from './ui/PremiumIcons.jsx';

export default function Navbar({ mmAddress, isConnected, onConnect, activeTab, setActiveTab }) {
  const styles = {
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(232, 236, 241, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-neu-out-sm)',
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 1.5rem',
      height: '4.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-sans)',
    },
    brandGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    logoIconContainer: {
      width: '2.25rem',
      height: '2.25rem',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--accent)',
      boxShadow: 'var(--shadow-neu-out)',
      border: '1px solid var(--border-subtle)',
    },
    brandTextContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    brandTitleRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    brandTitle: {
      fontWeight: 'bold',
      fontSize: '1.125rem',
      letterSpacing: '0.05em',
      color: 'var(--text-primary)',
    },
    brandBadge: {
      fontSize: '0.625rem',
      textTransform: 'uppercase',
      fontFamily: 'var(--font-mono)',
      padding: '0.125rem 0.5rem',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--bg-elevated)',
      color: 'var(--accent)',
      boxShadow: 'var(--shadow-neu-in)',
      border: '1px solid var(--border-default)',
    },
    brandSubtitle: {
      fontSize: '0.6875rem',
      color: 'var(--text-tertiary)',
      marginTop: '0.125rem',
      display: 'block',
    },
    tabNavContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--bg-surface)',
      boxShadow: 'var(--shadow-neu-in)',
    },
    navTabButton: (isActive) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 14px',
      borderRadius: 'var(--radius-pill)',
      fontSize: '12px',
      fontWeight: isActive ? '700' : '500',
      fontFamily: 'var(--font-sans)',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.25s ease',
      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
      background: isActive ? 'var(--bg-base)' : 'transparent',
      boxShadow: isActive ? 'var(--shadow-neu-out-sm)' : 'none',
    }),
    statusGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
      fontSize: '0.75rem',
      fontFamily: 'var(--font-mono)',
    },
    statusBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.375rem 0.75rem',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--bg-surface)',
      boxShadow: 'var(--shadow-neu-in)',
      border: '1px solid var(--border-default)',
    },
    statusDot: {
      width: '0.5rem',
      height: '0.5rem',
      borderRadius: '50%',
      background: 'var(--status-safe)',
      boxShadow: '0 0 8px var(--status-safe)',
    },
    statusTextLabel: {
      color: 'var(--text-secondary)',
    },
    statusTextActive: {
      color: 'var(--status-safe)',
      fontWeight: '600',
    },
    statusTextChain: {
      color: 'var(--accent)',
      fontWeight: '600',
    },
    explorerLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      color: 'var(--text-secondary)',
      textDecoration: 'none',
      transition: 'color 0.2s',
      cursor: 'pointer',
    },
    walletGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    walletButton: {
      padding: '0.5rem 1rem',
      fontSize: '0.75rem',
      fontFamily: 'var(--font-mono)',
      fontWeight: '500',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-surface)',
      color: 'var(--accent)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-neu-out)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      outline: 'none',
    }
  };

  const navTabs = [
    { id: 'arena', label: 'Defense Arena', Icon: IconSwords },
    { id: 'trading', label: 'Risk & Orderbook', Icon: IconSliders },
    { id: 'analytics', label: 'Analytics', Icon: IconBarChart },
    { id: 'audit', label: 'Audit Ledger', Icon: IconScroll }
  ];

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        
        {/* Brand */}
        <div style={styles.brandGroup}>
          <div style={{ ...styles.logoIconContainer, overflow: 'hidden', padding: 0 }}>
            <img 
              src="/logo.jpg" 
              alt="Tendon Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div style={styles.brandTextContainer}>
            <div style={styles.brandTitleRow}>
              <span style={styles.brandTitle}>TENDON</span>
              <span style={styles.brandBadge}>
                Somnia L1 Native
              </span>
            </div>
            <p style={styles.brandSubtitle}>
              Reactive Order Protection Layer for dreamDEX CLOB
            </p>
          </div>
        </div>

        {/* Center Tab Navigation Switcher (when activeTab prop is provided) */}
        {setActiveTab && (
          <div style={styles.tabNavContainer}>
            {navTabs.map(t => {
              const isActive = activeTab === t.id;
              const TabIcon = t.Icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className="dash-nav-tab"
                  style={styles.navTabButton(isActive)}
                >
                  <TabIcon
                    size={14}
                    color={isActive ? 'var(--accent)' : 'var(--text-secondary)'}
                    style={{ flexShrink: 0 }}
                  />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Status Indicators & Wallet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {!setActiveTab && (
            <div style={styles.statusGroup}>
              <div style={styles.statusBadge}>
                <span style={styles.statusDot}></span>
                <span style={styles.statusTextLabel}>0x0100:</span>
                <span style={styles.statusTextActive}>ACTIVE</span>
              </div>

              <div style={styles.statusBadge}>
                <IconCpu size={14} />
                <span style={styles.statusTextLabel}>Chain:</span>
                <span style={styles.statusTextChain}>50312</span>
              </div>
            </div>
          )}

        {/* MM Wallet Action — RainbowKit & Wagmi Wallet Integration */}
        <div style={styles.walletGroup}>
          <ConnectButton
            showBalance={false}
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
            chainStatus="icon"
          />
        </div>
      </div>
    </div>
  </header>
  );
}
