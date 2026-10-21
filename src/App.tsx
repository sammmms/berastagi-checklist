import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PersonalTab } from './components/PersonalTab';
import { GroupTab } from './components/GroupTab';
import { TripInfoTab } from './components/TripInfoTab';
import { UserModal } from './components/UserModal';
import { SupabaseModal } from './components/SupabaseModal';
import { getUserName, saveUserName, getSupabaseCredentials } from './lib/supabase';
import { clearCelebration } from './lib/confetti';

export function App() {
  const [userName, setUserName] = useState<string>(() => getUserName());
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'group' | 'info'>('group');

  const handleTabChange = (tab: 'personal' | 'group' | 'info') => {
    clearCelebration();
    setActiveTab(tab);
  };

  const [personalProgress, setPersonalProgress] = useState({ completed: 0, total: 0 });
  const [groupProgress, setGroupProgress] = useState({ completed: 0, total: 0 });

  // Check Supabase connection on load
  const checkSupabase = () => {
    const creds = getSupabaseCredentials();
    setIsSupabaseConnected(!!(creds.url && creds.anonKey));
  };

  useEffect(() => {
    checkSupabase();
    // If no user name set yet, open UserModal on initial load
    if (!userName) {
      setIsUserModalOpen(true);
    }
  }, []);

  const handleSaveUserName = (name: string) => {
    saveUserName(name);
    setUserName(name);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header with quick stats & tab buttons */}
      <Header
        userName={userName}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        isSupabaseConnected={isSupabaseConnected}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        personalProgress={personalProgress}
        groupProgress={groupProgress}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4">
        {activeTab === 'personal' && (
          <PersonalTab
            userName={userName}
            onUpdateProgress={(completed, total) =>
              setPersonalProgress({ completed, total })
            }
          />
        )}

        {activeTab === 'group' && (
          <GroupTab
            userName={userName}
            onRequireUserName={() => setIsUserModalOpen(true)}
            onUpdateProgress={(completed, total) =>
              setGroupProgress({ completed, total })
            }
            onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
            isSupabaseConnected={isSupabaseConnected}
          />
        )}

        {activeTab === 'info' && <TripInfoTab />}
      </main>

      {/* User Name Picker Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        currentName={userName}
        onSaveName={handleSaveUserName}
      />

      {/* Supabase Connection Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onCredentialsUpdated={checkSupabase}
      />
    </div>
  );
}

export default App;
