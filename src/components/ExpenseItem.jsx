import React, { useState } from 'react';
import { Fuel, Car, Flame, Flower2, Utensils, Users, Package, Plus, Trash2, Tag, Mic } from 'lucide-react';

export const CATEGORIES = [
  { name: 'Pooja Samagri', icon: Flame, color: '#ea580c' },
  { name: 'Bhudev Dakshina', icon: Users, color: '#1e40af' },
  { name: 'Misc', icon: Package, color: '#ca8a04' },
  { name: 'Custom Item', icon: Mic, color: '#8b5cf6' }
];

export function getCategoryIcon(catName) {
  if (catName === 'Pooja Samagri') return <Flame size={18} color="#ea580c" />;
  if (catName === 'Bhudev Dakshina') return <Users size={18} color="#1e40af" />;
  if (catName === 'Custom Item' || catName === 'Voice / Custom') return <Mic size={18} color="#8b5cf6" />;
  if (catName === 'Flowers') return <Flower2 size={18} color="#ec4899" />;
  if (catName === 'Petrol') return <Fuel size={18} color="#ef4444" />;
  if (catName === 'Travel') return <Car size={18} color="#3b82f6" />;
  if (catName === 'Food') return <Utensils size={18} color="#10b981" />;
  return <Package size={18} color="#ca8a04" />;
}

export default function ExpenseItem({ expenses, onAddExpense, onDeleteExpense }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    // Auto-default item name to selected category or 'Misc' if both input and category are empty
    const finalCategory = category || 'Misc';
    const finalName = name.trim() || finalCategory;

    onAddExpense({
      id: 'e-' + Date.now(),
      name: finalName,
      amount: Number(amount),
      category: finalCategory
    });
    setName('');
    setAmount('');
    setCategory(''); // Deselect category after submission
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px', color: 'var(--primary-orange)' }}>
        📦 Track Expenses & Samagri Items
      </h4>

      {/* Quick Add Form Box */}
      <div style={{ background: 'var(--bg-card-hover)', padding: '14px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
        <div className="form-row">
          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label">Item / Expense Name (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Hawan Samagri (or leave blank to auto-use category)"
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
              placeholder="e.g. 4500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(e); } }}
            />
          </div>
        </div>

        {/* Category Pills Selector (Supports Toggle Deselect!) */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label className="form-label" style={{ margin: 0 }}>Select Expense Category with Icon</label>
            {category && (
              <button
                type="button"
                onClick={() => setCategory('')}
                style={{ background: 'none', border: 'none', color: 'var(--primary-orange)', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Clear Selection &times;
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.name;
              return (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() => setCategory(isSelected ? '' : cat.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: isSelected ? `1.5px solid ${cat.color}` : '1px solid var(--border-color)',
                    background: isSelected ? `${cat.color}22` : 'var(--bg-card)',
                    color: isSelected ? cat.color : 'var(--text-muted)',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? '700' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title={isSelected ? 'Click again to deselect' : `Select ${cat.name}`}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {getCategoryIcon(item.category)}
                <div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', color: 'var(--text-main)' }}>{item.name}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.category}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary-orange)' }}>
                  ₹{Number(item.amount).toLocaleString('en-IN')}
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteExpense(item.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  title="Delete Expense"
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
