import { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../../store';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

export function DashboardLayout() {
  const { isAuthenticated } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-brand-bg text-white overflow-hidden flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex-none h-16 border-b border-brand-border bg-brand-bg/80 backdrop-blur-md z-40 flex items-center justify-between px-4 sticky top-0">
        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold tracking-widest text-white flex items-center space-x-2">
          <div className="w-6 h-6 rounded-sm bg-brand-accent flex items-center justify-center">
            <span className="text-black text-xs font-bold">A</span>
          </div>
          <span>AVATAR<span className="text-brand-accent">AI</span></span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm top-16"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:top-0 h-[calc(100vh-4rem)] md:h-screen top-16
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mx-auto max-w-7xl p-4 md:p-8"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

