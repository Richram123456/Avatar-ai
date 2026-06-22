import { usePlatformStore, useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const data = [
  { name: 'Mon', value: 0 },
  { name: 'Tue', value: 0 },
  { name: 'Wed', value: 0 },
  { name: 'Thu', value: 0 },
  { name: 'Fri', value: 0 },
  { name: 'Sat', value: 0 },
  { name: 'Sun', value: 0 },
];

export function Dashboard() {
  const { wallet, stakes, deposits, withdrawals, claimRewards } = usePlatformStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const activeStakes = stakes.filter(s => s.status === 'active').length;

  const historyMappers = [
    ...deposits.map(d => ({
      id: d.id,
      type: 'Deposit',
      amount: `+ $${d.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      status: d.status,
      date: new Date(d.createdAt).toLocaleDateString(),
      icon: ArrowUpRight,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      timestamp: d.createdAt
    })),
    ...withdrawals.map(w => ({
      id: w.id,
      type: 'Withdrawal',
      amount: `- $${w.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      status: w.status,
      date: new Date(w.createdAt).toLocaleDateString(),
      icon: ArrowDownRight,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      timestamp: w.createdAt
    })),
    ...stakes.map(s => ({
      id: s.id,
      type: 'Stake Creation',
      amount: `- $${s.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      status: s.status,
      date: new Date(s.startedAt).toLocaleDateString(),
      icon: ArrowDownRight,
      color: 'text-white',
      bg: 'bg-white/10',
      timestamp: s.startedAt
    }))
  ];

  const recentTransactions = historyMappers.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Welcome back, <span className="text-brand-accent">{user?.username}</span>
          </h1>
          <p className="text-gray-400">Here's your ecosystem overview for today.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-brand-border" onClick={() => navigate('/wallet', { state: { tab: 'withdraw' } })}>Withdraw</Button>
          <Button variant="gold" onClick={() => navigate('/wallet', { state: { tab: 'deposit' } })}>Deposit</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-brand-surface/50 border-brand-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Assets</CardTitle>
            <Wallet className="h-4 w-4 text-brand-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${wallet.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-brand-accent mt-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +2.5% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-surface/50 border-brand-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Staked Principal</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${wallet.stakedPrincipal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-gray-400 mt-1">Across {activeStakes} active stakes</p>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-surface/50 border-brand-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Rewards</CardTitle>
            <Activity className="h-4 w-4 text-brand-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${wallet.totalRewards.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-gray-400 mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-accent border-none text-black relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-black/80">Available to Claim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${wallet.availableToClaim.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <Button 
              variant="default" 
              size="sm" 
              className="mt-3 w-full bg-black text-brand-accent hover:bg-black/90 font-semibold border-none disabled:opacity-50"
              onClick={() => {
                if (wallet.availableToClaim > 0) {
                  claimRewards();
                  alert(`Successfully claimed $${wallet.availableToClaim.toLocaleString()} in rewards!`);
                }
              }}
              disabled={wallet.availableToClaim <= 0}
            >
              {wallet.availableToClaim > 0 ? "Claim Rewards" : "No Rewards"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        <Card className="col-span-4 bg-brand-surface/30 border-brand-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161616', borderColor: '#333', borderRadius: '8px' }}
                    itemStyle={{ color: '#D4AF37' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-brand-surface/30 border-brand-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <p className="text-gray-400 text-sm py-4 text-center">No recent transactions.</p>
            ) : (
              <div className="space-y-6">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${tx.bg}`}>
                        <tx.icon className={`h-4 w-4 ${tx.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{tx.type}</p>
                        <p className="text-xs text-gray-500">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${tx.color}`}>{tx.amount}</p>
                      <p className="text-xs text-gray-500 capitalize">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button variant="ghost" className="w-full mt-6 text-sm text-brand-accent hover:text-brand-accent-hover" onClick={() => navigate('/wallet', { state: { tab: 'history' } })}>
              View All History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
