import React, { useState } from 'react';
import { Search, UserCheck, Phone, User, ChevronDown, ChevronUp, Calendar, Eye, CheckSquare, Square } from 'lucide-react';
import { formatDate } from '../utils/formatters';

// Timezone-safe local date YYYY-MM-DD
function toIsoDateString(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function BhudevDirectory({ pujas, onSelectPuja, onToggleBhudevPaidForPuja }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'orange_handover' | 'red_unpaid' | 'green_paid'
  const [expandedBhudevName, setExpandedBhudevName] = useState(null);

  const todayIso = toIsoDateString(new Date());

  // Aggregate Bhudev Data across all Pujas based on revised logic
  const bhudevMap = {};

  pujas.forEach((puja) => {
    const totalKharch = puja.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0) +
                       puja.bhudevs.reduce((sum, b) => sum + Number(b.amount || 0), 0);
    const yajmanPaid = Number(puja.prepaidAmount || 0);
    const isYajmanPaidFull = yajmanPaid >= totalKharch && totalKharch > 0;

    puja.bhudevs.forEach((b) => {
      const nameKey = (b.name || '').trim();
      if (!nameKey) return;

      if (!bhudevMap[nameKey]) {
        bhudevMap[nameKey] = {
          name: nameKey,
          phone: b.phone || '',
          pujasAttended: [],
          totalDakshina: 0,
          pendingHandoverDakshina: 0, // 🟠 Orange: Maharaj paid Bhudev from pocket, but Yajman has not paid Maharaj
          pendingUnpaidDakshina: 0,   // 🔴 Red: Maharaj HAS NOT paid Bhudev yet (Pandit Unpaid)
          settledDakshina: 0         // 🟢 Green: Both Yajman paid Maharaj AND Maharaj paid Bhudev
        };
      }

      const bAmount = Number(b.amount || 0);
      bhudevMap[nameKey].totalDakshina += bAmount;

      const isBhudevPaid = Boolean(b.isPaid); // Checked by Maharaj

      let pujaBhudevStatus = 'green_paid'; // 'green_paid' | 'orange_handover' | 'red_unpaid'

      if (isBhudevPaid && isYajmanPaidFull) {
        // 🟢 Fully Settled: Both Yajman Paid & Maharaj Paid Bhudev
        pujaBhudevStatus = 'green_paid';
        bhudevMap[nameKey].settledDakshina += bAmount;
      } else if (isBhudevPaid && !isYajmanPaidFull) {
        // 🟠 Pending Handover Due: Maharaj paid Bhudev from pocket, BUT Yajman HAS NOT paid Maharaj
        pujaBhudevStatus = 'orange_handover';
        bhudevMap[nameKey].pendingHandoverDakshina += bAmount;
      } else {
        // 🔴 Pandit Unpaid: Maharaj HAS NOT paid Bhudev yet
        pujaBhudevStatus = 'red_unpaid';
        bhudevMap[nameKey].pendingUnpaidDakshina += bAmount;
      }

      bhudevMap[nameKey].pujasAttended.push({
        pujaId: puja.id,
        clientName: puja.clientName,
        pujaName: puja.pujaName,
        date: puja.date,
        dakshina: bAmount,
        yajmanPaid,
        totalKharch,
        isYajmanPaidFull,
        status: pujaBhudevStatus,
        rawBhudevObj: b,
        fullPujaObj: puja
      });
    });
  });

  const bhudevsList = Object.values(bhudevMap).sort((a, b) => b.totalDakshina - a.totalDakshina);

  // Filter Bhudevs by Search & Payment Status
  const filteredBhudevs = bhudevsList.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (statusFilter === 'orange_handover') {
      return b.pendingHandoverDakshina > 0;
    }
    if (statusFilter === 'red_unpaid') {
      return b.pendingUnpaidDakshina > 0;
    }
    if (statusFilter === 'green_paid') {
      return b.pendingHandoverDakshina === 0 && b.pendingUnpaidDakshina === 0 && b.settledDakshina > 0;
    }

    return true;
  });

  // Calculate Global Summary Stats
  const totalBhudevsCount = bhudevsList.length;
  const totalPendingHandover = bhudevsList.reduce((sum, b) => sum + b.pendingHandoverDakshina, 0);
  const totalPendingUnpaid = bhudevsList.reduce((sum, b) => sum + b.pendingUnpaidDakshina, 0);
  const totalSettled = bhudevsList.reduce((sum, b) => sum + b.settledDakshina, 0);

  const toggleExpandCard = (name) => {
    setExpandedBhudevName(expandedBhudevName === name ? null : name);
  };

  return (
    <main className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      
      {/* Header Bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <UserCheck size={26} color="var(--primary-orange)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Bhudev (Pandit) Directory
          </h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Track Pandit payments, Handover dues (paid from pocket), and pending Yajman collections.
        </p>
      </div>

      {/* Global Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        
        {/* Card 1: Total Bhudevs */}
        <div
          onClick={() => setStatusFilter('all')}
          style={{
            background: statusFilter === 'all' ? 'rgba(249, 115, 22, 0.12)' : 'var(--bg-card)',
            border: statusFilter === 'all' ? '2px solid var(--primary-orange)' : '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '14px',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>All Bhudevs</span>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-orange)', marginTop: '4px' }}>
            {totalBhudevsCount} <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Pandits</span>
          </div>
        </div>

        {/* Card 2: 🟠 Pending Handover Due (Paid Pandit from Pocket, Yajman Unpaid) */}
        <div
          onClick={() => setStatusFilter('orange_handover')}
          style={{
            background: statusFilter === 'orange_handover' ? 'rgba(234, 88, 12, 0.15)' : 'var(--bg-card)',
            border: statusFilter === 'orange_handover' ? '2px solid #ea580c' : '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '14px',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: '800', textTransform: 'uppercase' }}>Handover Due</span>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ea580c', marginTop: '4px' }}>
            ₹{totalPendingHandover.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Paid Pandit from Pocket</span>
        </div>

        {/* Card 3: 🔴 Pending Bhudev Payment (Pandit Unpaid) */}
        <div
          onClick={() => setStatusFilter('red_unpaid')}
          style={{
            background: statusFilter === 'red_unpaid' ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-card)',
            border: statusFilter === 'red_unpaid' ? '2px solid #ef4444' : '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '14px',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: '800', textTransform: 'uppercase' }}>Pandit Unpaid</span>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ef4444', marginTop: '4px' }}>
            ₹{totalPendingUnpaid.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bhudev Unpaid</span>
        </div>

        {/* Card 4: 🟢 Settled / Paid */}
        <div
          onClick={() => setStatusFilter('green_paid')}
          style={{
            background: statusFilter === 'green_paid' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)',
            border: statusFilter === 'green_paid' ? '2px solid var(--accent-emerald)' : '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '14px',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: '800', textTransform: 'uppercase' }}>Paid & Settled</span>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '4px' }}>
            ₹{totalSettled.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Both Paid & Settled</span>
        </div>

      </div>

      {/* Controls: Search & Filter Dropdown */}
      <div className="controls-container" style={{ marginBottom: '20px' }}>
        <div className="search-box-wrapper" style={{ flex: 1 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 2 }} />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search Bhudev name or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: 'auto', minWidth: '180px', fontWeight: '700' }}
        >
          <option value="all">Filter: All Bhudevs ({totalBhudevsCount})</option>
          <option value="orange_handover">🟠 Pending Handover Due (Paid from Pocket)</option>
          <option value="red_unpaid">🔴 Pending Bhudev Payment (Pandit Unpaid)</option>
          <option value="green_paid">🟢 Fully Paid & Settled</option>
        </select>
      </div>

      {/* Bhudev Cards Grid */}
      {filteredBhudevs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-box">
            <UserCheck size={36} color="var(--primary-orange)" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px' }}>No Bhudev Records Found</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {searchQuery ? 'Try adjusting your search query or filter.' : 'Add Pandits in the Puja booking form to auto-populate the Bhudev Directory!'}
          </p>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredBhudevs.map((bhudev) => {
            const hasOrangeHandover = bhudev.pendingHandoverDakshina > 0;
            const hasRedUnpaid = bhudev.pendingUnpaidDakshina > 0;
            const isExpanded = expandedBhudevName === bhudev.name;

            return (
              <div
                key={bhudev.name}
                className="puja-card"
                style={{
                  border: isExpanded ? '2px solid var(--primary-orange)' : '1.5px solid var(--border-color)',
                  boxShadow: isExpanded ? '0 10px 30px rgba(234, 88, 12, 0.25)' : 'var(--shadow-sm)',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={18} color="var(--primary-orange)" />
                      <span>{bhudev.name}</span>
                    </h3>
                    {bhudev.phone && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Phone size={12} />
                        <span>{bhudev.phone}</span>
                      </span>
                    )}
                  </div>

                  <span style={{ fontSize: '0.78rem', background: 'var(--bg-card-hover)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: '12px', fontWeight: '800' }}>
                    {bhudev.pujasAttended.length} {bhudev.pujasAttended.length === 1 ? 'Puja' : 'Pujas'}
                  </span>
                </div>

                {/* Status Badges */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {hasOrangeHandover && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.3)', padding: '3px 8px', borderRadius: '8px', fontWeight: '800' }}>
                      🟠 Handover Due: ₹{bhudev.pendingHandoverDakshina.toLocaleString('en-IN')}
                    </span>
                  )}

                  {hasRedUnpaid && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '3px 8px', borderRadius: '8px', fontWeight: '800' }}>
                      🔴 Pandit Unpaid: ₹{bhudev.pendingUnpaidDakshina.toLocaleString('en-IN')}
                    </span>
                  )}

                  {!hasOrangeHandover && !hasRedUnpaid && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 8px', borderRadius: '8px', fontWeight: '800' }}>
                      🟢 All Dakshina Settled
                    </span>
                  )}
                </div>

                {/* Total Lifetime Dakshina */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Total Earned Dakshina:</span>
                  <span style={{ fontWeight: '800', color: 'var(--primary-orange)', fontSize: '1.05rem' }}>
                    ₹{bhudev.totalDakshina.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Toggle Expansion Action Button (Inline Expansion) */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => toggleExpandCard(bhudev.name)}
                    style={{
                      background: isExpanded ? 'var(--primary-orange)' : 'var(--bg-card-hover)',
                      color: isExpanded ? '#ffffff' : 'var(--royal-blue)',
                      border: isExpanded ? 'none' : '1px solid var(--border-color)',
                      fontSize: '0.82rem',
                      fontWeight: '800',
                      padding: '6px 14px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{isExpanded ? 'Close History ▲' : 'View Full History →'}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* --- IN-CARD INLINE EXPANDED DETAILS --- */}
                {isExpanded && (
                  <div className="animate-fade-in" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '2px solid var(--primary-orange)' }}>
                    
                    {/* Financial Summary Pill Box */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', padding: '10px', background: 'var(--bg-card-hover)', borderRadius: '12px', marginBottom: '14px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--accent-emerald)', fontWeight: '800', textTransform: 'uppercase', display: 'block' }}>Settled</span>
                        <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--accent-emerald)' }}>
                          ₹{bhudev.settledDakshina.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.68rem', color: '#ea580c', fontWeight: '800', textTransform: 'uppercase', display: 'block' }}>Handover</span>
                        <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#ea580c' }}>
                          ₹{bhudev.pendingHandoverDakshina.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: '800', textTransform: 'uppercase', display: 'block' }}>Unpaid</span>
                        <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#ef4444' }}>
                          ₹{bhudev.pendingUnpaidDakshina.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Itemized Pujas Timeline */}
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                      Puja History Timeline ({bhudev.pujasAttended.length})
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto' }}>
                      {bhudev.pujasAttended.map((item, idx) => {
                        let badgeBg = 'rgba(16, 185, 129, 0.12)';
                        let badgeBorder = 'rgba(16, 185, 129, 0.3)';
                        let badgeColor = 'var(--accent-emerald)';
                        let badgeText = '🟢 Paid & Settled';

                        if (item.status === 'orange_handover') {
                          badgeBg = 'rgba(234, 88, 12, 0.15)';
                          badgeBorder = 'rgba(234, 88, 12, 0.3)';
                          badgeColor = '#ea580c';
                          badgeText = '🟠 Handover Due: Paid Pandit from Pocket, Yajman Unpaid';
                        } else if (item.status === 'red_unpaid') {
                          badgeBg = 'rgba(239, 68, 68, 0.12)';
                          badgeBorder = 'rgba(239, 68, 68, 0.3)';
                          badgeColor = '#ef4444';
                          badgeText = item.isYajmanPaidFull 
                            ? '🔴 Pandit Unpaid (🟢 Yajman Has Paid)' 
                            : '🔴 Pandit Unpaid (🔴 Yajman Unpaid)';
                        }

                        return (
                          <div
                            key={item.pujaId + '-' + idx}
                            style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '12px',
                              padding: '10px 12px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-main)' }}>{item.clientName}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--primary-orange)', fontWeight: '700' }}>{item.pujaName}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>📅 {formatDate(item.date)}</div>
                              </div>

                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Dakshina</div>
                                <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary-orange)' }}>
                                  ₹{item.dakshina.toLocaleString('en-IN')}
                                </div>
                              </div>
                            </div>

                            {/* Yajman Payment Status Badge + Pandit Payment Badge */}
                            <div style={{ marginTop: '8px', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.7rem', background: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}`, padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                                {badgeText}
                              </span>

                              {/* Yajman Status Tag */}
                              {item.isYajmanPaidFull ? (
                                <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                                  ✓ Yajman Paid
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                                  ⚠️ Yajman Unpaid
                                </span>
                              )}
                            </div>

                            {/* Interactive Mark Paid to Pandit Toggle Checkbox */}
                            <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onToggleBhudevPaidForPuja) {
                                    onToggleBhudevPaidForPuja(item.pujaId, item.rawBhudevObj.id || item.rawBhudevObj.name);
                                  }
                                }}
                                style={{
                                  background: item.rawBhudevObj.isPaid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 88, 12, 0.12)',
                                  border: item.rawBhudevObj.isPaid ? '1.5px solid var(--accent-emerald)' : '1.5px solid var(--primary-orange)',
                                  color: item.rawBhudevObj.isPaid ? 'var(--accent-emerald)' : 'var(--primary-orange)',
                                  padding: '5px 12px',
                                  borderRadius: '10px',
                                  fontSize: '0.78rem',
                                  fontWeight: '800',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  transition: 'all 0.2s ease'
                                }}
                                title="Click to toggle whether you have handed money to this Pandit"
                              >
                                {item.rawBhudevObj.isPaid ? (
                                  <>
                                    <CheckSquare size={16} color="var(--accent-emerald)" />
                                    <span>Paid to Pandit (Settled)</span>
                                  </>
                                ) : (
                                  <>
                                    <Square size={16} color="var(--primary-orange)" />
                                    <span>Mark Paid to Pandit</span>
                                  </>
                                )}
                              </button>

                              {onSelectPuja && (
                                <button
                                  className="btn-secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectPuja(item.fullPujaObj);
                                  }}
                                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                                >
                                  <Eye size={14} />
                                  <span>View Puja</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </main>
  );
}
