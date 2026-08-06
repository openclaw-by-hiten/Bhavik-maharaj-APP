import React from 'react';
import { Flame, List, PlusCircle, Users, UserCheck, HardDrive, Sun, Moon, ShieldCheck, Calendar as CalendarIcon } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme, onOpenBackup }) {
  return (
    <header className="app-header">
      <div className="brand-container" onClick={() => setActiveTab('pujas')} style={{ cursor: 'pointer' }}>
        <img
          src="/bhavik-logo.png"
          alt="Bhavik Maharaj Sacred Logo"
          className="brand-logo-img"
        />
        <div>
          <h1 className="brand-title">Bhavik Maharaj</h1>
          <p className="brand-subtitle">Puja Expense & Bhudev Tracker</p>
        </div>
      </div>

      {/* Desktop Tabs */}
      <nav className="nav-tabs-desktop">
        <button
          className={`nav-btn ${activeTab === 'pujas' ? 'active' : ''}`}
          onClick={() => setActiveTab('pujas')}
        >
          <List size={18} />
          <span>All Pujas</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          <Users size={18} />
          <span>Yajman Directory</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'bhudevs' ? 'active' : ''}`}
          onClick={() => setActiveTab('bhudevs')}
        >
          <UserCheck size={18} />
          <span>Bhudev Directory</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'add-puja' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-puja')}
        >
          <PlusCircle size={18} />
          <span>New Puja</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <CalendarIcon size={18} />
          <span>Puja Calendar</span>
        </button>
      </nav>

      {/* Header Action Tools */}
      <div className="header-actions">
        <div className="offline-status-tag" title="Data stored safely in browser persistent IndexedDB">
          <ShieldCheck size={16} />
          <span className="offline-tag-text">Offline Protected</span>
        </div>

        <button
          className="icon-circle-btn"
          onClick={onOpenBackup}
          title="Backup & Restore Data"
        >
          <HardDrive size={18} />
        </button>

        <button
          className="icon-circle-btn"
          onClick={toggleTheme}
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#ea580c" />}
        </button>
      </div>
    </header>
  );
}
