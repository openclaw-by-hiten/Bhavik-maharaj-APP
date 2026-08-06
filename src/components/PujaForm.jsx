import React, { useState } from 'react';
import { X, Save, Plus, Sparkles, UserCheck, Calendar, Wallet, Users, UserPlus } from 'lucide-react';
import ExpenseItem from './ExpenseItem';
import BhudevList from './BhudevList';
import SummaryPieChart from './SummaryPieChart';
import { formatDate } from '../utils/formatters';

const DEFAULT_PUJA_TAGS = [
  'Satyanarayan Vrat Katha',
  'Griha Pravesh & Vastu Shanti',
  'Maha Rudrabhishek',
  'Ganesh Pujan & Hawan',
  'Navgrah Shanti',
  'Vivah (Marriage) Rituals',
  'Lakshmi Pujan'
];

export default function PujaForm({ initialData, existingClients = [], existingClientsData = [], onSave, onClose }) {
  const [clientName, setClientName] = useState(initialData?.clientName || '');
  const [clientPhone, setClientPhone] = useState(initialData?.clientPhone || '');
  const [pujaName, setPujaName] = useState(initialData?.pujaName || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().slice(0, 10));
  const [referredBy, setReferredBy] = useState(initialData?.referredBy || 'Added by Me (Direct)');
  const [isPrepaid, setIsPrepaid] = useState(initialData?.isPrepaid || initialData?.prepaidAmount > 0 || false);
  const [prepaidAmount, setPrepaidAmount] = useState(initialData?.prepaidAmount || '');

  const [expenses, setExpenses] = useState(initialData?.expenses || []);
  const [bhudevs, setBhudevs] = useState(initialData?.bhudevs || []);

  const [activeSubTab, setActiveSubTab] = useState('details');
  const [selectedExistingClient, setSelectedExistingClient] = useState('');

  // Dynamic Puja Tags in LocalStorage
  const [pujaTags, setPujaTags] = useState(() => {
    const saved = localStorage.getItem('bhavik_maharaj_puja_tags');
    return saved ? JSON.parse(saved) : DEFAULT_PUJA_TAGS;
  });

  const handleAddExpense = (newExp) => {
    setExpenses([...expenses, newExp]);
  };

  const handleDeleteExpense = (expId) => {
    setExpenses(expenses.filter(e => e.id !== expId));
  };

  const handleAddBhudev = (newBhudev) => {
    setBhudevs([...bhudevs, newBhudev]);
  };

  const handleDeleteBhudev = (bId) => {
    setBhudevs(bhudevs.filter(b => b.id !== bId));
  };

  const handleSelectExistingClient = (name) => {
    setSelectedExistingClient(name);
    if (!name) return;
    setClientName(name);

    // Auto-fill phone and referredBy if available in database
    const found = existingClientsData.find(c => c.name === name);
    if (found) {
      if (found.phone) setClientPhone(found.phone);
      if (found.referredBy) setReferredBy(found.referredBy);
    }
  };

  const handleAddNewTag = (tagName) => {
    const trimmed = tagName.trim();
    if (!trimmed) return;
    if (!pujaTags.includes(trimmed)) {
      const updated = [...pujaTags, trimmed];
      setPujaTags(updated);
      localStorage.setItem('bhavik_maharaj_puja_tags', JSON.stringify(updated));
    }
  };

  const handleDeleteTag = (e, tagToDelete) => {
    e.stopPropagation(); // Prevent selecting the tag when deleting
    const updated = pujaTags.filter(t => t !== tagToDelete);
    setPujaTags(updated);
    localStorage.setItem('bhavik_maharaj_puja_tags', JSON.stringify(updated));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !pujaName || !date) {
      alert('Please fill in Yajman Name, Puja Name, and Date.');
      return;
    }

    // Also auto-add new custom pujaName into tag list if not already present
    handleAddNewTag(pujaName);

    const payload = {
      id: initialData?.id || 'puja-' + Date.now(),
      clientName,
      clientPhone,
      pujaName,
      date,
      referredBy,
      isPrepaid,
      prepaidAmount: isPrepaid ? Number(prepaidAmount || 0) : 0,
      expenses,
      bhudevs,
      createdAt: initialData?.createdAt || new Date().toISOString()
    };

    onSave(payload);
  };

  // Filter unique Yajman names for 'Referred By' dropdown
  const referrerOptions = Array.from(new Set(existingClients.filter(c => c !== clientName)));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-orange)' }}>
              {initialData ? 'Edit Puja Record' : 'Create New Puja Booking'}
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Fill Yajman info, payment received, Kharch & Bhudev Dakshina
            </p>
          </div>
          <button className="icon-circle-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form Switcher Sub-tabs */}
        <div className="modal-subtabs-bar">
          <button
            type="button"
            className={`modal-subtab-btn ${activeSubTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('details')}
          >
            1. Yajman Details
          </button>
          <button
            type="button"
            className={`modal-subtab-btn ${activeSubTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('expenses')}
          >
            2. Kharch & Bhudevs ({expenses.length + bhudevs.length})
          </button>
          {initialData && (
            <button
              type="button"
              className={`modal-subtab-btn ${activeSubTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('summary')}
            >
              3. Financial Summary
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {activeSubTab === 'details' && (
            <div>
              {/* Existing Customer Dropdown Selector */}
              {existingClientsData.length > 0 && (
                <div className="form-group" style={{ background: '#fff7ed', padding: '10px 12px', borderRadius: '12px', border: '1px solid #ffedd5' }}>
                  <label className="form-label" style={{ color: 'var(--primary-orange)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={15} />
                    <span>Select Pre-registered Yajman (Optional)</span>
                  </label>
                  <select
                    className="form-select"
                    value={existingClientsData.some(c => c.name === clientName) ? clientName : ''}
                    onChange={(e) => handleSelectExistingClient(e.target.value)}
                    style={{ borderColor: 'var(--primary-orange)' }}
                  >
                    <option value="">-- Choose Existing Yajman (or Type New Name Below) --</option>
                    {existingClientsData.map((c) => (
                      <option key={c.name} value={c.name}>
                        👤 {c.name} {c.phone ? `(${c.phone})` : ''}
                      </option>
                    ))}
                  </select>

                  {/* Quick Pills for existing Yajmans */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', alignSelf: 'center' }}>Quick Select:</span>
                    {existingClientsData.map((c) => (
                      <button
                        type="button"
                        key={c.name}
                        onClick={() => handleSelectExistingClient(c.name)}
                        style={{
                          background: clientName === c.name ? 'var(--primary-orange)' : '#ffffff',
                          color: clientName === c.name ? '#ffffff' : 'var(--text-main)',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.73rem',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Yajman Info Inputs */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Yajman Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Type Yajman name or select above..."
                    value={clientName}
                    onChange={(e) => {
                      setClientName(e.target.value);
                      setSelectedExistingClient('');
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Yajman Phone / Contact (Optional)</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="e.g. 9876543210"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Referred By Field */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={15} color="var(--royal-blue)" />
                  <span>Referred By (Reference Person)</span>
                </label>
                <select
                  className="form-select"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                >
                  <option value="Added by Me (Direct)">Added by Me (Direct / No Referrer)</option>
                  {referrerOptions.map((name) => (
                    <option key={name} value={name}>
                      👤 Referred by: {name}
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '3px' }}>
                  Choose a pre-registered Yajman if this person was referred by them.
                </span>
              </div>

              {/* Puja Name & Dynamic Tags Manager */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Puja Name / Type *</label>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Press Enter to add custom tag below
                  </span>
                </div>

                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Shri Satyanarayan Vrat Katha (Press Enter to add tag)"
                  value={pujaName}
                  onChange={(e) => setPujaName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewTag(pujaName);
                    }
                  }}
                  required
                />

                {/* Dynamic Tags List with Delete (x) Button */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {pujaTags.map((p) => {
                    const isSelected = pujaName === p;
                    return (
                      <div
                        key={p}
                        onClick={() => setPujaName(p)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: isSelected ? 'var(--royal-blue)' : 'var(--bg-card-hover)',
                          border: isSelected ? '1.5px solid var(--royal-blue)' : '1px solid var(--border-color)',
                          color: isSelected ? '#ffffff' : 'var(--text-main)',
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          fontWeight: isSelected ? '700' : '500',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>+ {p}</span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteTag(e, p)}
                          title={`Delete ${p} tag`}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: isSelected ? '#ffffff' : 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0 2px',
                            fontSize: '0.9rem',
                            lineHeight: '1',
                            fontWeight: '800'
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}

                  {/* Add typed name as new tag button */}
                  {pujaName.trim() && !pujaTags.includes(pujaName.trim()) && (
                    <button
                      type="button"
                      onClick={() => handleAddNewTag(pujaName)}
                      style={{
                        background: 'var(--bg-accent-light)',
                        border: '1px dashed var(--primary-orange)',
                        color: 'var(--primary-orange)',
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        fontWeight: '700'
                      }}
                    >
                      + Add "{pujaName.trim()}" Tag
                    </button>
                  )}
                </div>
              </div>

              {/* Date & Payment Received Toggle */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date Held (DD-MM-YYYY) *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary-orange)', fontWeight: '700', marginTop: '4px', display: 'block' }}>
                    📅 Date Format: {formatDate(date)}
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount Paid by Yajman Option</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '42px', background: 'var(--bg-card-hover)', padding: '0 12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <input
                      type="checkbox"
                      id="prepaid-toggle"
                      checked={isPrepaid}
                      onChange={(e) => setIsPrepaid(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary-orange)', cursor: 'pointer' }}
                    />
                    <label htmlFor="prepaid-toggle" style={{ fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}>
                      Add Amount Paid by Yajman?
                    </label>
                  </div>
                </div>
              </div>

              {/* Amount Paid by Yajman Input */}
              {isPrepaid && (
                <div className="form-group animate-fade-in">
                  <label className="form-label" style={{ color: 'var(--accent-emerald)' }}>Amount Paid by Yajman (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 12000"
                    value={prepaidAmount}
                    onChange={(e) => setPrepaidAmount(e.target.value)}
                    style={{ borderColor: 'var(--accent-emerald)' }}
                    required={isPrepaid}
                  />
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'expenses' && (
            <div>
              <ExpenseItem
                expenses={expenses}
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
              />
              <BhudevList
                bhudevs={bhudevs}
                onAddBhudev={handleAddBhudev}
                onDeleteBhudev={handleDeleteBhudev}
              />
            </div>
          )}

          {activeSubTab === 'summary' && initialData && (
            <SummaryPieChart puja={{ ...initialData, expenses, bhudevs, isPrepaid, prepaidAmount: Number(prepaidAmount || 0) }} />
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>{initialData ? 'Update Puja Record' : 'Save Puja Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
