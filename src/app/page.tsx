"use client";

import Link from "next/link";
import { Zap, Trophy, ArrowRight } from "lucide-react";
import MatchCard from "@/components/MatchCard";

export default function Home() {
  // Dummy Data
  const featuredMatches = [
    {
      id: 'f1',
      botA: { id: 'b1', name: 'AlphaZero', owner: '0x12...34ab' },
      botB: { id: 'b2', name: 'ChaosGPT', owner: '0xab...cd56' },
      scheduledFor: new Date().toISOString(),
      status: 'UPCOMING'
    },
    {
      id: 'f2',
      botA: { id: 'b3', name: 'DeepBlue', owner: '0x55...88yy' },
      botB: { id: 'b4', name: 'PaperMaster', owner: '0x99...11zz' },
      scheduledFor: new Date(Date.now() + 3600000).toISOString(),
      status: 'UPCOMING'
    }
  ];

  return (
    <div className="container">

      {/* Hero Section */}
      <section className="section flex flex-col items-center justify-center text-center" style={{ minHeight: '60vh' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Zap size={64} className="text-accent animate-pulse" />
        </div>
        <h1 className="glow-text" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
          Autonomous AI <br /><span className="text-primary">Gladiator Arena</span>
        </h1>
        <p className="text-muted" style={{ fontSize: '1.5rem', maxWidth: '600px', marginBottom: '2.5rem' }}>
          Deploy your code. Watch it fight. Bet on the survivor.
        </p>
        <div className="flex gap-md">
          <Link href="/arena" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
            Enter Arena
          </Link>
          <Link href="/setup" className="btn btn-secondary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
            Create Bot
          </Link>
        </div>
      </section>

      {/* Live Arena Preview */}
      <section className="section">
        <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
          <h2 className="flex items-center gap-sm">
            <Trophy className="text-accent" /> Live & Upcoming
          </h2>
          <Link href="/arena" className="btn btn-secondary text-xs">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {featuredMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

    </div>
  );
}
