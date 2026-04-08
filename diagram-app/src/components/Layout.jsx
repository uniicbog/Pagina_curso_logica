import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import TopicHintsPanel from './TopicHintsPanel';

const Layout = ({ children, activeSection, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (sectionId) => {
    onNavigate(sectionId);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen font-sans transition-colors bg-secondary text-slate-200">
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          aria-label="Cerrar menú"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <main className="min-h-screen transition-all duration-300 md:ml-64">
        <header className="sticky top-0 z-10 px-4 py-3 border-b border-slate-800 flex items-center backdrop-blur bg-slate-950/80">
          <button
            type="button"
            className="md:hidden inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <Menu size={16} />
            Menú
          </button>
        </header>

        {children}
      </main>

      <TopicHintsPanel activeSection={activeSection} />
    </div>
  );
};

export default Layout;
