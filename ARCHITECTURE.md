# AVATAR AI - Database Schema & Architecture

## Firestore Collections

### `users`
- `id` (String): Unique user ID (Auth UID)
- `username` (String): Unique handle
- `email` (String)
- `mobile` (String)
- `role` (String): 'user' | 'admin' | 'superadmin'
- `referralCode` (String): Unique 6-8 char code
- `sponsorId` (String): Reference to another auth user (immutable)
- `rank` (String): Current rank title
- `createdAt` (Timestamp)

### `walletLedger`
- `userId` (String)
- `type` (String): 'deposit' | 'withdrawal' | 'reward' | 'commission' | 'stake_principal'
- `amount` (Number): Positive for credits, negative for debits
- `balanceAfter` (Number): Running balance snapshot
- `referenceId` (String): ID of the related entity (e.g., stakeId, depositId)
- `createdAt` (Timestamp)

### `deposits`
- `id` (String)
- `userId` (String)
- `amount` (Number)
- `method` (String): 'INR' | 'USDT'
- `network` (String)
- `txHash` (String)
- `status` (String): 'pending' | 'approved' | 'rejected'
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### `stakes`
- `id` (String)
- `userId` (String)
- `amount` (Number)
- `durationDays` (Number): 30 | 60 | 90 | 365
- `dailyRate` (Number)
- `status` (String): 'active' | 'completed' | 'pending'
- `startedAt` (Timestamp)
- `endsAt` (Timestamp)

### `rewardSchedules`
- `id` (String)
- `stakeId` (String)
- `userId` (String)
- `totalDays` (Number)
- `completedDays` (Number)
- `dailyAmount` (Number)
- `status` (String): 'active' | 'completed'

### `rewardAccruals`
- `id` (String)
- `userId` (String)
- `stakeId` (String)
- `amount` (Number)
- `accruedAt` (Timestamp)
- `status` (String): 'unclaimed' | 'claimed'

### `rewardClaims`
- `id` (String)
- `userId` (String)
- `amount` (Number)
- `status` (String): 'pending' | 'completed'
- `createdAt` (Timestamp)

### `commissionEvents`
- `id` (String)
- `sponsorId` (String)
- `downlineId` (String)
- `stakeId` (String)
- `level` (Number)
- `percentage` (Number)
- `amount` (Number)
- `createdAt` (Timestamp)

### `communityPool`
- `snapshotId` (String)
- `totalAmount` (Number)
- `activeParticipants` (Number)
- `periodStart` (Timestamp)
- `periodEnd` (Timestamp)
- `status` (String): 'accumulating' | 'distributed'

### `poolDistributions`
- `id` (String)
- `snapshotId` (String)
- `userId` (String)
- `amount` (Number)
- `rank` (String)
- `createdAt` (Timestamp)

### `treasury` (Singleton Document)
- `bankAssets` (Number)
- `cryptoAssets` (Number)
- `totalLiabilities` (Number)
- `reserveFund` (Number)
- `lastAudited` (Timestamp)

### `auditLogs`
- `id` (String)
- `actorId` (String)
- `action` (String)
- `entityId` (String)
- `collection` (String)
- `previousData` (Map)
- `newData` (Map)
- `timestamp` (Timestamp)

## Cloud Functions Architecture

1. `onDepositApproved`: Background trigger. Updates `walletLedger` and credits user's `depositCredits`.
2. `createStake`: Callable. Validates user balance, creates `stakes` document, debits `depositCredits`, creates `rewardSchedules`, and triggers upline `commissionEvents`. Also computes 2% `communityPool` contribution.
3. `dailyRewardCron`: PubSub schedule (Runs nightly). Queries active `rewardSchedules`, generates `rewardAccruals`, updates `totalRewards` on `walletLedger`.
4. `processWithdrawal`: Callable. Validates `availableBalance` >= requested amount, creates `withdrawals` doc, debits ledger. Background worker waits for admin approval to finalize.
5. `calculateRanks`: Background trigger on downline stake creations or direct referral changes. Upgrades user's `rank` if volume and direct counts meet `Qualification Engine` requirements.
6. `distributeCommunityPool`: PubSub schedule (Monthly/Weekly). Locks current `communityPool` snapshot, queries qualified users by `rank`, divides pool amount proportionally, creates `poolDistributions` and credits ledger.
7. `auditLogger`: Middleware function. Hooks into all document writes on sensitive collections (walletLedger, stakes, deposits, withdrawals) to maintain immutable `auditLogs` with actor attribution.
