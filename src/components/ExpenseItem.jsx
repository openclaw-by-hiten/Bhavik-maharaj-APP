import React, { useState } from 'react';
import { Fuel, Car, Flame, Flower2, Utensils, Users, Package, Plus, Trash2, Tag } from 'lucide-react';

export const CATEGORIES = [
  { name: 'Pooja Samagri', icon: Flame, color: '#f59e0b' },
  { name: 'Flowers', icon: Flower2, color: '#ec4899' },
  { name: 'Petrol', icon: Fuel, color: '#ef4444' },
  { name: 'Travel', icon: Car, color: '#3b82f6' },
  { name: 'Food', icon: Utensils, color: '#10b981' },
  { name: 'Bhudev Dakshina', icon: Users, color: '#8b5cf6' },
  { name: 'Misc', icon: Package, color: '#64748b' }
];

export function getCategoryIcon(catName) {
  const found = CATEGORIES.find(c => c.name === catName);
  const IconComp = found ? found.icon : Package;
  const color = found ? found.color : '#f59e0b';
  return <IconComp size={18} color={color} />;
}

export default function ExpenseItem({ expenses, onAddExpense, onDeleteExpense }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Pooja Samagri');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    onAddExpense({
      id: 'e-' + Date.now(),
      name,
      amount: Number(amount),
      category
    });
    setName('');
    setAmount('');
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px', color: 'var(--primary-gold)' }}>
        📦 Track Expenses & Samagri Items
      </h4>

      {/* Quick Add Form Box */}
      <div style={{ background: 'var(--bg-card-hover)', padding: '14px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
        <div className="form-row">
          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label">Item / Expense Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Hawan Samagri, Ghee, Travel Fuel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(e); } }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 1500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(e); } }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label className="form-label">Select Expense Category with Icon</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.name;
              return (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: isSelected ? `1.5px solid ${cat.color}` : '1px solid var(--border-color)',
                    background: isSelected ? `${cat.color}22` : 'var(--bg-card)',
                    color: isSelected ? cat.color : 'var(--text-muted)',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? '700' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={14} color={cat.color} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button type="button" onClick={handleSubmit} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
          <Plus size={16} />
          <span>Add Expense Item</span>
        </button>
      </div>

      {/* Expense List */}
      <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
        {expenses.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>
            No expenses added yet. Add your first item above!
          </p>
        ) : (
          expenses.map((item) => (
            <div key={item.id} className="expense-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="cat-icon-badge">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '600' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f59e0b' }}>
                  ₹{Number(item.amount).toLocaleString('en-IN')}
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteExpense(item.id)}
                  style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '4px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
