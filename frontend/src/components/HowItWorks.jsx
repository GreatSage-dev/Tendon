import React from 'react';
import { Activity, Zap, ShieldCheck, XCircle } from 'lucide-react';

const STEPS = [
  {
    icon: Activity,
    phase: '01',
    title: 'Price Shock Detected',
    desc: 'Somnia Data Streams broadcast a real-time oracle price shift — BTC drops 2% in a single block.',
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/5',
    glow: 'shadow-amber-500/10',
  },
  {
    icon: Zap,
    phase: '02',
    title: 'Tendon Fires',
    desc: 'The 0x0100 precompile triggers TendonProxy atomically — in the same block, before any other transaction executes.',
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/5',
    glow: 'shadow-cyan-500/10',
  },
  {
    icon: ShieldCheck,
    phase: '03',
    title: 'Orders Pulled',
    desc: 'All stale limit orders matching your rules are cancelled on dreamDEX CLOB. Your collateral is safe.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/5',
    glow: 'shadow-emerald-500/10',
  },
  {
    icon: XCircle,
    phase: '04',
    title: 'Sniper Reverts',
    desc: 'MEV bot tries to fill your stale orders — transaction reverts. OrderInactive. Zero toxic flow extracted.',
    color: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'bg-red-500/5',
    glow: 'shadow-red-500/10',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 px-6 sm:px-10 lg:px-16">

      {/* Section header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-xs font-medium text-cyan-400 tracking-[0.2em] uppercase mb-3">The Reflex Arc</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Stimulus → Response. Same Block.
        </h2>
        <p className="mt-4 text-slate-400 text-base max-w-xl mx-auto">
          Like a biological reflex, Tendon bypasses the slow path. No mempool. No delay. The protection fires before attackers even see the price move.
        </p>
      </div>

      {/* Steps — vertical timeline on mobile, horizontal on desktop */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative">

          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-amber-500/30 via-cyan-500/30 to-red-500/30" />

          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.phase}
                className={`relative p-5 rounded-2xl border ${step.border} ${step.bg} backdrop-blur-sm shadow-lg ${step.glow}`}
              >
                {/* Phase number */}
                <div className={`text-[10px] font-mono font-bold ${step.color} tracking-widest mb-3`}>
                  PHASE {step.phase}
                </div>

                {/* Icon */}
                <div className={`w-9 h-9 rounded-lg ${step.bg} border ${step.border} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4.5 h-4.5 ${step.color}`} />
                </div>

                {/* Text */}
                <h3 className="font-semibold text-white text-sm mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom callout */}
      <div className="max-w-2xl mx-auto mt-14 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-xs font-mono text-slate-500">Total latency from price shock to order pull:</span>
          <span className="text-sm font-bold font-mono text-cyan-400">0 blocks</span>
        </div>
      </div>
    </section>
  );
}
