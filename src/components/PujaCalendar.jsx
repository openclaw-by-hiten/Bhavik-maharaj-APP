import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Eye, Share2, X, Clock, Layers, CheckCircle2, ChevronDown } from 'lucide-react';
import { formatDate } from '../utils/formatters';

// Timezone-safe local date to ISO string (YYYY-MM-DD)
function toIsoDateString(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function PujaCalendar({ pujas, onSelectPuja, onBookPujaOnDate }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // Default August 2026 or current month
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  
  // Custom Dropdowns for Month & Year
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const yearScrollRef = useRef(null);

  // Dynamic filter state below calendar
  const [activeFilterPeriod, setActiveFilterPeriod] = useState('month'); // 'month' | 'upcoming' | 'completed' | 'week'
  const [selectedWeekSubFilter, setSelectedWeekSubFilter] = useState('all'); // 'all' | 'w1' | 'w2' | 'w3' | 'w4'

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const allYearsList = Array.from({ length: 201 }, (_, i) => 1900 + i);

  // Auto-scroll year dropdown container so current year is centered
  useEffect(() => {
    if (showYearDropdown && yearScrollRef.current) {
      const activeEl = document.getElementById(`year-item-${year}`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
  }, [showYearDropdown, year]);

  // Helper for prev/next month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedWeekSubFilter('all');
    setShowMonthDropdown(false);
    setShowYearDropdown(false);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedWeekSubFilter('all');
    setShowMonthDropdown(false);
    setShowYearDropdown(false);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedWeekSubFilter('all');
    setShowMonthDropdown(false);
    setShowYearDropdown(false);
  };

  // Build calendar matrix (Timezone-safe)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, d);
    const dateIso = toIsoDateString(prevMonthDate);
    calendarCells.push({
      dayNumber: d,
      isCurrentMonth: false,
      dateIso,
      dateObj: prevMonthDate
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const currentMonthDate = new Date(year, month, d);
    const dateIso = toIsoDateString(currentMonthDate);

    calendarCells.push({
      dayNumber: d,
      isCurrentMonth: true,
      dateIso,
      dateObj: currentMonthDate
    });
  }

  // Next month leading days
  const remainingCells = 42 - calendarCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonthDate = new Date(year, month + 1, d);
    const dateIso = toIsoDateString(nextMonthDate);
    calendarCells.push({
      dayNumber: d,
      isCurrentMonth: false,
      dateIso,
      dateObj: nextMonthDate
    });
  }

  // Map pujas by date ISO (robust normalized date matching)
  const pujasByDate = {};
  pujas.forEach((p) => {
    let pDate = p.date;
    if (pDate && pDate.includes('-')) {
      const parts = pDate.split('-');
      if (parts.length === 3) {
        const y = parts[0];
        const m = String(parts[1]).padStart(2, '0');
        const d = String(parts[2]).padStart(2, '0');
        pDate = `${y}-${m}-${d}`;
      }
    }
    if (!pujasByDate[pDate]) {
      pujasByDate[pDate] = [];
    }
    pujasByDate[pDate].push(p);
  });

  const todayIso = toIsoDateString(new Date());

  // --- DYNAMIC CALCULATIONS LINKED TO CALENDAR SELECTION & TODAY ---
  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  
  // 1. All Pujas in currently selected calendar month (e.g. Aug 2026)
  const monthPujas = pujas.filter(p => {
    let pDate = p.date;
    if (pDate && pDate.includes('-')) {
      const parts = pDate.split('-');
      if (parts.length === 3) {
        pDate = `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`;
      }
    }
    return pDate.startsWith(currentMonthPrefix);
  });

  // 2. Upcoming Pujas (Date still not came: date >= today)
  const upcomingPujas = pujas
    .filter(p => p.date >= todayIso)
    .sort((a, b) => a.date.localeCompare(b.date));

  // 3. Completed Pujas (Pujas Maharaj already did: date < today)
  const completedPujas = pujas
    .filter(p => p.date < todayIso)
    .sort((a, b) => b.date.localeCompare(a.date));

  // 4. Pujas in current week
  const now = new Date();
  const currentDayOfWeek = now.getDay();
  const sundayOfThisWeek = new Date(now);
  sundayOfThisWeek.setDate(now.getDate() - currentDayOfWeek);
  const saturdayOfThisWeek = new Date(sundayOfThisWeek);
  saturdayOfThisWeek.setDate(sundayOfThisWeek.getDate() + 6);

  const sundayIso = toIsoDateString(sundayOfThisWeek);
  const saturdayIso = toIsoDateString(saturdayOfThisWeek);

  const thisWeekPujas = pujas.filter(p => p.date >= sundayIso && p.date <= saturdayIso);

  // Determine filtered list based on active category card
  let activeFilteredList = monthPujas;
  let activeCategoryTitle = `Pujas in ${monthNames[month]} ${year}`;

  if (activeFilterPeriod === 'upcoming') {
    activeFilteredList = upcomingPujas;
    activeCategoryTitle = `Upcoming Pujas (Date Still to Come)`;
  } else if (activeFilterPeriod === 'completed') {
    activeFilteredList = completedPujas;
    activeCategoryTitle = `Completed Pujas (Performed by Maharaj)`;
  } else if (activeFilterPeriod === 'week') {
    activeFilteredList = thisWeekPujas;
    activeCategoryTitle = `Pujas Scheduled This Week`;
  } else if (activeFilterPeriod === 'month') {
    if (selectedWeekSubFilter === 'w1') {
      activeFilteredList = monthPujas.filter(p => Number(p.date.slice(8, 10)) <= 7);
      activeCategoryTitle = `${monthNames[month]} ${year} - Week 1 (1st to 7th)`;
    } else if (selectedWeekSubFilter === 'w2') {
      activeFilteredList = monthPujas.filter(p => {
        const day = Number(p.date.slice(8, 10));
        return day >= 8 && day <= 14;
      });
      activeCategoryTitle = `${monthNames[month]} ${year} - Week 2 (8th to 14th)`;
    } else if (selectedWeekSubFilter === 'w3') {
      activeFilteredList = monthPujas.filter(p => {
        const day = Number(p.date.slice(8, 10));
        return day >= 15 && day <= 21;
      });
      activeCategoryTitle = `${monthNames[month]} ${year} - Week 3 (15th to 21st)`;
    } else if (selectedWeekSubFilter === 'w4') {
      activeFilteredList = monthPujas.filter(p => Number(p.date.slice(8, 10)) >= 22);
      activeCategoryTitle = `${monthNames[month]} ${year} - Week 4 (22nd to end)`;
    }
  }

  const selectedDatePujas = selectedDateStr ? (pujasByDate[selectedDateStr] || []) : [];

  return (
    <div style={{ position: 'relative', paddingBottom: '70px' }}>
      {/* Calendar Card Container */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: '24px' }}>
        
        {/* Top Month & Year Controls Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid var(--border-color)', gap: '8px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card-hover)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '3px 8px', gap: '4px', position: 'relative' }}>
            <button
              onClick={handlePrevMonth}
              style={{ background: 'none', border: 'none', padding: '6px', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
              title="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Custom Month Picker Button */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  setShowMonthDropdown(!showMonthDropdown);
                  setShowYearDropdown(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  color: 'var(--primary-orange)',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  borderRadius: '8px'
                }}
                title="Select Month"
              >
                <span>{monthNames[month]}</span>
                <ChevronDown size={14} color="var(--primary-orange)" />
              </button>

              {/* Custom Month Dropdown Menu */}
              {showMonthDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '110px',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    background: 'var(--bg-card)',
                    border: '2px solid var(--primary-orange)',
                    borderRadius: '14px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    padding: '4px'
                  }}
                >
                  {monthNames.map((mName, mIdx) => {
                    const isSelected = mIdx === month;
                    return (
                      <button
                        key={mName}
                        type="button"
                        onClick={() => {
                          setCurrentDate(new Date(year, mIdx, 1));
                          setSelectedWeekSubFilter('all');
                          setShowMonthDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '7px 4px',
                          textAlign: 'center',
                          border: 'none',
                          borderRadius: '8px',
                          background: isSelected ? 'var(--primary-orange)' : 'transparent',
                          color: isSelected ? '#ffffff' : 'var(--text-main)',
                          fontWeight: isSelected ? '800' : '600',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          display: 'block',
                          marginBottom: '2px'
                        }}
                      >
                        {mName}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Custom Year Picker Button */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  setShowYearDropdown(!showYearDropdown);
                  setShowMonthDropdown(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  borderRadius: '8px'
                }}
                title="Select Year"
              >
                <span>{year}</span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {/* Custom 10-Item Visible Height Scrollable Year Picker Dropdown (1900 to 2100) */}
              {showYearDropdown && (
                <div
                  ref={yearScrollRef}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '105px',
                    height: '240px', // Exact ~8-10 visible items in height!
                    maxHeight: '240px',
                    overflowY: 'auto',
                    background: 'var(--bg-card)',
                    border: '2px solid var(--primary-orange)',
                    borderRadius: '14px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    padding: '4px',
                    scrollBehavior: 'smooth'
                  }}
                >
                  {allYearsList.map((yNum) => {
                    const isSelected = yNum === year;
                    return (
                      <button
                        key={yNum}
                        id={`year-item-${yNum}`}
                        type="button"
                        onClick={() => {
                          setCurrentDate(new Date(yNum, month, 1));
                          setSelectedWeekSubFilter('all');
                          setShowYearDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '7px 4px',
                          textAlign: 'center',
                          border: 'none',
                          borderRadius: '8px',
                          background: isSelected ? 'var(--primary-orange)' : 'transparent',
                          color: isSelected ? '#ffffff' : 'var(--text-main)',
                          fontWeight: isSelected ? '800' : '600',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          display: 'block',
                          marginBottom: '2px'
                        }}
                      >
                        {yNum}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={handleNextMonth}
              style={{ background: 'none', border: 'none', padding: '6px', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
              title="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button
            onClick={handleToday}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              border: '1.5px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontWeight: '800',
              fontSize: '0.8rem',
              cursor: 'pointer',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            TODAY
          </button>
        </div>

        {/* Days of Week Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-color)', textAlign: 'center', background: 'var(--bg-card-hover)', fontWeight: '800', fontSize: '0.82rem' }}>
          <div style={{ color: '#ef4444', padding: '12px 4px' }}>SUN</div>
          <div style={{ color: 'var(--text-muted)', padding: '12px 4px' }}>MON</div>
          <div style={{ color: 'var(--text-muted)', padding: '12px 4px' }}>TUE</div>
          <div style={{ color: 'var(--text-muted)', padding: '12px 4px' }}>WED</div>
          <div style={{ color: 'var(--text-muted)', padding: '12px 4px' }}>THU</div>
          <div style={{ color: 'var(--text-muted)', padding: '12px 4px' }}>FRI</div>
          <div style={{ color: '#3b82f6', padding: '12px 4px' }}>SAT</div>
        </div>

        {/* Calendar Day Cells Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border-color)' }}>
          {calendarCells.map((cell, idx) => {
            const dayPujas = pujasByDate[cell.dateIso] || [];
            const isToday = cell.dateIso === todayIso;
            const isSelected = cell.dateIso === selectedDateStr;
            const dayOfWeek = idx % 7;
            const isSun = dayOfWeek === 0;
            const isSat = dayOfWeek === 6;

            return (
              <div
                key={cell.dateIso + '-' + idx}
                onClick={() => {
                  setSelectedDateStr(cell.dateIso);
                }}
                style={{
                  background: isSelected ? 'rgba(249, 115, 22, 0.12)' : 'var(--bg-card)',
                  minHeight: '85px',
                  padding: '8px 6px',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                  outline: isSelected ? '2.5px solid var(--primary-orange)' : 'none',
                  outlineOffset: '-2.5px',
                  zIndex: isSelected ? 5 : 1
                }}
                className="calendar-day-cell"
              >
                {/* Date Number Badge */}
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: '800',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: (isToday || isSelected) ? 'var(--primary-orange)' : 'transparent',
                      color: (isToday || isSelected)
                        ? '#ffffff'
                        : !cell.isCurrentMonth
                        ? '#cbd5e1'
                        : isSun
                        ? '#ef4444'
                        : isSat
                        ? '#3b82f6'
                        : 'var(--text-main)'
                    }}
                  >
                    {cell.dayNumber}
                  </span>
                </div>

                {/* Golden Dots for Pujas */}
                {dayPujas.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px', alignItems: 'center' }}>
                    {dayPujas.map((p, pIdx) => (
                      <span
                        key={p.id || pIdx}
                        title={`${p.clientName} - ${p.pujaName}`}
                        style={{
                          width: '9px',
                          height: '9px',
                          borderRadius: '50%',
                          background: '#f59e0b',
                          boxShadow: '0 0 6px rgba(245, 158, 11, 0.7)',
                          display: 'inline-block'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- POPUP MODAL DRAWER (High-Res Viewport Fixed Center Overlay) --- */}
      {selectedDateStr && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setSelectedDateStr(null)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              width: '100%',
              maxWidth: '440px',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              border: '1.5px solid var(--border-color)',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              zIndex: 1000000,
              color: 'var(--text-main)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-orange)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarIcon size={24} color="var(--primary-orange)" />
                  <span>{formatDate(selectedDateStr)}</span>
                </h3>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {selectedDatePujas.length} {selectedDatePujas.length === 1 ? 'Puja Scheduled' : 'Pujas Scheduled'}
                </span>
              </div>

              <button
                onClick={() => setSelectedDateStr(null)}
                style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* List of Pujas on this date (NO Kharch, Only View Details) */}
            {selectedDatePujas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 16px', background: 'var(--bg-card-hover)', borderRadius: '16px', marginBottom: '20px', border: '1px dashed var(--border-color)' }}>
                <Clock size={36} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                <p style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem' }}>No Pujas Booked on this Date</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Click below to book a new Puja for {formatDate(selectedDateStr)}!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {selectedDatePujas.map((p) => {
                  return (
                    <div
                      key={p.id}
                      style={{
                        background: 'var(--bg-card-hover)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <h4 style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-main)' }}>{p.clientName}</h4>
                          <span style={{ fontSize: '0.88rem', color: 'var(--primary-orange)', fontWeight: '700' }}>{p.pujaName}</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', background: 'var(--royal-blue-light)', color: 'var(--royal-blue)', padding: '4px 10px', borderRadius: '8px', fontWeight: '800' }}>
                          {p.bhudevs.length} {p.bhudevs.length === 1 ? 'Pandit' : 'Pandits'}
                        </span>
                      </div>

                      {/* Clean View Details Action (NO Kharch section) */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                        <button
                          className="btn-secondary"
                          onClick={() => {
                            setSelectedDateStr(null);
                            onSelectPuja(p);
                          }}
                          style={{ fontSize: '0.85rem', padding: '6px 14px', fontWeight: '800', color: 'var(--royal-blue)', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Eye size={16} />
                          <span>View Details &rarr;</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Book New Puja Button for this date */}
            <button
              onClick={() => {
                const targetDate = selectedDateStr;
                setSelectedDateStr(null);
                onBookPujaOnDate(targetDate);
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', fontWeight: '800', borderRadius: '14px' }}
            >
              <Plus size={20} />
              <span>Book New Puja for {formatDate(selectedDateStr)}</span>
            </button>
          </div>
        </div>
      )}

      {/* --- DYNAMIC CALENDAR COUNTER & SCHEDULE ANALYTICS SYSTEM --- */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', padding: '20px', boxShadow: 'var(--shadow-md)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--primary-orange)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Dynamic Schedule Analytics</h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tap cards to view Pujas</span>
        </div>

        {/* 4 Dynamic Counter Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '16px' }}>
          
          {/* Card 1: SELECTED MONTH (e.g. Aug 2026) */}
          <div
            onClick={() => { setActiveFilterPeriod('month'); setSelectedWeekSubFilter('all'); }}
            style={{
              background: activeFilterPeriod === 'month' ? 'rgba(249, 115, 22, 0.15)' : 'var(--bg-card-hover)',
              border: activeFilterPeriod === 'month' ? '2px solid var(--primary-orange)' : '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>
              {monthNames[month]} {year}
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-orange)', marginTop: '4px' }}>
              {monthPujas.length} <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{monthPujas.length === 1 ? 'Puja' : 'Pujas'}</span>
            </div>
          </div>

          {/* Card 2: UPCOMING PUJAS (Date Still to Come) */}
          <div
            onClick={() => setActiveFilterPeriod('upcoming')}
            style={{
              background: activeFilterPeriod === 'upcoming' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card-hover)',
              border: activeFilterPeriod === 'upcoming' ? '2px solid #3b82f6' : '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Upcoming</span>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#3b82f6', marginTop: '4px' }}>
              {upcomingPujas.length} <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{upcomingPujas.length === 1 ? 'Puja' : 'Pujas'}</span>
            </div>
          </div>

          {/* Card 3: COMPLETED PUJAS (Maharaj Did) */}
          <div
            onClick={() => setActiveFilterPeriod('completed')}
            style={{
              background: activeFilterPeriod === 'completed' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card-hover)',
              border: activeFilterPeriod === 'completed' ? '2px solid var(--accent-emerald)' : '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Completed</span>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '4px' }}>
              {completedPujas.length} <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{completedPujas.length === 1 ? 'Puja' : 'Pujas'}</span>
            </div>
          </div>

          {/* Card 4: THIS WEEK */}
          <div
            onClick={() => setActiveFilterPeriod('week')}
            style={{
              background: activeFilterPeriod === 'week' ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-card-hover)',
              border: activeFilterPeriod === 'week' ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>This Week</span>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#8b5cf6', marginTop: '4px' }}>
              {thisWeekPujas.length} <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{thisWeekPujas.length === 1 ? 'Puja' : 'Pujas'}</span>
            </div>
          </div>

        </div>

        {/* Week Sub-filter Pills for Month */}
        {activeFilterPeriod === 'month' && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px', padding: '10px', background: 'var(--bg-card-hover)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', marginRight: '4px' }}>
              Week Filters ({monthNames[month]}):
            </span>
            <button
              onClick={() => setSelectedWeekSubFilter('all')}
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                border: selectedWeekSubFilter === 'all' ? '1.5px solid var(--primary-orange)' : '1px solid var(--border-color)',
                background: selectedWeekSubFilter === 'all' ? 'var(--primary-orange)' : 'var(--bg-card)',
                color: selectedWeekSubFilter === 'all' ? '#ffffff' : 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              All Month ({monthPujas.length})
            </button>

            <button
              onClick={() => setSelectedWeekSubFilter('w1')}
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                border: selectedWeekSubFilter === 'w1' ? '1.5px solid var(--primary-orange)' : '1px solid var(--border-color)',
                background: selectedWeekSubFilter === 'w1' ? 'var(--primary-orange)' : 'var(--bg-card)',
                color: selectedWeekSubFilter === 'w1' ? '#ffffff' : 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Week 1 (1-7)
            </button>

            <button
              onClick={() => setSelectedWeekSubFilter('w2')}
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                border: selectedWeekSubFilter === 'w2' ? '1.5px solid var(--primary-orange)' : '1px solid var(--border-color)',
                background: selectedWeekSubFilter === 'w2' ? 'var(--primary-orange)' : 'var(--bg-card)',
                color: selectedWeekSubFilter === 'w2' ? '#ffffff' : 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Week 2 (8-14)
            </button>

            <button
              onClick={() => setSelectedWeekSubFilter('w3')}
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                border: selectedWeekSubFilter === 'w3' ? '1.5px solid var(--primary-orange)' : '1px solid var(--border-color)',
                background: selectedWeekSubFilter === 'w3' ? 'var(--primary-orange)' : 'var(--bg-card)',
                color: selectedWeekSubFilter === 'w3' ? '#ffffff' : 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Week 3 (15-21)
            </button>

            <button
              onClick={() => setSelectedWeekSubFilter('w4')}
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                border: selectedWeekSubFilter === 'w4' ? '1.5px solid var(--primary-orange)' : '1px solid var(--border-color)',
                background: selectedWeekSubFilter === 'w4' ? 'var(--primary-orange)' : 'var(--bg-card)',
                color: selectedWeekSubFilter === 'w4' ? '#ffffff' : 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Week 4 (22-31)
            </button>
          </div>
        )}

        {/* Filtered Period Pujas List Header */}
        <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--royal-blue)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={16} color="var(--royal-blue)" />
          <span>{activeCategoryTitle} ({activeFilteredList.length})</span>
        </h4>

        {/* Filtered Period Pujas Cards */}
        {activeFilteredList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 16px', background: 'var(--bg-card-hover)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>No Pujas match this filter criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeFilteredList.map((p) => {
              const isPast = p.date < todayIso;

              return (
                <div
                  key={p.id}
                  style={{
                    background: 'var(--bg-card-hover)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-main)' }}>{p.clientName}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--primary-orange)', fontWeight: '700' }}>{p.pujaName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>📅 {formatDate(p.date)}</span>
                      {isPast ? (
                        <span style={{ color: 'var(--accent-emerald)', fontWeight: '700', background: 'rgba(16, 185, 129, 0.12)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.72rem' }}>
                          ✓ Completed
                        </span>
                      ) : (
                        <span style={{ color: '#3b82f6', fontWeight: '700', background: 'rgba(59, 130, 246, 0.12)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.72rem' }}>
                          ⏳ Upcoming
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.78rem', background: 'var(--royal-blue-light)', color: 'var(--royal-blue)', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>
                      {p.bhudevs.length} {p.bhudevs.length === 1 ? 'Pandit' : 'Pandits'}
                    </span>
                    <button
                      className="btn-secondary"
                      onClick={() => onSelectPuja(p)}
                      style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button (+) */}
      <button
        onClick={() => onBookPujaOnDate(selectedDateStr || todayIso)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary-saffron), var(--primary-orange))',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(234, 88, 12, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 90,
          transition: 'transform 0.2s ease, boxShadow 0.2s ease'
        }}
        className="floating-add-btn"
        title="Book New Puja"
      >
        <Plus size={32} color="#ffffff" strokeWidth={2.5} />
      </button>
    </div>
  );
}
