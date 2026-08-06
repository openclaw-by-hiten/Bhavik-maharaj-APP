// Date Formatter Helper for PanditJi / Bhavik Maharaj App
// Ensures all dates are formatted strictly as DD-MM-YYYY across all screens, cards, modals, and exports

export function formatDate(dateStr) {
  if (!dateStr) return '';
  
  if (typeof dateStr === 'string') {
    const cleanStr = dateStr.split('T')[0].trim();
    const parts = cleanStr.split('-');
    
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD -> DD-MM-YYYY
        const [year, month, day] = parts;
        return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
      } else if (parts[2].length === 4) {
        // Already DD-MM-YYYY -> DD-MM-YYYY
        const [day, month, year] = parts;
        return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
      }
    }
  }

  // Handle Date object or timestamp
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    }
  } catch (e) {}

  return dateStr;
}
