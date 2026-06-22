import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuthStore } from '../store';
import { Users, Link as LinkIcon, Copy, TrendingUp, Trophy, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';

export function Network() {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const referralLink = `https://avatar.ai/register?ref=${user?.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const levelData = [
    { level: 1, percent: 3.0, team: 0, volume: 0, active: 0 },
    { level: 2, percent: 2.0, team: 0, volume: 0, active: 0 },
    { level: 3, percent: 1.0, team: 0, volume: 0, active: 0 },
    { level: 4, percent: 0.9, team: 0, volume: 0, active: 0 },
    { level: 5, percent: 0.8, team: 0, volume: 0, active: 0 },
    { level: 6, percent: 0.7, team: 0, volume: 0, active: 0 },
    { level: 7, percent: 0.6, team: 0, volume: 0, active: 0 },
    { level: 8, percent: 0.5, team: 0, volume: 0, active: 0 },
    { level: 9, percent: 0.4, team: 0, volume: 0, active: 0 },
    { level: 10, percent: 0.3, team: 0, volume: 0, active: 0 },
  ];

  const totalTeam = levelData.reduce((acc, curr) => acc + curr.team, 0);
  const totalVolume = levelData.reduce((acc, curr) => acc + curr.volume, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Referral Network</h1>
        <p className="text-gray-400">Build your team and earn multi-level rewards.</p>
      </div>

      <Card className="bg-brand-surface/30 border-brand-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Your Unique Referral Link</p>
              <div className="flex items-center space-x-2">
                <LinkIcon className="h-4 w-4 text-brand-accent" />
                <span className="text-white font-mono">{referralLink}</span>
              </div>
            </div>
            <Button variant="outline" className="border-brand-border" onClick={handleCopy}>
              {copied ? <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />} 
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-brand-surface/30 border-brand-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Team Size</CardTitle>
            <Users className="h-4 w-4 text-brand-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalTeam}</div>
            <p className="text-xs text-brand-accent mt-1">Across 10 levels</p>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-surface/30 border-brand-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Team Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalVolume.toLocaleString()}</div>
            <p className="text-xs text-gray-400 mt-1">Active staked assets</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-surface/30 border-brand-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Direct Referrals (L1)</CardTitle>
            <Trophy className="h-4 w-4 text-brand-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{levelData[0].team}</div>
            <p className="text-xs text-green-500 mt-1">{levelData[0].active} Active Stakes</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-surface/30 border-brand-border/50">
        <CardHeader>
          <CardTitle>10-Level Commission Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-500 uppercase bg-brand-bg/50 border-y border-brand-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Level</th>
                  <th className="px-6 py-4 font-medium text-brand-accent">Commission</th>
                  <th className="px-6 py-4 font-medium">Total Members</th>
                  <th className="px-6 py-4 font-medium">Active Stakes</th>
                  <th className="px-6 py-4 text-right font-medium">Team Volume</th>
                </tr>
              </thead>
              <tbody>
                {levelData.map((data, index) => {
                  const isActive = index < 4; // Mock unlocking based on direct refs requirement
                  return (
                  <tr key={data.level} className="border-b border-brand-border/30 hover:bg-brand-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        Level {data.level}
                        {!isActive && <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-brand-surface text-gray-500 border border-brand-border">LOCKED</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brand-accent font-semibold">{data.percent}%</td>
                    <td className="px-6 py-4 text-white font-medium">{data.team}</td>
                    <td className="px-6 py-4">{data.active}</td>
                    <td className="px-6 py-4 text-right">${data.volume.toLocaleString()}</td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
