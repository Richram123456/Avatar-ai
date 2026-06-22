import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuthStore, usePlatformStore } from '../store';
import { Trophy, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export function Ranks() {
  const { user } = useAuthStore();
  const { wallet } = usePlatformStore();

  const currentStakingVolume = wallet.stakedPrincipal; // Using staked principal as current staking volume

  const rankData = [
    { name: 'Member', reqVolume: 0, reqDirects: 0, currentVolume: currentStakingVolume, currentDirects: 0 },
    { name: 'Leader', reqVolume: 5000, reqDirects: 2, currentVolume: currentStakingVolume, currentDirects: 0 },
    { name: 'Pro Leader', reqVolume: 10000, reqDirects: 5, currentVolume: currentStakingVolume, currentDirects: 0 },
    { name: 'Manager', reqVolume: 50000, reqDirects: 10, currentVolume: currentStakingVolume, currentDirects: 0 },
    { name: 'Director', reqVolume: 100000, reqDirects: 15, currentVolume: currentStakingVolume, currentDirects: 0 },
    { name: 'Senior Director', reqVolume: 500000, reqDirects: 20, currentVolume: currentStakingVolume, currentDirects: 0 },
    { name: 'Executive Director', reqVolume: 1000000, reqDirects: 25, currentVolume: currentStakingVolume, currentDirects: 0 },
  ];

  const currentRankIndex = rankData.map(r => r.currentVolume >= r.reqVolume && r.currentDirects >= r.reqDirects).lastIndexOf(true);
  const currentRank = currentRankIndex >= 0 ? rankData[currentRankIndex].name : 'None';
  const nextRank = currentRankIndex >= 0 && currentRankIndex < rankData.length - 1 ? rankData[currentRankIndex + 1] : null;
  
  const progressToNextRank = nextRank 
    ? Math.min((currentStakingVolume / nextRank.reqVolume) * 100, 100)
    : 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Qualification Engine</h1>
        <p className="text-gray-400">Unlock ranks to participate in the global community pool.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-3 bg-brand-surface/30 border-brand-border/50">
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 space-y-4 md:space-y-0 text-left">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="h-16 w-16 min-w-[4rem] rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-brand-accent" />
              </div>
              <div className="flex-1 w-full flex-grow">
                <CardTitle className="text-2xl">Current Rank: <span className="text-brand-accent">{currentRank}</span></CardTitle>
                <p className="text-sm text-gray-400 mt-1 whitespace-normal">You are qualified for community pool distributions based on this rank.</p>
              </div>
            </div>
            
            {nextRank && (
              <div className="w-full md:w-1/2 bg-brand-bg/50 p-4 rounded-xl border border-brand-border/30">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Next Target</p>
                    <p className="text-lg font-bold text-white flex items-center">
                      {nextRank.name} <ArrowUpRight className="ml-1 flex-shrink-0 h-4 w-4 text-brand-accent" />
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-brand-accent font-bold">{progressToNextRank.toFixed(1)}%</p>
                    <p className="text-[10px] text-gray-500">${currentStakingVolume.toLocaleString()} / ${nextRank.reqVolume.toLocaleString()}</p>
                  </div>
                </div>
                <div className="w-full bg-brand-surface rounded-full h-2 shadow-inner overflow-hidden">
                  <div 
                    className="h-full bg-brand-accent rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${progressToNextRank}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
            
            {!nextRank && (
              <div className="w-full md:w-1/2 bg-brand-accent/20 p-4 rounded-xl border border-brand-accent/30 flex items-center justify-center">
                 <p className="text-brand-accent font-bold text-center">Maximum Rank Achieved!</p>
              </div>
            )}
          </CardHeader>
        </Card>

        {rankData.map((rank, index) => {
          const isUnlocked = rank.currentVolume >= rank.reqVolume && rank.currentDirects >= rank.reqDirects;
          const isCurrent = currentRank === rank.name;

          return (
            <Card key={index} className={`relative overflow-hidden transition-all duration-300 ${
              isCurrent 
                ? 'bg-brand-surface border-brand-accent ring-1 ring-brand-accent' 
                : isUnlocked 
                  ? 'bg-brand-surface/30 border-brand-border' 
                  : 'bg-brand-bg opacity-70 border-brand-border/30'
            }`}>
              {isCurrent && (
                <div className="absolute top-0 right-0 py-1 px-3 bg-brand-accent text-black text-[10px] font-bold uppercase tracking-wider rounded-bl-lg z-10">
                  Current Rank
                </div>
              )}
              <CardHeader className="relative z-0">
                <div className="flex items-center space-x-2">
                   {isUnlocked ? <CheckCircle2 className="h-5 w-5 text-brand-accent" /> : <Lock className="h-5 w-5 text-gray-600" />}
                   <CardTitle className="text-lg">{rank.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative z-0">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Personal Staking Volume</span>
                    <span className="text-white">${rank.reqVolume.toLocaleString()} required</span>
                  </div>
                  <div className="w-full bg-brand-bg rounded-full h-1.5 border border-brand-border/50 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${isUnlocked ? 'bg-brand-accent' : 'bg-gray-600'}`}
                      style={{ width: `${Math.min((rank.currentVolume / Math.max(rank.reqVolume, 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Active Directs</span>
                    <span className="text-white">{rank.reqDirects} required</span>
                  </div>
                  <div className="w-full bg-brand-bg rounded-full h-1.5 border border-brand-border/50 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${isUnlocked ? 'bg-brand-accent' : 'bg-gray-600'}`}
                      style={{ width: `${Math.min((rank.currentDirects / Math.max(rank.reqDirects, 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
