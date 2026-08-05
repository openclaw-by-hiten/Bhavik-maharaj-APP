import React, { useState } from 'react';
import { Users, Phone, Calendar, ChevronRight, Lock, Eye, Share2, Wallet, Search, Sparkles } from 'lucide-react';
import SummaryPieChart from './SummaryPieChart';
import { generateWhatsAppSummary } from '../services/exportService';
import { formatDate } from '../utils/formatters';

export default function ClientDirectory({ pujas }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientName, setSelectedClientName] = useState(null);
  const [viewingPuja, setViewingPuja] = useState(null);

  // Group Pujas by Yajman Name
  const clientMap = {};
  pujas.forEach((puja) => {
    const name = puja.clientName || 'Unknown Yajman';
    if (!clientMap[name]) {
      clientMap[name] = {
        name,
        phone: puja.clientPhone || '',
        referredBy: puja.referredBy || 'Added by Me (Direct)',
        pujas: []
      };
    }
    clientMap[name].pujas.push(puja);
  });

  const clientList = Object.values(clientMap).filter((c) => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.referredBy.toLowerCase().includes(q);
  });

  const activeClient = selectedClientName ? clientMap[selectedClientName] : null;

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--royal-blue), #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Yajman Directory & History</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Bhavik Maharaj Yajman Database • View all past Pujas & read-only summaries
              </p>
            </div>
          </div>

          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search Yajman directory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
          </div>
        </div>
      </div>

      {/* Client List vs Selected Client Details */}
      {!activeClient ? (
        <div className="cards-grid">
          {clientList.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <Users size={40} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
              <p style={{ fontWeight: '600', color: 'var(--text-main)' }}>No Yajmans Found</p>
            </div>
          ) : (
            clientList.map((client) => {
              const totalPujasDone = client.pujas.length;
              const grandTotalSpent = client.pujas.reduce((total, p) => {
                const expSum = p.expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
                const bhuSum = p.bhudevs.reduce((s, b) => s + Number(b.amount || 0), 0);
                return total + expSum + bhuSum;
              }, 0);

              return (
                <div
                  key={client.name}
                  className="puja-card"
                  onClick={() => setSelectedClientName(client.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 className="client-title">{client.name}</h3>
                      <span className="badge-direct">{totalPujasDone} {totalPujasDone === 1 ? 'Puja' : 'Pujas'}</span>
                    </div>

                    {client.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        <Phone size={14} color="var(--primary-orange)" />
                        <span>{client.phone}</span>
                      </div>
                    )}

                    <div className="referred-tag">
                      <span>Ref: {client.referredBy}</span>
                    </div>

                    <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '10px', padding: '10px 14px', marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Lifetime Kharch:</span>
                      <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary-orange)' }}>
                        ₹{grandTotalSpent.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    <button className="btn-secondary" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
                      <span>View Yajman History</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Detailed Client Profile View */
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <button
            className="btn-secondary"
            onClick={() => {
              setSelectedClientName(null);
              setViewingPuja(null);
            }}
            style={{ marginBottom: '20px', fontSize: '0.85rem' }}
          >
            ← Back to All Yajmans
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid var(--border-color)' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-orange)' }}>
                {activeClient.name}
              </h2>
              {activeClient.phone && (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Phone size={15} color="var(--primary-orange)" /> {activeClient.phone}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="badge-prepaid" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                Total Pujas: {activeClient.pujas.length}
              </div>
              <div className="offline-status-tag" style={{ background: 'var(--royal-blue-light)', borderColor: 'var(--royal-blue-border)', color: 'var(--royal-blue)' }}>
                <Lock size={14} />
                <span>Read-Only Online View</span>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', color: 'var(--royal-blue)' }}>
            📜 Past Puja History for {activeClient.name}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeClient.pujas.map((puja) => {
              const expSum = puja.expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
              const bhuSum = puja.bhudevs.reduce((s, b) => s + Number(b.amount || 0), 0);
              const total = expSum + bhuSum;

              return (
                <div key={puja.id} style={{ background: 'var(--bg-card-hover)', border: '1.5px solid var(--border-color)', borderRadius: '14px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{puja.pujaName}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Calendar size={13} color="var(--primary-orange)" /> Held on: {formatDate(puja.date)}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Total Kharch:</span>
                      <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--accent-rose)' }}>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Read-Only Summary & Pie Chart Accordion */}
                  <SummaryPieChart puja={puja} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <Lock size={13} color="#94a3b8" />
                      <span>Past Puja data is locked read-only</span>
                    </div>

                    <button
                      className="btn-secondary"
                      onClick={() => {
                        const url = generateWhatsAppSummary(puja);
                        window.open(url, '_blank');
                      }}
                      style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                    >
                      <Share2 size={15} color="#25D366" />
                      <span>Share Summary via WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
