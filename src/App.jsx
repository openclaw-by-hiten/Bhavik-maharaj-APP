import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PujaCard from './components/PujaCard';
import PujaForm from './components/PujaForm';
import SummaryPieChart from './components/SummaryPieChart';
import ClientDirectory from './components/ClientDirectory';
import BhudevDirectory from './components/BhudevDirectory';
import PujaCalendar from './components/PujaCalendar';
import ExportModal from './components/ExportModal';
import { getAllPujas, savePuja, deletePuja, requestPersistentStorage } from './services/storageService';
import { Search, Plus, Calendar, HardDrive, List, Users, UserCheck } from 'lucide-react';

export default function App() {
  const [pujas, setPujas] = useState([]);
  const [activeTab, setActiveTab] = useState('pujas'); // 'pujas', 'clients', 'add-puja', 'calendar'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bhavik_maharaj_theme') || 'light';
  });
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedPuja, setSelectedPuja] = useState(null);
  const [editingPuja, setEditingPuja] = useState(null);
  const [showBackupModal, setShowBackupModal] = useState(false);

  useEffect(() => {
    // Shield data from aggressive browser storage clearers
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
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('bhavik_maharaj_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleSavePuja = async (pujaData) => {
    await savePuja(pujaData);
    await loadData();
    setEditingPuja(null);
    setActiveTab('pujas');
  };

  const handleDeletePuja = async (id) => {
    await deletePuja(id);
    await loadData();
  };

  const handleToggleBhudevPaidForPuja = async (pujaId, bhudevIdOrName) => {
    const targetPuja = pujas.find(p => p.id === pujaId);
    if (!targetPuja) return;

    const updatedBhudevs = (targetPuja.bhudevs || []).map(b => {
      if (b.id === bhudevIdOrName || b.name === bhudevIdOrName) {
        return { ...b, isPaid: !b.isPaid };
      }
      return b;
    });

    const updatedPuja = { ...targetPuja, bhudevs: updatedBhudevs };
    await savePuja(updatedPuja);
    await loadData();
  };

  // Get distinct Yajman names and full data for autocomplete
  const existingClientNames = Array.from(
    new Set(pujas.map((p) => p.clientName).filter(Boolean))
  );

  const existingClientsData = Object.values(
    pujas.reduce((acc, p) => {
      if (p.clientName && !acc[p.clientName]) {
        acc[p.clientName] = {
          name: p.clientName,
          phone: p.clientPhone || '',
          referredBy: p.referredBy || 'Added by Me (Direct)'
        };
      }
      return acc;
    }, {})
  ).filter(c => Boolean(c.name));

  // Get distinct Bhudev names for quick selection
  const existingBhudevNames = Array.from(
    new Set(pujas.flatMap(p => (p.bhudevs || []).map(b => (b.name || '').trim())).filter(Boolean))
  );

  // Filtered pujas for search on home page
  const filteredPujas = pujas.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.clientName.toLowerCase().includes(query) ||
      p.pujaName.toLowerCase().includes(query) ||
      p.date.includes(query) ||
      (p.referredBy && p.referredBy.toLowerCase().includes(query))
    );
  });

  return (
    <div className="app-container">
      {/* Header & Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenBackup={() => setShowBackupModal(true)}
      />

      {/* Pujas List & Dashboard View */}
      {activeTab === 'pujas' && (
        <main className="animate-fade-in">
          {/* Controls Bar: Search & Book Button */}
          <div className="controls-container">
            <div className="search-box-wrapper">
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 2 }} />
              <input
                type="text"
                className="search-input-field"
                placeholder="Search Yajman, Puja title, date, or referrer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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

          {/* Render Cards Grid */}
          {filteredPujas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-box">
                <Search size={36} color="var(--primary-orange)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px' }}>No Puja Records Found</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                {searchQuery ? 'Try adjusting your search criteria.' : 'Create your first Puja record to start tracking!'}
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

      {/* Clients Directory View (With embedded Referral Rankings) */}
      {activeTab === 'clients' && (
        <ClientDirectory
          pujas={pujas}
          onEditPuja={(p) => {
            setEditingPuja(p);
            setActiveTab('add-puja');
          }}
        />
      )}

      {/* Bhudev (Pandit) Directory View */}
      {activeTab === 'bhudevs' && (
        <BhudevDirectory
          pujas={pujas}
          onSelectPuja={(p) => setSelectedPuja(p)}
          onToggleBhudevPaidForPuja={handleToggleBhudevPaidForPuja}
        />
      )}

      {/* Create / Edit Puja View */}
      {activeTab === 'add-puja' && (
        <PujaForm
          initialData={editingPuja}
          existingClients={existingClientNames}
          existingClientsData={existingClientsData}
          existingBhudevs={existingBhudevNames}
          onSave={handleSavePuja}
          onClose={() => setActiveTab('pujas')}
        />
      )}

      {/* Interactive Puja Calendar View */}
      {activeTab === 'calendar' && (
        <PujaCalendar
          pujas={pujas}
          onSelectPuja={(p) => setSelectedPuja(p)}
          onBookPujaOnDate={(targetDateIso) => {
            setEditingPuja({ date: targetDateIso });
            setActiveTab('add-puja');
          }}
        />
      )}

      {/* Selected Puja Detail & Summary Modal */}
      {selectedPuja && (
        <div className="modal-overlay" onClick={() => setSelectedPuja(null)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--primary-orange)' }}>
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
          <span>Yajmans</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'bhudevs' ? 'active' : ''}`}
          onClick={() => setActiveTab('bhudevs')}
        >
          <UserCheck size={20} />
          <span>Bhudevs</span>
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
          className={`mobile-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar size={20} />
          <span>Calendar</span>
        </button>
      </nav>
    </div>
  );
}
