// Export & WhatsApp Share Utilities
import { formatDate } from '../utils/formatters';

export function exportBackupJSON(pujas) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pujas, null, 2));
  const downloadAnchor = document.createElement('a');
  const fileName = `Bhavik_Maharaj_Puja_Backup_${formatDate(new Date().toISOString().slice(0,10))}.json`;
  
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function generateWhatsAppSummary(puja) {
  const totalExpense = puja.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalBhudevDakshina = puja.bhudevs.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const grandTotalSpent = totalExpense + totalBhudevDakshina;
  
  let msg = `*🚩 BHAVIK MAHARAJ PUJA EXPENSE SUMMARY 🚩*\n`;
  msg += `------------------------------------\n`;
  msg += `*Client Name:* ${puja.clientName}\n`;
  msg += `*Puja Title:* ${puja.pujaName}\n`;
  msg += `*Date:* ${formatDate(puja.date)}\n`;
  if (puja.referredBy && puja.referredBy !== 'Added by Me (Direct)') {
    msg += `*Referred By:* ${puja.referredBy}\n`;
  }
  msg += `------------------------------------\n`;

  if (puja.isPrepaid) {
    msg += `*Prepaid Advance Received:* ₹${Number(puja.prepaidAmount || 0).toLocaleString('en-IN')}\n`;
  } else {
    msg += `*Prepaid Advance:* None (Direct Payment)\n`;
  }

  msg += `\n*📦 EXPENSES LIST:* \n`;
  puja.expenses.forEach((item, idx) => {
    msg += `${idx + 1}. ${item.name} (${item.category}): ₹${Number(item.amount).toLocaleString('en-IN')}\n`;
  });

  if (puja.bhudevs.length > 0) {
    msg += `\n*🕉️ BHUDEV / PANDIT DAKSHINA (${puja.bhudevs.length} Pandits):*\n`;
    puja.bhudevs.forEach((b, idx) => {
      msg += `${idx + 1}. ${b.name}: ₹${Number(b.amount).toLocaleString('en-IN')}\n`;
    });
  }

  msg += `------------------------------------\n`;
  msg += `*Total Expenses + Dakshina:* ₹${grandTotalSpent.toLocaleString('en-IN')}\n`;

  if (puja.isPrepaid) {
    const diff = Number(puja.prepaidAmount || 0) - grandTotalSpent;
    if (diff >= 0) {
      msg += `*✅ Remaining Balance (Refund/Carry forward):* ₹${diff.toLocaleString('en-IN')}\n`;
    } else {
      msg += `*⚠️ Additional Balance Due from Client:* ₹${Math.abs(diff).toLocaleString('en-IN')}\n`;
    }
  }

  msg += `\n_Generated via Bhavik Maharaj App (Offline Protected)_`;

  const encoded = encodeURIComponent(msg);
  return `https://api.whatsapp.com/send?text=${encoded}`;
}
