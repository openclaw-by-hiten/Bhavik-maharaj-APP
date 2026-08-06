import React, { useState } from 'react';
import { Users, UserPlus, Trash2, HeartHandshake, CheckSquare, Square } from 'lucide-react';

export default function BhudevList({ bhudevs, existingBhudevs = [], onAddBhudev, onDeleteBhudev, onToggleBhudevPaid }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    onAddBhudev({
      id: 'b-' + Date.now(),
      name: name.trim(),
      amount: Number(amount),
      isPaid: Boolean(isPaid)
    });
    setName('');
    setAmount('');
    setIsPaid(false);
  };

  const handleSelectQuickBhudev = (selectedName) => {
    setName(selectedName);
  };

  const totalBhudevDakshina = bhudevs.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Auto-Calculated Bhudev Header */}
      <div className="bhudev-counter-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <HeartHandshake size={18} color="var(--royal-blue)" style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--royal-blue)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Bhudev (Pandit) Manager
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
              Auto +1 count & payment status control
            </span>
          </div>
        </div>

        <div className="bhudev-count-pill">
          Bhudev: {bhudevs.length}
        </div>
      </div>

      {/* Add Bhudev Form */}
      <div style={{ background: 'var(--royal-blue-light)', padding: '14px', borderRadius: '12px', marginBottom: '14px', border: '1px solid var(--royal-blue-border)' }}>
        
        {/* Pre-registered Bhudevs Quick Selector */}
        {existingBhudevs.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--royal-blue)', fontWeight: '800', display: 'block', marginBottom: '4px' }}>
              Choose Pre-registered Bhudev:
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {existingBhudevs.map((bName) => (
                <button
                  type="button"
                  key={bName}
                  onClick={() => handleSelectQuickBhudev(bName)}
                  style={{
                    background: name === bName ? 'var(--royal-blue)' : '#ffffff',
                    color: name === bName ? '#ffffff' : 'var(--royal-blue)',
                    border: '1px solid var(--royal-blue)',
                    fontSize: '0.73rem',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '700'
                  }}
                >
                  👤 {bName}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-row">
          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label" style={{ color: 'var(--royal-blue)' }}>Pandit / Bhudev Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Pandit Ramesh Shastri"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(e); } }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label" style={{ color: 'var(--royal-blue)' }}>Dakshina Amount (₹) *</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 1100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(e); } }}
            />
          </div>
        </div>

        {/* Paid to Pandit Toggle Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0 12px 0', background: 'rgba(255,255,255,0.6)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <input
            type="checkbox"
            id="add-bhudev-paid-toggle"
            checked={isPaid}
            onChange={(e) => setIsPaid(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
          />
          <label htmlFor="add-bhudev-paid-toggle" style={{ fontSize: '0.82rem', fontWeight: '800', color: isPaid ? 'var(--accent-emerald)' : 'var(--text-main)', cursor: 'pointer' }}>
            Paid to Pandit already? (Mark as Settled)
          </label>
        </div>

        <button type="button" onClick={handleSubmit} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--royal-blue)', color: 'var(--royal-blue)', fontWeight: '700' }}>
          <UserPlus size={16} />
          <span>Add Pandit (+1 Bhudev)</span>
        </button>
      </div>

      {/* Bhudev Paid List */}
      <div>
        {bhudevs.length === 0 ? (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>
            No Bhudevs added yet. Enter name & amount above to add.
          </p>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
              <span>Pandit Name & Payment Status</span>
              <span>Dakshina</span>
            </div>
            {bhudevs.map((b) => (
              <div key={b.id} className="expense-row" style={{ borderColor: 'rgba(139, 92, 246, 0.2)', flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="var(--primary-orange)" />
                    <span style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-main)' }}>{b.name}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary-orange)' }}>
                      ₹{Number(b.amount).toLocaleString('en-IN')}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteBhudev(b.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      title="Delete Pandit"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Individual Checkbox Toggle for Payment Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px', borderTop: '1px dashed var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => onToggleBhudevPaid && onToggleBhudevPaid(b.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      color: b.isPaid ? 'var(--accent-emerald)' : '#ea580c'
                    }}
                  >
                    {b.isPaid ? (
                      <CheckSquare size={16} color="var(--accent-emerald)" />
                    ) : (
                      <Square size={16} color="#ea580c" />
                    )}
                    <span>{b.isPaid ? '🟢 Paid to Pandit (Settled)' : '🟠 Unpaid to Pandit'}</span>
                  </button>
                </div>

              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(139, 92, 246, 0.15)', borderRadius: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--royal-blue)' }}>Total Bhudev Dakshina ({bhudevs.length}):</span>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--royal-blue)' }}>₹{totalBhudevDakshina.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
