import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ShieldAlert, Users, TrendingUp, Landmark, ShieldCheck, Activity, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { usePlatformStore } from '../store';

export function Admin() {
  const { deposits, withdrawals, treasury, triggerTreasuryAudit, approveDeposit, rejectDeposit, approveWithdrawal, rejectWithdrawal } = usePlatformStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'deposits' | 'withdrawals'>('overview');

  const pendingDeposits = deposits.filter(d => d.status === 'pending');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');

  const pendingDepositsAmount = pendingDeposits.reduce((acc, d) => acc + d.amount, 0);
  const pendingWithdrawalsAmount = pendingWithdrawals.reduce((acc, w) => acc + w.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center">
            <ShieldAlert className="h-8 w-8 text-red-500 mr-3" />
            Admin Portal
          </h1>
          <p className="text-gray-400">High-privilege system controls and treasury oversight.</p>
        </div>
        <div className="px-3 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold tracking-wider uppercase">
          Master Admin
        </div>
      </div>

      <div className="flex space-x-2 border-b border-brand-border pb-px overflow-x-auto">
        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium rounded-none border-b-2 ${activeTab === 'overview' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Treasury Overview
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('deposits')}
          className={`px-4 py-2 font-medium rounded-none border-b-2 flex items-center ${activeTab === 'deposits' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Deposits
          {pendingDeposits.length > 0 && (
            <span className="ml-2 bg-brand-accent text-black text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingDeposits.length}</span>
          )}
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('withdrawals')}
          className={`px-4 py-2 font-medium rounded-none border-b-2 flex items-center ${activeTab === 'withdrawals' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Withdrawals
          {pendingWithdrawals.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingWithdrawals.length}</span>
          )}
        </Button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-brand-surface/30 border-brand-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">System Health</CardTitle>
                <Activity className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">Optimal</div>
                <p className="text-xs text-green-500 mt-1">All services online</p>
              </CardContent>
            </Card>

            <Card className="bg-brand-surface/30 border-brand-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Pending Deposits</CardTitle>
                <Landmark className="h-4 w-4 text-brand-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{pendingDeposits.length}</div>
                <p className="text-xs text-gray-400 mt-1">${pendingDepositsAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} to review</p>
              </CardContent>
            </Card>

            <Card className="bg-brand-surface/30 border-brand-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Pending Withdrawals</CardTitle>
                <TrendingUp className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{pendingWithdrawals.length}</div>
                <p className="text-xs text-gray-400 mt-1">${pendingWithdrawalsAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} to process</p>
              </CardContent>
            </Card>

            <Card className="bg-brand-surface/30 border-brand-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Flagged Users</CardTitle>
                <ShieldCheck className="h-4 w-4 text-brand-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">0</div>
                <p className="text-xs text-gray-400 mt-1">Requires audit</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-red-500/20 bg-brand-surface/30">
              <CardHeader>
                <CardTitle className="text-red-400">Treasury Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-brand-bg/50 rounded-lg border border-brand-border/30">
                     <p className="text-xs text-gray-500 mb-1">Total Assets (Bank/Exchange)</p>
                     <p className="text-xl font-bold text-green-400">${treasury.bankAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                   </div>
                   <div className="p-4 bg-brand-bg/50 rounded-lg border border-brand-border/30">
                     <p className="text-xs text-gray-500 mb-1">Total System Liabilities</p>
                     <p className="text-xl font-bold text-red-400">${treasury.totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                   </div>
                   <div className="p-4 bg-brand-bg/50 rounded-lg border border-brand-border/30">
                     <p className="text-xs text-gray-500 mb-1">Reserve Fund</p>
                     <p className="text-xl font-bold text-white">${treasury.reserveFund.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                   </div>
                   <div className="p-4 bg-brand-bg/50 rounded-lg border border-brand-border/30">
                     <p className="text-xs text-gray-500 mb-1">Treasury Ratio</p>
                     <p className="text-xl font-bold text-brand-accent">
                       {treasury.totalLiabilities > 0 ? ((treasury.bankAssets + treasury.reserveFund) / treasury.totalLiabilities * 100).toFixed(1) : '∞'}%
                     </p>
                   </div>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => {
                    triggerTreasuryAudit();
                    alert('Initiating global treasury audit logic. A snapshot of states will be captured. System adjusted mock crypto assets.');
                  }}>
                    Trigger Full Treasury Audit
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-surface/30 border-brand-border/50">
              <CardHeader>
                 <CardTitle>Management Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Deposit Review Queue', count: pendingDeposits.length, tab: 'deposits' },
                  { label: 'Withdrawal Approvals', count: pendingWithdrawals.length, tab: 'withdrawals' },
                  { label: 'User Operations', count: null, tab: 'overview' },
                  { label: 'Global System Settings', count: null, tab: 'overview' },
                ].map(link => (
                  <Button 
                    key={link.label} 
                    variant="outline" 
                    className="w-full justify-between px-4 font-normal text-gray-300 border-brand-border/50 hover:bg-brand-surface"
                    onClick={() => setActiveTab(link.tab as any)}
                  >
                    {link.label}
                    {link.count !== null && link.count > 0 && <span className="bg-brand-accent text-black text-[10px] font-bold px-2 py-0.5 rounded-full">{link.count}</span>}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'deposits' && (
        <Card className="bg-brand-surface/30 border-brand-border/50">
          <CardHeader>
            <CardTitle>Pending Deposits</CardTitle>
            <p className="text-sm text-gray-400 mt-1">Review and approve or reject user deposit requests.</p>
          </CardHeader>
          <CardContent>
            {pendingDeposits.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No pending deposits.</p>
            ) : (
              <div className="space-y-4">
                {pendingDeposits.map(dep => (
                  <div key={dep.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-brand-bg rounded-lg border border-brand-border/30">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">${dep.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <span className="text-xs bg-brand-surface px-2 py-0.5 rounded text-gray-400">{dep.method}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">User ID: {dep.userId}</p>
                      <p className="text-xs text-gray-500 font-mono">Ref: {dep.referenceId}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(dep.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-2">
                       <Button size="sm" variant="outline" className="border-green-500/50 text-green-500 hover:bg-green-500/10" onClick={() => approveDeposit(dep.id)}>
                         <CheckCircle className="w-4 h-4 mr-2" /> Approve
                       </Button>
                       <Button size="sm" variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10" onClick={() => rejectDeposit(dep.id)}>
                         <XCircle className="w-4 h-4 mr-2" /> Reject
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'withdrawals' && (
        <Card className="bg-brand-surface/30 border-brand-border/50">
          <CardHeader>
            <CardTitle>Pending Withdrawals</CardTitle>
            <p className="text-sm text-gray-400 mt-1">Review and approve or reject user withdrawal requests.</p>
          </CardHeader>
          <CardContent>
            {pendingWithdrawals.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No pending withdrawals.</p>
            ) : (
              <div className="space-y-4">
                {pendingWithdrawals.map(req => (
                  <div key={req.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-brand-bg rounded-lg border border-brand-border/30">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center space-x-2">
                         <span className="font-bold text-white">${req.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">User ID: {req.userId}</p>
                      <p className="text-xs text-gray-500 font-mono break-all max-w-[200px] md:max-w-md">Address: {req.address}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(req.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-2">
                       <Button size="sm" variant="outline" className="border-green-500/50 text-green-500 hover:bg-green-500/10" onClick={() => approveWithdrawal(req.id)}>
                         <CheckCircle className="w-4 h-4 mr-2" /> Approve
                       </Button>
                       <Button size="sm" variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10" onClick={() => rejectWithdrawal(req.id)}>
                         <XCircle className="w-4 h-4 mr-2" /> Reject
                       </Button>
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
