import React from 'react';
import { Award, Users, UserCheck, Calendar, Gift, Star } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function ReferralLeaderboard({ pujas }) {
  // Compute referral counts by DISTINCT client persons referred
  const referrerMap = {};

  pujas.forEach((puja) => {
    const ref = puja.referredBy;
    if (ref && ref !== 'Added by Me (Direct)') {
      if (!referrerMap[ref]) {
        referrerMap[ref] = { totalPujas: 0, clientsMap: {} };
      }
      referrerMap[ref].totalPujas += 1;
      if (!referrerMap[ref].clientsMap[puja.clientName]) {
        referrerMap[ref].clientsMap[puja.clientName] = [];
      }
      referrerMap[ref].clientsMap[puja.clientName].push(puja);
    }
  });

  // Convert map to sorted array (ranked by unique persons referred first)
  const leaderboard = Object.keys(referrerMap)
    .map((name) => {
      const clientNames = Object.keys(referrerMap[name].clientsMap);
      return {
        name,
        uniquePersonsCount: clientNames.length,
        totalPujasCount: referrerMap[name].totalPujas,
        clientNames,
        details: referrerMap[name].clientsMap
      };
    })
    .sort((a, b) => b.uniquePersonsCount - a.uniquePersonsCount || b.totalPujasCount - a.totalPujasCount);

  const totalPujas = pujas.length;
  const totalReferredPujas = leaderboard.reduce((sum, r) => sum + r.totalPujasCount, 0);
  const totalUniqueReferredPersons = leaderboard.reduce((sum, r) => sum + r.uniquePersonsCount, 0);
  const totalDirectPujas = totalPujas - totalReferredPujas;

  return (
    <div className="animate-fade-in">
      <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--royal-blue), #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Customer Referral Analytics</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Top referring customers ranked by distinct new client persons brought to Bhavik Maharaj
            </p>
          </div>
        </div>

        {/* Overview Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: 'var(--royal-blue-light)', padding: '12px', borderRadius: '12px', border: '1px solid var(--royal-blue-border)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>Referred Persons</span>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--royal-blue)', marginTop: '2px' }}>{totalUniqueReferredPersons}</div>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>Referred Pujas</span>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary-orange)', marginTop: '2px' }}>{totalReferredPujas}</div>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>Direct Pujas</span>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '2px' }}>{totalDirectPujas}</div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '14px', color: 'var(--primary-orange)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Star size={18} color="var(--primary-orange)" fill="var(--primary-orange)" />
          <span>Top Referrer Rankings (By Distinct Persons)</span>
        </h3>

        {leaderboard.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 16px', background: 'var(--bg-card-hover)', borderRadius: '14px', border: '1px dashed var(--border-color)' }}>
            <Gift size={36} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '700' }}>No Referred Customers Logged Yet</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              When creating a new Puja, select an existing customer in the "Referred By" dropdown to build referral rankings!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {leaderboard.map((item, index) => (
              <div
                key={item.name}
                style={{
                  background: 'var(--bg-card)',
                  border: index === 0 ? '2px solid var(--primary-orange)' : '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '16px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: index === 0 ? 'var(--primary-orange)' : index === 1 ? 'var(--royal-blue)' : '#78716c',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.88rem'
                    }}>
                      #{index + 1}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>{item.name}</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '500' }}>Pre-registered Referrer</span>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-accent-light)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary-orange)' }}>
                      {item.uniquePersonsCount} {item.uniquePersonsCount === 1 ? 'Person' : 'Persons'} Referred ({item.totalPujasCount} {item.totalPujasCount === 1 ? 'Puja' : 'Pujas'})
                    </span>
                  </div>
                </div>

                {/* Sub-list of distinct referred clients */}
                <div style={{ background: 'var(--bg-card-hover)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--royal-blue)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    Referred Clients List ({item.uniquePersonsCount} Distinct Persons):
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {item.clientNames.map((clientName) => {
                      const clientPujas = item.details[clientName];
                      return (
                        <div key={clientName} style={{ background: 'var(--bg-card)', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>👤 {clientName}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary-orange)', fontWeight: '600' }}>
                              {clientPujas.length} {clientPujas.length === 1 ? 'Puja' : 'Pujas'}
                            </span>
                          </div>
                          <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {clientPujas.map((p) => (
                              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>• {p.pujaName}</span>
                                <span style={{ whiteSpace: 'nowrap', flexShrink: 0, fontWeight: '700', color: 'var(--royal-blue)' }}>{formatDate(p.date)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
