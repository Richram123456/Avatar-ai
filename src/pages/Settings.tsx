import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuthStore } from '../store';
import { User, Bell, Shield, LifeBuoy, LogOut, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Settings() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'support'>('profile');
  
  // Profile State
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSaveProfile = () => {
    // Normally this would update the store/backend
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security & Auth', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'support', label: 'Help & Support', icon: LifeBuoy },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-brand-surface text-brand-accent border border-brand-border/50' 
                  : 'text-gray-400 hover:text-white hover:bg-brand-surface/30'
              }`}
            >
              <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-brand-accent' : 'text-gray-500'}`} />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-brand-border/50">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {activeTab === 'profile' && (
                <Card className="bg-brand-surface/30 border-brand-border/50">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <p className="text-sm text-gray-400 mt-1">Update your public profile details and email address.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-20 w-20 rounded-full bg-brand-surface border-2 border-brand-border flex items-center justify-center text-2xl font-bold text-brand-accent">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <Button variant="outline" className="text-xs mr-2">Upload Avatar</Button>
                    <Button variant="ghost" className="text-xs text-red-400 hover:text-red-300">Remove</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Display Name</label>
                      <Input 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="bg-brand-bg/50 border-brand-border/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email Address</label>
                      <Input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="bg-brand-bg/50 border-brand-border/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Bio (Optional)</label>
                    <textarea 
                      className="w-full bg-brand-bg/50 border border-brand-border/30 rounded-md p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-accent min-h-[100px]"
                      placeholder="Tell us a bit about yourself..."
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-brand-border/30 mt-6">
                  {profileSaved ? (
                    <span className="text-green-500 text-sm flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Profile saved successfully
                    </span>
                  ) : <span></span>}
                  <Button variant="gold" onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="bg-brand-surface/30 border-brand-border/50">
              <CardHeader>
                <CardTitle>Security & Authentication</CardTitle>
                <p className="text-sm text-gray-400 mt-1">Manage your password and security preferences.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Current Password</label>
                    <Input type="password" placeholder="••••••••" className="bg-brand-bg/50 max-w-md" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">New Password</label>
                    <Input type="password" placeholder="Min. 8 characters" className="bg-brand-bg/50 max-w-md" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
                    <Input type="password" placeholder="Min. 8 characters" className="bg-brand-bg/50 max-w-md" />
                  </div>
                </div>
                <div className="pt-4 border-t border-brand-border/30">
                  <Button variant="outline">Update Password</Button>
                </div>

                <div className="pt-6 border-t border-brand-border/30 mt-6">
                   <h3 className="text-lg font-medium text-white mb-4">Two-Factor Authentication (2FA)</h3>
                   <div className="flex items-center justify-between p-4 rounded-xl border border-brand-border/30 bg-brand-bg/30">
                     <div>
                       <p className="font-medium text-white">Authenticator App</p>
                       <p className="text-sm text-gray-500">Not configured</p>
                     </div>
                     <Button variant="outline" className="border-brand-accent/50 text-brand-accent hover:bg-brand-accent/10">Enable 2FA</Button>
                   </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="bg-brand-surface/30 border-brand-border/50">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <p className="text-sm text-gray-400 mt-1">Control how you receive alerts and updates.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: 'Stake Rewards', desc: 'Receive alerts when staking rewards are distributed.' },
                  { title: 'Deposit & Withdrawals', desc: 'Alerts regarding your funding transactions.' },
                  { title: 'Network Activity', desc: 'When team members join or generate volume.' },
                  { title: 'System Updates', desc: 'Platform announcements and maintenance.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-brand-border/30 rounded-xl bg-brand-bg/20">
                    <div>
                      <p className="font-medium text-white text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'support' && (
            <Card className="bg-brand-surface/30 border-brand-border/50">
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
                <p className="text-sm text-gray-400 mt-1">Need assistance? Contact our premium support team.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-brand-border/30 rounded-xl bg-brand-bg/30 text-center space-y-2">
                    <LifeBuoy className="w-8 h-8 mx-auto text-brand-accent" />
                    <h3 className="font-medium text-white">Live Chat</h3>
                    <p className="text-xs text-gray-500">Available 24/7 for VIP members.</p>
                    <Button variant="outline" className="w-full mt-2">Start Chat</Button>
                  </div>
                  <div className="p-4 border border-brand-border/30 rounded-xl bg-brand-bg/30 text-center space-y-2">
                    <Shield className="w-8 h-8 mx-auto text-brand-accent" />
                    <h3 className="font-medium text-white">Email Support</h3>
                    <p className="text-xs text-gray-500">Average response time: 2 hours.</p>
                    <Button variant="outline" className="w-full mt-2">Open Ticket</Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-border/30">
                  <h3 className="text-lg font-medium text-white mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    {['How are staking rewards calculated?', 'What is the minimum withdrawal amount?', 'How do I upgrade my rank?'].map((q, i) => (
                      <div key={i} className="p-4 border border-brand-border/30 rounded-lg hover:bg-brand-surface transition-colors cursor-pointer">
                        <p className="text-sm font-medium text-gray-300">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
