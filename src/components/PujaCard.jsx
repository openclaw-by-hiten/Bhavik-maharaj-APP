import React from 'react';
import { Calendar, UserCheck, Share2, Trash2, ChevronRight, Users } from 'lucide-react';
import { generateWhatsAppSummary } from '../services/exportService';
import { formatDate } from '../utils/formatters';

export default function PujaCard({ puja, onSelect, onDelete }) {
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

  // Timezone-safe today comparison for Completed vs Upcoming status
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const todayIso = `${y}-${m}-${d}`;

  let pDate = puja.date || '';
  if (pDate.includes('-')) {
    const parts = pDate.split('-');
    if (parts.length === 3) {
      pDate = `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`;
    }
  }

  const isCompleted = pDate < todayIso;

  return (
    <div className="puja-card animate-fade-in" onClick={() => onSelect(puja)}>
      <div>
        {/* Header with Automatic Completed / Upcoming Badge */}
        <div className="card-header" style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div>
            <h3 className="client-title">{puja.clientName}</h3>
            <p className="puja-subtitle">{puja.pujaName}</p>
          </div>

          {isCompleted ? (
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 9px', borderRadius: '20px', whiteSpace: 'nowrap', flexShrink: 0 }}>
              ✓ Completed
            </span>
          ) : (
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '3px 9px', borderRadius: '20px', whiteSpace: 'nowrap', flexShrink: 0 }}>
              ⏳ Upcoming
            </span>
          )}
        </div>

        {/* Date & Referral Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <div className="referred-tag">
            <Calendar size={13} color="#f59e0b" />
            <span>{formatDate(puja.date)}</span>
          </div>

          <div className="referred-tag">
            <UserCheck size={13} color="#818cf8" />
            <span>Ref: {puja.referredBy || 'Added by Me'}</span>
          </div>
        </div>

        {/* BHUDEV Only Section */}
        <div className="card-stats-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 14px', margin: '8px 0' }}>
          <div className="stat-item" style={{ flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
            <span className="label" style={{ margin: 0, fontSize: '0.78rem' }}>BHUDEV:</span>
            <div className="value" style={{ color: 'var(--royal-blue)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: '800' }}>
              <Users size={16} color="var(--royal-blue)" />
              <span>{puja.bhudevs.length} {puja.bhudevs.length === 1 ? 'Pandit' : 'Pandits'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', gap: '8px' }}>
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
