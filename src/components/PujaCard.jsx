import React from 'react';
import { Calendar, UserCheck, Share2, Trash2, ChevronRight, Wallet, Users } from 'lucide-react';
import { generateWhatsAppSummary } from '../services/exportService';
import { formatDate } from '../utils/formatters';

export default function PujaCard({ puja, onSelect, onDelete }) {
  const totalExpenses = puja.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalBhudevDakshina = puja.bhudevs.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const grandTotal = totalExpenses + totalBhudevDakshina;

  const prepaid = Number(puja.prepaidAmount || 0);
  const balance = puja.isPrepaid ? prepaid - grandTotal : -grandTotal;

  const handleShareWhatsApp = (e) => {
    e.stopPropagation();
    const url = generateWhatsAppSummary(puja);
    window.open(url, '_blank');
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${puja.clientName}'s Puja record?`)) {
      onDelete(puja.id);
    }
  };

  return (
    <div className="puja-card animate-fade-in" onClick={() => onSelect(puja)}>
      <div>
        <div className="card-header">
          <div>
            <h3 className="client-title">{puja.clientName}</h3>
            <p className="puja-subtitle">{puja.pujaName}</p>
          </div>
          {puja.isPrepaid ? (
            <span className="badge-prepaid">Prepaid ₹{prepaid.toLocaleString('en-IN')}</span>
          ) : (
            <span className="badge-direct">Direct Expenses</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <div className="referred-tag">
            <Calendar size={13} color="#f59e0b" />
            <span>{formatDate(puja.date)}</span>
          </div>

          <div className="referred-tag">
            <UserCheck size={13} color="#818cf8" />
            <span>Ref: {puja.referredBy || 'Added by Me'}</span>
          </div>
        </div>

        <div className="card-stats-row">
          <div className="stat-item">
            <span className="label">Items</span>
            <div className="value" style={{ color: 'var(--primary-orange)' }}>{puja.expenses.length}</div>
          </div>
          <div className="stat-item">
            <span className="label">Bhudev</span>
            <div className="value" style={{ color: 'var(--royal-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Users size={14} color="var(--royal-blue)" />
              <span>{puja.bhudevs.length}</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="label">Total Spent</span>
            <div className="value" style={{ color: 'var(--accent-rose)' }}>₹{grandTotal.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {puja.isPrepaid && (
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            background: balance >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            padding: '8px 12px',
            borderRadius: '10px',
            border: balance >= 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {balance >= 0 ? 'Remaining Advance:' : 'Client Amount Due:'}
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: '700', color: balance >= 0 ? '#34d399' : '#fb7185' }}>
              ₹{Math.abs(balance).toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button className="icon-circle-btn" onClick={handleShareWhatsApp} title="Share Summary on WhatsApp">
            <Share2 size={15} color="#25D366" />
          </button>
          <button className="icon-circle-btn" onClick={handleDelete} title="Delete Puja Record">
            <Trash2 size={15} color="var(--accent-rose)" />
          </button>
        </div>

        <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.78rem', gap: '4px', whiteSpace: 'nowrap' }}>
          <span>View Details</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
