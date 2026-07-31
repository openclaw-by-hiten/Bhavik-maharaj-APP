import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PujaCard from './components/PujaCard';
import PujaForm from './components/PujaForm';
import SummaryPieChart from './components/SummaryPieChart';
import ReferralLeaderboard from './components/ReferralLeaderboard';
import ClientDirectory from './components/ClientDirectory';
import ExportModal from './components/ExportModal';
import { getAllPujas, savePuja, deletePuja, requestPersistentStorage } from './services/storageService';
import { Search, Plus, Filter, Flame, Users, Calendar, Sparkles, HardDrive, List, UserCheck } from 'lucide-react';

export default function App() {
  const [pujas, setPujas] = useState([]);
  const [activeTab, setActiveTab] = useState('pujas'); // 'pujas', 'clients', 'add-puja', 'referrals'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bhavik_maharaj_theme') || 'light';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'prepaid', 'direct'

  const [selectedPuja, setSelectedPuja] = useState(null);
  const [editingPuja, setEditingPuja] = useState(null);
  const [showBackupModal, setShowBackupModal] = useState(false);

  useEffect(() => {
    // Request persistent storage on mount to shield data from app cleaners
    requestPersistentStorage();
    loadData();

    // Set saved theme attribute on html element
    const savedTheme = localStorage.getItem('bhavik_maharaj_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const loadData = async () => {
    const data = await getAllPujas();
    setPujas(data);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('bhavik_maharaj_theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const handleSavePuja = async (pujaData) => {
    await savePuja(pujaData);
    await loadData();
    setEditingPuja(null);
    setSelectedPuja(null);
    setActiveTab('pujas');
  };

  const handleDeletePuja = async (id) => {
    await deletePuja(id);
    if (selectedPuja?.id === id) setSelectedPuja(null);
    await loadData();
  };

  // Unique registered client names & full details for selection dropdown
  const existingClientNames = Array.from(new Set(pujas.map(p => p.clientName).filter(Boolean)));
  const existingClientsData = Array.from(
    new Map(pujas.map(p => [p.clientName, { name: p.clientName, phone: p.clientPhone, referredBy: p.referredBy }])).values()
  ).filter(c => Boolean(c.name));

  // Filtered pujas
  const filteredPujas = pujas.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      p.clientName.toLowerCase().includes(query) ||
      p.pujaName.toLowerCase().includes(query) ||
      p.date.includes(query) ||
      (p.referredBy && p.referredBy.toLowerCase().includes(query));

    if (filterType === 'prepaid') return matchesSearch && p.isPrepaid;
    if (filterType === 'direct') return matchesSearch && !p.isPrepaid;
    return matchesSearch;
  });

  return (
    <div className="app-container">
      {/* Header & Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'add-puja') setEditingPuja(null);
          setActiveTab(tab);
        }}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenBackup={() => setShowBackupModal(true)}
      />

      {/* Pujas List & Dashboard View */}
      {activeTab === 'pujas' && (
        <main className="animate-fade-in">
          {/* Controls Bar: Search & Filter */}
          <div className="controls-container">
            <div style={{ display: 'flex', gap: '10px', flex: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="search-box-wrapper">
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 2 }} />
                <input
                  type="text"
                  className="search-input-field"
                  placeholder="Search client, Puja title, date, or referrer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="filter-select-field"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Pujas</option>
                <option value="prepaid">Prepaid Advance</option>
                <option value="direct">Direct Expenses</option>
              </select>
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                setEditingPuja(null);
                setActiveTab('add-puja');
              }}
              style={{ whiteSpace: 'nowrap', justifyContent: 'center', flexShrink: 0 }}
            >
              <Plus size={18} />
              <span>Book New Puja</span>
            </button>
          </div>

          {/* Cards Grid */}
          {filteredPujas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <Flame size={48} color="var(--primary-saffron)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px' }}>No Puja Records Found</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                {searchQuery ? 'Try clearing your search query' : 'Click below to create your first client Puja booking!'}
              </p>
              <button
                className="btn-primary"
                onClick={() => {
                  setEditingPuja(null);
                  setActiveTab('add-puja');
                }}
              >
                <Plus size={18} />
                <span>Add First Puja</span>
              </button>
            </div>
          ) : (
            <div className="cards-grid">
              {filteredPujas.map((puja) => (
                <PujaCard
                  key={puja.id}
                  puja={puja}
                  onSelect={(p) => setSelectedPuja(p)}
                  onDelete={handleDeletePuja}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {/* Clients Directory View */}
      {activeTab === 'clients' && (
        <ClientDirectory pujas={pujas} />
      )}

      {/* Create / Edit Puja View */}
      {activeTab === 'add-puja' && (
        <PujaForm
          initialData={editingPuja}
          existingClients={existingClientNames}
          existingClientsData={existingClientsData}
          onSave={handleSavePuja}
          onClose={() => setActiveTab('pujas')}
        />
      )}

      {/* Referral Analytics View */}
      {activeTab === 'referrals' && (
        <ReferralLeaderboard pujas={pujas} />
      )}

      {/* Selected Puja Detail & Summary Modal */}
      {selectedPuja && (
        <div className="modal-overlay" onClick={() => setSelectedPuja(null)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--primary-gold)' }}>
                  {selectedPuja.clientName}
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>
                  {selectedPuja.pujaName} • {selectedPuja.date}
                </p>
              </div>
              <button className="icon-circle-btn" onClick={() => setSelectedPuja(null)}>
                &times;
              </button>
            </div>

            {/* Render Summary & Pie Chart */}
            <SummaryPieChart puja={selectedPuja} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  setEditingPuja(selectedPuja);
                  setSelectedPuja(null);
                  setActiveTab('add-puja');
                }}
              >
                Edit Puja / Add Expenses
              </button>
              <button className="btn-primary" onClick={() => setSelectedPuja(null)}>
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup & Import Modal */}
      {showBackupModal && (
        <ExportModal
          pujas={pujas}
          onDataReload={loadData}
          onClose={() => setShowBackupModal(false)}
        />
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-nav-bar">
        <button
          className={`mobile-nav-item ${activeTab === 'pujas' ? 'active' : ''}`}
          onClick={() => setActiveTab('pujas')}
        >
          <List size={20} />
          <span>Pujas</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          <Users size={20} />
          <span>Clients</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'add-puja' ? 'active' : ''}`}
          onClick={() => {
            setEditingPuja(null);
            setActiveTab('add-puja');
          }}
        >
          <Plus size={20} />
          <span>New Puja</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'referrals' ? 'active' : ''}`}
          onClick={() => setActiveTab('referrals')}
        >
          <UserCheck size={20} />
          <span>Referrals</span>
        </button>

        <button
          className="mobile-nav-item"
          onClick={() => setShowBackupModal(true)}
        >
          <HardDrive size={20} />
          <span>Backup</span>
        </button>
      </nav>
    </div>
  );
}
