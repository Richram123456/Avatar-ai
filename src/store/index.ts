import { create } from 'zustand';
import { User, Wallet, Stake, Deposit, Withdrawal, Treasury } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: '1',
    username: 'avatar_pioneer',
    email: 'pioneer@avatar.ai',
    role: 'superadmin',
    referralCode: 'AVATAR_MASTER',
    sponsorId: null,
    rank: 'Member',
    createdAt: Date.now()
  },
  isAuthenticated: true,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

interface PlatformState {
  wallet: Wallet;
  stakes: Stake[];
  deposits: Deposit[];
  withdrawals: Withdrawal[];
  treasury: Treasury;
  addStake: (stake: Stake) => void;
  updateWallet: (updates: Partial<Wallet>) => void;
  claimRewards: () => void;
  requestWithdrawal: (amount: number, address: string) => boolean;
  requestDeposit: (amount: number, referenceId: string) => void;
  approveDeposit: (id: string) => void;
  rejectDeposit: (id: string) => void;
  approveWithdrawal: (id: string) => void;
  rejectWithdrawal: (id: string) => void;
  triggerTreasuryAudit: () => void;
}

export const usePlatformStore = create<PlatformState>((set) => ({
  wallet: {
    availableBalance: 100000.00,
    depositCredits: 100000.00,
    claimedRewards: 0,
    stakedPrincipal: 0,
    totalRewards: 0,
    availableToClaim: 0,
  },
  stakes: [],
  deposits: [],
  withdrawals: [],
  treasury: {
    bankAssets: 0,
    cryptoAssets: 100000.00,
    totalLiabilities: 0,
    reserveFund: 0,
  },
  addStake: (stake) => set((state) => ({ stakes: [...state.stakes, stake] })),
  updateWallet: (updates) => set((state) => ({ wallet: { ...state.wallet, ...updates } })),
  claimRewards: () => set((state) => {
    if (state.wallet.availableToClaim <= 0) return state;
    return {
      wallet: {
        ...state.wallet,
        availableBalance: state.wallet.availableBalance + state.wallet.availableToClaim,
        claimedRewards: state.wallet.claimedRewards + state.wallet.availableToClaim,
        availableToClaim: 0,
      }
    };
  }),
  requestDeposit: (amount, referenceId) => set((state) => ({
    deposits: [
      {
        id: `dep_${Date.now()}`,
        userId: '1',
        amount,
        method: 'USDT',
        status: 'pending',
        referenceId,
        createdAt: Date.now(),
      },
      ...state.deposits
    ]
  })),
  requestWithdrawal: (amount, address) => {
    let success = false;
    set((state) => {
      if (amount > state.wallet.availableBalance || amount <= 0) return state;
      success = true;
      return {
        wallet: {
          ...state.wallet,
          availableBalance: state.wallet.availableBalance - amount
        },
        withdrawals: [
          {
            id: `with_${Date.now()}`,
            userId: '1',
            amount,
            address,
            status: 'pending',
            createdAt: Date.now(),
          },
          ...state.withdrawals
        ]
      };
    });
    return success;
  },
  approveDeposit: (id) => set((state) => {
    const dep = state.deposits.find(d => d.id === id);
    if (!dep || dep.status !== 'pending') return state;

    return {
      deposits: state.deposits.map(d => d.id === id ? { ...d, status: 'approved' } : d),
      wallet: dep.userId === '1' ? {
        ...state.wallet,
        depositCredits: state.wallet.depositCredits + dep.amount
      } : state.wallet
    };
  }),
  rejectDeposit: (id) => set((state) => ({
    deposits: state.deposits.map(d => d.id === id ? { ...d, status: 'rejected' } : d)
  })),
  approveWithdrawal: (id) => set((state) => ({
    withdrawals: state.withdrawals.map(w => w.id === id ? { ...w, status: 'approved' } : w)
  })),
  rejectWithdrawal: (id) => set((state) => {
    const withReq = state.withdrawals.find(w => w.id === id);
    if (!withReq || withReq.status !== 'pending') return state;

    return {
      withdrawals: state.withdrawals.map(w => w.id === id ? { ...w, status: 'rejected' } : w),
      wallet: withReq.userId === '1' ? {
        ...state.wallet,
        availableBalance: state.wallet.availableBalance + withReq.amount
      } : state.wallet
    };
  }),
  triggerTreasuryAudit: () => set((state) => ({
    treasury: {
      ...state.treasury,
      cryptoAssets: state.treasury.cryptoAssets + 5000,
    }
  }))
}));
