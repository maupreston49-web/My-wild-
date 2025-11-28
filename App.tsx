
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Training from './components/Training';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';
import Community from './components/Community';
import { Page } from './types';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>(Page.HOME);

  return (
    <div className="min-h-screen bg-wild-900 text-wild-light font-sans">
      <main className="pb-24 md:pb-20">
        {page === Page.HOME && <Hero setPage={setPage} />}
        {page === Page.RHYTHM && <Training />}
        {page === Page.PACK && <Chat />}
        {page === Page.DASHBOARD && <Dashboard />}
        {page === Page.COMMUNITY && <Community />}
      </main>
      <Navigation activePage={page} setPage={setPage} />
    </div>
  );
};

export default App;
