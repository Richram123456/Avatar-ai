export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  referralCode: string;
  sponsorId: string | null;
  rank: 'Member' | 'Leader' | 'Pro Leader' | 'Manager' | 'Director' | 'Senior Director' | 'Executive Director';
  createdAt: number;
}

export interface Wallet {
  availableBalance: number;
  depositCredits: number;
  claimedRewards: number;
  stakedPrincipal: number;
  totalRewards: number;
  availableToClaim: number;
}

export interface Stake {
  id: string;
  userId: string;
  amount: number;
  durationDays: number;
  dailyRate: number;
  status: 'active' | 'completed' | 'pending';
  startedAt: number;
  endsAt: number;
}

export interface Deposit {
  id: string;
  userId: string;
  amount: number;
  method: 'INR' | 'USDT';
  status: 'pending' | 'approved' | 'rejected';
  referenceId: string;
  createdAt: number;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
}

export interface Treasury {
  bankAssets: number;
  cryptoAssets: number;
  totalLiabilities: number;
  reserveFund: number;
}
