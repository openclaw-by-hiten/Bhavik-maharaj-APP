import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CATEGORIES, getCategoryIcon } from './ExpenseItem';
import { Wallet, PieChart as PieIcon, ArrowDownRight, ArrowUpRight, Users, CheckCircle2 } from 'lucide-react';

const COLORS = ['#f59e0b', '#ec4899', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#64748b'];

export default function SummaryPieChart({ puja }) {
  const totalExpenses = puja.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalBhudevDakshina = puja.bhudevs.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const grandTotalSpent = totalExpenses + totalBhudevDakshina;

  const prepaid = Number(puja.prepaidAmount || 0);
  const balance = puja.isPrepaid ? prepaid - grandTotalSpent : -grandTotalSpent;

  // Group expenses by category for Pie Chart
  const categoryMap = {};

  // Add itemized expenses
  puja.expenses.forEach((item) => {
    const cat = item.category || 'Misc';
    categoryMap[cat] = (categoryMap[cat] || 0) + Number(item.amount || 0);
  });

  // Add Bhudev Dakshina as its own major category slice if non-zero
  if (totalBhudevDakshina > 0) {
    categoryMap['Bhudev Dakshina'] = (categoryMap['Bhudev Dakshina'] || 0) + totalBhudevDakshina;
  }

  const chartData = Object.keys(categoryMap).map((catName) => ({
    name: catName,
    value: categoryMap[catName]
  })).filter(d => d.value > 0);

  return (
    <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <PieIcon size={22} color="var(--primary-gold)" />
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Puja Financial Summary & Pie Chart</h3>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {puja.isPrepaid && (
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', uppercase: true }}>Prepaid Advance</span>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fbbf24', marginTop: '2px' }}>
              ₹{prepaid.toLocaleString('en-IN')}
            </div>
          </div>
        )}

        <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Expenses</span>
          <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f43f5e', marginTop: '2px' }}>
            ₹{grandTotalSpent.toLocaleString('en-IN')}
          </div>
        </div>

        {puja.isPrepaid && (
          <div style={{
            background: balance >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            padding: '12px',
            borderRadius: '12px',
            border: balance >= 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {balance >= 0 ? 'Remaining Cash Left' : 'Client Due Amount'}
            </span>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: balance >= 0 ? '#34d399' : '#f87171', marginTop: '2px' }}>
              ₹{Math.abs(balance).toLocaleString('en-IN')}
            </div>
          </div>
        )}
      </div>

      {/* Pie Chart Visualization */}
      <div style={{ height: '220px', width: '100%', marginBottom: '12px', overflow: 'hidden' }}>
        {chartData.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No expenses logged yet for Pie Chart visualization.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={36}
                outerRadius={62}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--primary-orange)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.8rem', boxShadow: 'var(--shadow-md)' }}
              />
              <Legend verticalAlign="bottom" height={30} wrapperStyle={{ fontSize: '0.72rem', paddingTop: '4px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bhudev Paid List Summary */}
      {puja.bhudevs.length > 0 && (
        <div style={{ background: 'var(--royal-blue-light)', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--royal-blue-border)', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Users size={16} color="var(--royal-blue)" />
            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--royal-blue)' }}>
              Bhudev Payment List ({puja.bhudevs.length} Pandits)
            </h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
            {puja.bhudevs.map((b) => (
              <div key={b.id} style={{ background: 'var(--bg-card)', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', boxSizing: 'border-box' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--royal-blue)', whiteSpace: 'nowrap', flexShrink: 0 }}>₹{Number(b.amount).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
