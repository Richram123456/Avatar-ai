import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  Users, 
  Trophy, 
  ShieldAlert,
  LogOut,
  Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
    { name: 'Stake', href: '/stake', icon: TrendingUp },
    { name: 'Network', href: '/network', icon: Users },
    { name: 'Ranks', href: '/ranks', icon: Trophy },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  if (user?.role === 'admin' || user?.role === 'superadmin') {
    navItems.push({ name: 'Admin', href: '/admin', icon: ShieldAlert });
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-brand-border bg-brand-bg/95 md:bg-brand-bg/50 backdrop-blur-xl">
      <div className="hidden md:flex h-16 items-center px-6">
        <Link to="/dashboard" className="text-xl font-bold tracking-widest text-white flex items-center space-x-2 transition-opacity hover:opacity-80">
          <div className="w-6 h-6 rounded-sm bg-brand-accent flex items-center justify-center">
            <span className="text-black text-xs font-bold">A</span>
          </div>
          <span>AVATAR<span className="text-brand-accent">AI</span></span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-brand-surface text-brand-accent border border-brand-border" 
                    : "text-gray-400 hover:bg-brand-surface/50 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-brand-accent" : "text-gray-400")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="border-t border-brand-border p-4">
        <div className="flex items-center space-x-3 rounded-lg px-3 py-3 border border-brand-border bg-brand-surface">
          <Link to="/settings" onClick={onClose} className="flex flex-1 items-center space-x-3 overflow-hidden group cursor-pointer">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-surface-light text-brand-accent font-bold group-hover:bg-brand-accent/20 transition-colors">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-white group-hover:text-brand-accent transition-colors">{user?.username}</p>
              <p className="truncate text-xs text-brand-accent">{user?.rank}</p>
            </div>
          </Link>
          <button onClick={logout} className="text-gray-400 hover:text-white transition-colors" title="Log out">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
