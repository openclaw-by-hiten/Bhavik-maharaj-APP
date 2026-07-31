// Date Formatter Helper for PanditJi / Bhavik Maharaj App
// Ensures all dates are formatted as DD-MM-YYYY

export function formatDate(dateStr) {
  if (!dateStr) return '';
  
  // Handle YYYY-MM-DD
  if (typeof dateStr === 'string') {
    const cleanStr = dateStr.split('T')[0];
    const parts = cleanStr.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      const [year, month, day] = parts;
      return `${day}-${month}-${year}`;
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
  } catch (e) {
    // Return original if parsing fails
  }

  return dateStr;
}
