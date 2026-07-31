import React, { useState } from 'react';
import { Users, UserPlus, Trash2, IndianRupee, HeartHandshake } from 'lucide-react';

export default function BhudevList({ bhudevs, onAddBhudev, onDeleteBhudev }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    onAddBhudev({
      id: 'b-' + Date.now(),
      name,
      amount: Number(amount)
    });
    setName('');
    setAmount('');
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
              Auto +1 count calculation
            </span>
          </div>
        </div>

        <div className="bhudev-count-pill">
          Bhudev: {bhudevs.length}
        </div>
      </div>

      {/* Add Bhudev Form */}
      <div style={{ background: 'var(--royal-blue-light)', padding: '14px', borderRadius: '12px', marginBottom: '14px', border: '1px solid var(--royal-blue-border)' }}>
        <div className="form-row">
          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label" style={{ color: 'var(--royal-blue)' }}>Pandit / Bhudev Name (Noun)</label>
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
            <label className="form-label" style={{ color: 'var(--royal-blue)' }}>Dakshina Amount (₹)</label>
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
              <span>Pandit Name</span>
              <span>Dakshina Paid</span>
            </div>
            {bhudevs.map((b) => (
              <div key={b.id} className="expense-row" style={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} color="#a78bfa" />
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>{b.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#a78bfa' }}>
                    ₹{Number(b.amount).toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteBhudev(b.id)}
                    style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(139, 92, 246, 0.15)', borderRadius: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#c4b5fd' }}>Total Bhudev Dakshina ({bhudevs.length}):</span>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#c4b5fd' }}>₹{totalBhudevDakshina.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
