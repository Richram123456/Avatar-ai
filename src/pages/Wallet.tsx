import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePlatformStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowDownLeft, ArrowUpRight, Copy, CreditCard, Landmark, CheckCircle2, History } from 'lucide-react';

export function Wallet() {
  const { wallet, requestWithdrawal, requestDeposit, deposits, withdrawals, stakes } = usePlatformStore();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'history'>('overview');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositHash, setDepositHash] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  useEffect(() => {
    if ((location.state as any)?.tab) {
      setActiveTab((location.state as any).tab);
    }
  }, [location.state]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Address copied to clipboard!');
  };

  const handleDeposit = () => {
    if (!depositAmount || Number(depositAmount) <= 0 || !depositHash) {
      alert('Please enter a valid amount and transaction hash.');
      return;
    }
    requestDeposit(Number(depositAmount), depositHash);
    alert(`Deposit request for $${depositAmount} submitted successfully. Waiting for admin approval.`);
    setDepositAmount('');
    setDepositHash('');
  };

  const handleWithdraw = () => {
    const amt = Number(withdrawAmount);
    if (!amt || amt < 50) {
        alert('Minimum withdrawal is $50 USDT.');
        return;
    }
    if (!withdrawAddress) {
        alert('Please enter a withdrawal address.');
        return;
    }
    if (amt > wallet.availableBalance) {
        alert('Insufficient balance.');
        return;
    }
    const success = requestWithdrawal(amt, withdrawAddress);
    if (success) {
        alert(`Withdrawal of $${amt} requested successfully.`);
        setWithdrawAmount('');
        setWithdrawAddress('');
    }
  };

  const historyMappers = [
    ...deposits.map(d => ({
      id: d.id,
      type: 'Deposit',
      amount: `+ $${d.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      status: d.status,
      date: d.createdAt,
      icon: ArrowDownLeft,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    })),
    ...withdrawals.map(w => ({
      id: w.id,
      type: 'Withdrawal',
      amount: `- $${w.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      status: w.status,
      date: w.createdAt,
      icon: ArrowUpRight,
      color: 'text-red-500',
      bg: 'bg-red-500/10'
    })),
    ...stakes.map(s => ({
      id: s.id,
      type: 'Stake Creation',
      amount: `- $${s.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      status: s.status,
      date: s.startedAt,
      icon: Landmark,
      color: 'text-white',
      bg: 'bg-white/10'
    }))
  ];

  const transactions = historyMappers.sort((a, b) => b.date - a.date);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Wallet Engine</h1>
        <p className="text-gray-400">Manage your assets and treasury balances.</p>
      </div>

      <div className="flex space-x-2 border-b border-brand-border/50 pb-px flex-wrap">
        {['overview', 'deposit', 'withdraw', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab 
                ? 'border-brand-accent text-brand-accent' 
                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-brand-surface/30 border-brand-border/50 col-span-3 lg:col-span-1">
            <CardHeader className="pb-4">
               <CardTitle className="text-sm font-medium text-gray-400">Main Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white mb-4">
                ${wallet.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="flex space-x-3">
                <Button variant="default" className="w-full bg-white text-black" onClick={() => setActiveTab('deposit')}>
                  <ArrowDownLeft className="mr-2 h-4 w-4" /> Deposit
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab('withdraw')}>
                  <ArrowUpRight className="mr-2 h-4 w-4" /> Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-surface/30 border-brand-border/50 col-span-3 lg:col-span-2">
            <CardHeader>
               <CardTitle className="text-base font-medium text-white">Balances Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-brand-bg/50 border border-brand-border/30">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Deposit Credits</p>
                  <p className="text-xl font-bold text-white">${wallet.depositCredits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="p-4 rounded-xl bg-brand-bg/50 border border-brand-border/30">
                  <p className="text-xs text-brand-accent uppercase tracking-wider mb-1">Claimed Rewards</p>
                  <p className="text-xl font-bold text-white">${wallet.claimedRewards.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="p-4 rounded-xl bg-brand-bg/50 border border-brand-border/30">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Staking Rewards</p>
                  <p className="text-xl font-bold text-white">${wallet.totalRewards.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="p-4 rounded-xl bg-brand-bg/50 border border-brand-border/30">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Locked Principal</p>
                  <p className="text-xl font-bold text-white">${wallet.stakedPrincipal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'deposit' && (
        <Card className="max-w-2xl bg-brand-surface/30 border-brand-border/50">
          <CardHeader>
            <CardTitle>Deposit Funds</CardTitle>
            <p className="text-sm text-gray-400 mt-2">Transfer USDT (TRC20/BEP20) to your account to get Deposit Credits.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border border-brand-accent/30 bg-brand-accent/5 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider">USDT TRC20 Address</span>
                <span className="text-xs px-2 py-1 bg-brand-accent/10 text-brand-accent rounded">Network: TRON</span>
              </div>
              <div className="flex items-center space-x-2">
                <code className="flex-1 p-3 bg-brand-bg rounded-lg text-sm font-mono text-gray-300 break-all">
                  TNV2p8BqbQZV7vYXZXb2U4pYmCq2X8vYXZ
                </code>
                <Button variant="outline" size="icon" onClick={() => handleCopy('TNV2p8BqbQZV7vYXZXb2U4pYmCq2X8vYXZ')}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-brand-border/50">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Transfer Amount (USDT)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="pl-8 bg-brand-bg/50"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Transaction Hash (TxID)</label>
                <Input 
                  placeholder="Enter 64-character hash" 
                  className="bg-brand-bg/50 font-mono text-sm"
                  value={depositHash}
                  onChange={(e) => setDepositHash(e.target.value)}
                />
              </div>
              
              <Button variant="gold" className="w-full mt-2" onClick={handleDeposit}>Submit Deposit Request</Button>
              <p className="text-xs text-center text-gray-500 mt-2 flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Requests are processed within 5-15 minutes after network confirmation.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'withdraw' && (
        <Card className="max-w-2xl bg-brand-surface/30 border-brand-border/50">
           <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
            <div className="flex justify-between items-center mt-2 p-3 bg-brand-bg/50 rounded-lg border border-brand-border/30">
              <span className="text-sm text-gray-400">Available Balance</span>
              <span className="font-bold text-brand-accent">${wallet.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Withdrawal Amount (USDT)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input 
                    type="number" 
                    placeholder="Min 50.00" 
                    className="pl-8 bg-brand-bg/50"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button className="text-xs font-semibold text-brand-accent hover:text-white" onClick={() => setWithdrawAmount(wallet.availableBalance.toString())}>MAX</button>
                  </div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>5% Withdrawal Fee</span>
                  {Number(withdrawAmount) > 0 && <span>You receive: ${(Number(withdrawAmount) * 0.95).toFixed(2)}</span>}
                </div>
              </div>

               <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Destination Address (USDT TRC20)</label>
                <Input 
                  placeholder="Enter your wallet address" 
                  className="bg-brand-bg/50 font-mono text-sm"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                />
              </div>

               <Button variant="default" className="w-full mt-4 bg-white text-black" onClick={handleWithdraw}>Request Withdrawal</Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card className="max-w-4xl bg-brand-surface/30 border-brand-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <p className="text-sm text-gray-400 mt-2">Comprehensive log of your wallet activity.</p>
            </div>
            <History className="h-5 w-5 text-brand-accent opacity-50" />
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No transaction history found.</p>
            ) : (
              <div className="space-y-4">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-brand-bg rounded-lg border border-brand-border/30">
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                      <div className={`p-2 rounded-full ${tx.bg}`}>
                        <tx.icon className={`h-4 w-4 ${tx.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{tx.type}</p>
                        <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center justify-between sm:block ml-12 sm:ml-0">
                      <p className={`text-sm font-bold ${tx.color}`}>{tx.amount}</p>
                      <p className={`text-xs capitalize font-medium ${tx.status === 'approved' || tx.status === 'active' ? 'text-green-500' : tx.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {tx.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
