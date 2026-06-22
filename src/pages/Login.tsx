import { useState } from 'react';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function Login() {
  const [username, setUsername] = useState('avatar_pioneer');
  const [password, setPassword] = useState('password');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: '1',
      username,
      email: `${username}@avatar.ai`,
      role: 'admin',
      referralCode: 'AVATAR_001',
      sponsorId: null,
      rank: 'Director',
      createdAt: Date.now()
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Card className="w-full max-w-md z-10 mx-4 border-brand-border/50">
        <CardHeader className="text-center pb-8">
          <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-accent/10 border border-brand-accent/20 mx-auto">
            <span className="text-xl font-bold tracking-widest text-brand-accent flex items-center">A</span>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-white mb-2">Welcome Back</CardTitle>
          <p className="text-sm text-gray-400">Enter your credentials to access the ecosystem</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Username</label>
              <Input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="bg-brand-bg/50 border-brand-border/50 focus:border-brand-accent transition-colors"
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-brand-accent hover:text-brand-accent-hover transition-colors">Forgot?</a>
              </div>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-brand-bg/50 border-brand-border/50 focus:border-brand-accent transition-colors"
                placeholder="Enter password"
              />
            </div>
            <Button variant="gold" className="w-full mt-6" type="submit">
              Sign In
            </Button>
            <p className="text-center text-sm text-gray-400 pt-4 border-t border-brand-border/50 mt-6">
              New to Avatar AI? <a href="#" className="text-white hover:text-brand-accent transition-colors">Create an account</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
