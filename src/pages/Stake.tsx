import { useState } from 'react';
import { usePlatformStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Shield, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

const STAKING_PLANS = [
  { id: 'p_30', duration: 30, dailyYield: 0.5, name: 'Starter' },
  { id: 'p_60', duration: 60, dailyYield: 0.65, name: 'Standard' },
  { id: 'p_90', duration: 90, dailyYield: 0.8, name: 'Premium' },
  { id: 'p_365', duration: 365, dailyYield: 1.2, name: 'Elite' },
];

export function Stake() {
  const { wallet, stakes, addStake, updateWallet } = usePlatformStore();
  const [amount, setAmount] = useState('1000');
  const [selectedPlan, setSelectedPlan] = useState(STAKING_PLANS[0]);
  const [isConfirming, setIsConfirming] = useState(false);

  const numAmount = Number(amount) || 0;
  const targetYield = (numAmount * (selectedPlan.dailyYield / 100)) * selectedPlan.duration;

  const handleStake = () => {
    if (numAmount < 100 || numAmount > 10000) return;
    if (numAmount > wallet.depositCredits) return;

    const newStake = {
      id: `st_${Date.now()}`,
      userId: '1',
      amount: numAmount,
      durationDays: selectedPlan.duration,
      dailyRate: selectedPlan.dailyYield,
      status: 'active' as const,
      startedAt: Date.now(),
      endsAt: Date.now() + selectedPlan.duration * 24 * 60 * 60 * 1000,
    };

    addStake(newStake);
    updateWallet({
      depositCredits: wallet.depositCredits - numAmount,
      stakedPrincipal: wallet.stakedPrincipal + numAmount
    });
    
    alert(`Stake protocol executed successfully! $${numAmount.toLocaleString()} has been locked.`);
    setIsConfirming(false);
    setAmount('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Staking Engine</h1>
        <p className="text-gray-400">Lock principal to generate daily smart yields.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-brand-surface/30 border-brand-border/50">
            <CardHeader>
              <CardTitle>Create New Stake</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-300">Principal Amount</label>
                    <span className="text-xs text-brand-accent">Available Credits: ${wallet.depositCredits.toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input 
                      type="number" 
                      className="pl-8 bg-brand-bg/50 h-14 text-lg border-brand-border/50 focus-visible:ring-brand-accent"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Range: $100.00 - $10,000.00 USDT</p>
               </div>

               <div>
                 <label className="text-sm font-medium text-gray-300 mb-3 block">Select Duration</label>
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {STAKING_PLANS.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                          selectedPlan.id === plan.id 
                            ? 'bg-brand-accent/10 border-brand-accent ring-1 ring-brand-accent/50' 
                            : 'bg-brand-bg/50 border-brand-border hover:border-gray-500'
                        }`}
                      >
                        <span className={`text-sm font-semibold mb-1 ${selectedPlan.id === plan.id ? 'text-brand-accent' : 'text-gray-300'}`}>
                          {plan.name}
                        </span>
                        <span className="text-lg font-bold text-white">{plan.duration}</span>
                        <span className="text-xs text-gray-500 mt-1">Days</span>
                        <div className={`mt-3 px-2 py-1 rounded text-xs font-medium w-full text-center ${selectedPlan.id === plan.id ? 'bg-brand-accent text-black' : 'bg-brand-surface-light text-gray-400'}`}>
                          {plan.dailyYield}% Daily
                        </div>
                      </button>
                    ))}
                 </div>
               </div>

               <div className="bg-brand-bg p-4 rounded-xl border border-brand-border/30 flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-brand-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Smart Contract Execution</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      By confirming this stake, your principal will be cryptographically locked for the duration selected.
                      Early termination is structurally prohibited to protect the community pool.
                    </p>
                  </div>
               </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="gold" 
                className="w-full h-12 text-base"
                onClick={() => setIsConfirming(true)}
                disabled={numAmount < 100 || numAmount > 10000 || numAmount > wallet.depositCredits}
              >
                Initiate Stake Protocol
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="bg-brand-surface/50 border-brand-border/50 sticky top-8">
            <CardHeader className="border-b border-brand-border/50 pb-4">
              <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" /> Projection
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Principal</span>
                <span className="font-semibold text-white">${numAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Duration</span>
                <span className="font-semibold text-white">{selectedPlan.duration} Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Daily Return</span>
                <span className="font-semibold text-brand-accent">{selectedPlan.dailyYield}%</span>
              </div>
              
              <div className="border-t border-brand-border/50 my-4 pt-4 min-h-0" />
              
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-sm text-gray-400 block mb-1">Projected Total Reward</span>
                  <span className="text-xs text-gray-500">Not including principal</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">${targetYield.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <span className="block text-xs font-medium text-green-500 mt-1">+{((targetYield / numAmount) * 100).toFixed(1)}% ROI</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <Card className="w-full max-w-md border-brand-accent/50 animate-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <AlertTriangle className="h-5 w-5 text-brand-accent mr-2" />
                Confirm Stake Execution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-300">
                You are about to lock <strong>${numAmount.toLocaleString()}</strong> for <strong>{selectedPlan.duration} Days</strong>. 
                This action is deterministic and cannot be reversed.
              </p>
              
              <div className="bg-brand-bg/50 p-4 rounded-lg space-y-2 border border-brand-border/30">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Daily ROI:</span>
                  <span className="text-brand-accent font-medium">${(numAmount * (selectedPlan.dailyYield/100)).toFixed(2)}/day</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Pool Contribution (2%):</span>
                  <span className="text-white font-medium">${(numAmount * 0.02).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex space-x-3">
              <Button variant="outline" className="flex-1" onClick={() => setIsConfirming(false)}>Cancel</Button>
              <Button variant="gold" className="flex-1" onClick={handleStake}>Confirm & Execute</Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Active Contracts</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {stakes.map((stake) => (
            <Card key={stake.id} className="bg-brand-surface/30 border-brand-border/50">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs text-brand-accent font-semibold tracking-wider uppercase mb-1">Contract #{stake.id.split('_')[1]}</div>
                    <div className="text-xl font-bold text-white">${stake.amount.toLocaleString()}</div>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold">
                    ACTIVE
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-brand-border/30">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="text-sm font-medium text-white">{stake.durationDays} Days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Daily Rate</p>
                    <p className="text-sm font-medium text-brand-accent">{stake.dailyRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Ends</p>
                    <p className="text-sm font-medium text-white">{new Date(stake.endsAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {stakes.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-brand-border rounded-xl">
              No active stakes found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
