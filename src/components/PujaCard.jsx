import React from 'react';
import { Calendar, UserCheck, Share2, Trash2, ChevronRight, Users } from 'lucide-react';
import { generateWhatsAppSummary } from '../services/exportService';
import { formatDate } from '../utils/formatters';

export default function PujaCard({ puja, onSelect, onDelete }) {
  const totalExpenses = puja.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalBhudevDakshina = puja.bhudevs.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalKharch = totalExpenses + totalBhudevDakshina;

  const yajmanPaid = Number(puja.prepaidAmount || 0);
  const diff = yajmanPaid - totalKharch; // positive = remaining dakshina, negative = Yajman Baki

  const isBaki = totalKharch > yajmanPaid;
  const bakiAmount = Math.abs(diff);

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
        {/* Header */}
        <div className="card-header">
          <div>
            <h3 className="client-title">{puja.clientName}</h3>
            <p className="puja-subtitle">{puja.pujaName}</p>
          </div>
          {puja.isPrepaid || yajmanPaid > 0 ? (
            <span className="badge-prepaid">Paid ₹{yajmanPaid.toLocaleString('en-IN')}</span>
          ) : (
            <span className="badge-direct">Kharch Logged</span>
          )}
        </div>

        {/* Date & Referral */}
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

        {/* BHUDEV Only Section (Hidden Items & Total Spend as requested) */}
        <div className="card-stats-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 14px' }}>
          <div className="stat-item" style={{ flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
            <span className="label" style={{ margin: 0, fontSize: '0.78rem' }}>BHUDEV:</span>
            <div className="value" style={{ color: 'var(--royal-blue)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: '800' }}>
              <Users size={16} color="var(--royal-blue)" />
              <span>{puja.bhudevs.length} {puja.bhudevs.length === 1 ? 'Pandit' : 'Pandits'}</span>
            </div>
          </div>
        </div>

        {/* Baki / Remaining Dakshina Status Box */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: isBaki ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)',
          padding: '10px 14px',
          borderRadius: '10px',
          border: isBaki ? '1.5px solid rgba(244, 63, 94, 0.35)' : '1.5px solid rgba(16, 185, 129, 0.35)'
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: isBaki ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
            {isBaki ? 'Yajman Baki:' : 'Remaining Dakshina:'}
          </span>
          <span style={{ fontSize: '1.05rem', fontWeight: '800', color: isBaki ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
            ₹{bakiAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Card Action Row */}
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
