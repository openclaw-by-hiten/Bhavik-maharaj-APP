import React, { useState } from 'react';
import { Users, Phone, Calendar, ChevronRight, Lock, Eye, Share2, Wallet, Search, Sparkles, Award, Edit } from 'lucide-react';
import SummaryPieChart from './SummaryPieChart';
import ReferralLeaderboard from './ReferralLeaderboard';
import { generateWhatsAppSummary } from '../services/exportService';
import { formatDate } from '../utils/formatters';

export default function ClientDirectory({ pujas, onEditPuja }) {
  const [subTab, setSubTab] = useState('directory'); // 'directory' | 'referrals'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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
    const matchesSearch = c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.referredBy.toLowerCase().includes(q);
    if (!matchesSearch) return false;

    // Financial Baki vs Settled Filter (Individual Puja Level)
    const hasBaki = c.pujas.some(p => {
      const expSum = p.expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
      const bhuSum = p.bhudevs.reduce((s, b) => s + Number(b.amount || 0), 0);
      const pujaKharch = expSum + bhuSum;
      const yajmanPaid = Number(p.prepaidAmount || 0);
      return pujaKharch > yajmanPaid;
    });

    if (filterStatus === 'baki') return hasBaki;
    if (filterStatus === 'settled') return !hasBaki;
    return true;
  });

  const activeClient = selectedClientName ? clientMap[selectedClientName] : null;

  return (
    <div className="animate-fade-in" style={{ width: '100%', boxSizing: 'border-box' }}>
      {/* Subtab Bar inside Yajman Directory */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: 'var(--bg-card)', padding: '6px', borderRadius: '16px', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
        <button
          className={`nav-btn ${subTab === 'directory' ? 'active' : ''}`}
          onClick={() => { setSubTab('directory'); setSelectedClientName(null); }}
          style={{ flex: '1 1 140px', justifyContent: 'center', borderRadius: '12px', padding: '10px', fontSize: '0.88rem', fontWeight: '800' }}
        >
          <Users size={18} />
          <span>Yajman Directory</span>
        </button>
        <button
          className={`nav-btn ${subTab === 'referrals' ? 'active' : ''}`}
          onClick={() => { setSubTab('referrals'); setSelectedClientName(null); }}
          style={{ flex: '1 1 140px', justifyContent: 'center', borderRadius: '12px', padding: '10px', fontSize: '0.88rem', fontWeight: '800' }}
        >
          <Award size={18} />
          <span>Referral Analytics</span>
        </button>
      </div>

      {subTab === 'referrals' ? (
        <ReferralLeaderboard pujas={pujas} />
      ) : (
        <>
          {/* Header Banner */}
          <div style={{ background: 'var(--bg-card)', padding: '18px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '20px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--royal-blue), #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={22} color="#ffffff" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Yajman Directory & History</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Bhavik Maharaj Yajman Database • View all past Pujas & read-only summaries
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                <div style={{ position: 'relative', flex: '1 1 180px', minWidth: '0' }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search Yajman directory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
                  />
                </div>

                <select
                  className="filter-select-field"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ flex: '1 1 140px', fontSize: '0.82rem', padding: '8px 10px' }}
                >
                  <option value="all">All Yajmans</option>
                  <option value="baki">Yajman Baki (Due Amount)</option>
                  <option value="settled">Remaining Dakshina (Settled)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Client List vs Selected Client Details */}
          {!activeClient ? (
            <div className="cards-grid">
              {clientList.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                  <Users size={40} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
                  <p style={{ fontWeight: '600', color: 'var(--text-main)' }}>No Yajmans Found</p>
                </div>
              ) : (
                clientList.map((client) => {
                  const totalPujasDone = client.pujas.length;
                  let totalKharch = 0;
                  let totalBhudevDakshina = 0;
                  let totalBaki = 0;
                  let totalEarnedDakshina = 0;

                  // Calculate each Puja INDIVIDUALLY
                  client.pujas.forEach((p) => {
                    const expSum = p.expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
                    const bhuSum = p.bhudevs.reduce((s, b) => s + Number(b.amount || 0), 0);
                    const pujaKharch = expSum + bhuSum;
                    const pujaPaid = Number(p.prepaidAmount || 0);

                    totalKharch += pujaKharch;
                    totalBhudevDakshina += bhuSum;

                    if (pujaKharch > pujaPaid) {
                      totalBaki += (pujaKharch - pujaPaid);
                    } else {
                      totalEarnedDakshina += (pujaPaid - pujaKharch);
                    }
                  });

                  return (
                    <div
                      key={client.name}
                      className="puja-card"
                      onClick={() => setSelectedClientName(client.name)}
                      style={{ cursor: 'pointer', overflow: 'hidden', boxSizing: 'border-box' }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px', flexWrap: 'wrap' }}>
                          <h3 className="client-title" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.name}</h3>
                          <span className="badge-direct" style={{ flexShrink: 0 }}>{totalPujasDone} {totalPujasDone === 1 ? 'Puja' : 'Pujas'}</span>
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

                        {/* Bhudev Kharch Breakdown Box */}
                        <div style={{ background: 'var(--royal-blue-light)', border: '1px solid var(--royal-blue-border)', borderRadius: '12px', padding: '10px 12px', marginTop: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--royal-blue)', fontWeight: '800', textTransform: 'uppercase' }}>
                              Bhudev Kharch ({client.pujas.length} {client.pujas.length === 1 ? 'Puja' : 'Pujas'}):
                            </span>
                            <span style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--royal-blue)' }}>
                              Total ₹{totalBhudevDakshina.toLocaleString('en-IN')}
                            </span>
                          </div>

                          {/* Per-Puja Breakdown Lines */}
                          {client.pujas.map((p) => {
                            const bhuSum = p.bhudevs.reduce((s, b) => s + Number(b.amount || 0), 0);
                            return (
                              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', paddingTop: '5px', marginTop: '5px', borderTop: '1px dashed var(--royal-blue-border)', gap: '6px' }}>
                                <span style={{ fontWeight: '600', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
                                  • {p.pujaName} ({p.bhudevs.length} {p.bhudevs.length === 1 ? 'Pandit' : 'Pandits'})
                                </span>
                                <span style={{ fontWeight: '800', color: 'var(--royal-blue)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                  ₹{bhuSum.toLocaleString('en-IN')}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Red Box for Total Yajman Baki */}
                        {totalBaki > 0 && (
                          <div style={{
                            background: 'rgba(244, 63, 94, 0.12)',
                            border: '1.5px solid rgba(244, 63, 94, 0.35)',
                            borderRadius: '12px',
                            padding: '10px 12px',
                            marginTop: '8px'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: '800', textTransform: 'uppercase' }}>
                                Yajman Baki (Due Amount):
                              </span>
                              <span style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--accent-rose)' }}>
                                Total ₹{totalBaki.toLocaleString('en-IN')}
                              </span>
                            </div>

                            {/* Per-Puja Baki Lines */}
                            {client.pujas.map((p) => {
                              const expSum = p.expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
                              const bhuSum = p.bhudevs.reduce((s, b) => s + Number(b.amount || 0), 0);
                              const pujaKharch = expSum + bhuSum;
                              const pujaPaid = Number(p.prepaidAmount || 0);
                              const baki = pujaKharch > pujaPaid ? (pujaKharch - pujaPaid) : 0;

                              if (baki <= 0) return null;

                              return (
                                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', paddingTop: '5px', marginTop: '5px', borderTop: '1px dashed rgba(244, 63, 94, 0.35)', gap: '6px' }}>
                                  <span style={{ fontWeight: '600', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
                                    • {p.pujaName}
                                  </span>
                                  <span style={{ fontWeight: '800', color: 'var(--accent-rose)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                    ₹{baki.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Green Box for Total Earned Dakshina */}
                        {totalEarnedDakshina > 0 && (
                          <div style={{
                            background: 'rgba(16, 185, 129, 0.12)',
                            border: '1.5px solid rgba(16, 185, 129, 0.35)',
                            borderRadius: '12px',
                            padding: '10px 12px',
                            marginTop: '8px'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: '800', textTransform: 'uppercase' }}>
                                Total Earned Dakshina:
                              </span>
                              <span style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>
                                Total ₹{totalEarnedDakshina.toLocaleString('en-IN')}
                              </span>
                            </div>

                            {/* Per-Puja Earned Dakshina Lines */}
                            {client.pujas.map((p) => {
                              const expSum = p.expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
                              const bhuSum = p.bhudevs.reduce((s, b) => s + Number(b.amount || 0), 0);
                              const pujaKharch = expSum + bhuSum;
                              const pujaPaid = Number(p.prepaidAmount || 0);
                              const earned = pujaPaid >= pujaKharch ? (pujaPaid - pujaKharch) : 0;

                              if (earned <= 0) return null;

                              return (
                                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', paddingTop: '5px', marginTop: '5px', borderTop: '1px dashed rgba(16, 185, 129, 0.35)', gap: '6px' }}>
                                  <span style={{ fontWeight: '600', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
                                    • {p.pujaName}
                                  </span>
                                  <span style={{ fontWeight: '800', color: 'var(--accent-emerald)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                    ₹{earned.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                        <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
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
            <div style={{ background: 'var(--bg-card)', padding: '20px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  setSelectedClientName(null);
                  setViewingPuja(null);
                }}
                style={{ marginBottom: '16px', fontSize: '0.82rem' }}
              >
                ← Back to All Yajmans
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '2px solid var(--border-color)' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary-orange)' }}>
                    {activeClient.name}
                  </h2>
                  {activeClient.phone && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <Phone size={14} color="var(--primary-orange)" /> {activeClient.phone}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <div className="badge-prepaid" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                    Total Pujas: {activeClient.pujas.length}
                  </div>
                  <div className="offline-status-tag" style={{ background: 'var(--royal-blue-light)', borderColor: 'var(--royal-blue-border)', color: 'var(--royal-blue)' }}>
                    <Lock size={13} />
                    <span>Read-Only View</span>
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '14px', color: 'var(--royal-blue)' }}>
                📜 Past Puja History for {activeClient.name}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {activeClient.pujas.map((puja) => {
                  const expSum = puja.expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
                  const bhuSum = puja.bhudevs.reduce((s, b) => s + Number(b.amount || 0), 0);
                  const totalKharch = expSum + bhuSum;
                  const yajmanPaid = Number(puja.prepaidAmount || 0);
                  const isPujaBaki = totalKharch > yajmanPaid;
                  const diffAmount = Math.abs(yajmanPaid - totalKharch);

                  return (
                    <div key={puja.id} style={{ background: 'var(--bg-card-hover)', border: '1.5px solid var(--border-color)', borderRadius: '14px', padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: '800' }}>{puja.pujaName}</h4>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <Calendar size={13} color="var(--primary-orange)" /> Held on: {formatDate(puja.date)}
                          </span>
                        </div>

                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Kharch: ₹{totalKharch.toLocaleString('en-IN')}</span>
                          {isPujaBaki ? (
                            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--accent-rose)', background: 'rgba(244, 63, 94, 0.15)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                              Puja Baki: ₹{diffAmount.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                              Earned Dakshina: ₹{diffAmount.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Read-Only Summary & Pie Chart Accordion */}
                      <SummaryPieChart puja={puja} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '8px' }}>
                        {onEditPuja && (
                          <button
                            type="button"
                            className="btn-primary"
                            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                            onClick={() => onEditPuja(puja)}
                          >
                            <Edit size={15} />
                            <span>Edit Puja / Add Expenses</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                          onClick={() => {
                            const url = generateWhatsAppSummary(puja);
                            window.open(url, '_blank');
                          }}
                        >
                          <Share2 size={14} color="#25D366" />
                          <span>Share WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
