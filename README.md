# 🚩 Bhavik Maharaj - Puja Expense, Calendar & Bhudev Tracker

A modern, high-performance, offline-first Web Application custom-designed for **Bhavik Maharaj** to effortlessly manage Puja bookings, interactive monthly calendar schedules, client payments, samagri expenses, Bhudev (Pandit) Dakshina, Yajman dues, and customer referral analytics.

---

## ✨ Features & Highlights

- 🎨 **Auspicious Spiritual Design System**: Built using a curated, vibrant palette of Saffron Bhagwa Orange (`#ea580c`), Sacred Haldi Gold (`#ca8a04`), Royal Blue (`#1e40af`), and crisp white card containers with smooth glassmorphic dark mode support.
- 🌸 **Sacred Pothi & Morpankh Logo**: High-definition transparent circular emblem featuring the Sacred Pothi (book), Garland, and Peacock Feather (`/bhavik-logo.png`).
- 📅 **Interactive Puja Calendar System**:
  - **Month & Year Selectors**: Includes custom 10-item height scrollable Year Picker (`1900` to `2100`) and Month Picker.
  - **Golden Dots (`🟡`)**: Visually indicates scheduled Pujas on date cells (multiple golden dots for multiple Pujas on the same day).
  - **Popup Modal Drawer**: Tapping any date cell opens a popup modal listing booked Pujas with a `👁️ View Details` action and a `+ Book New Puja for DD-MM-YYYY` button.
- 📊 **Dynamic Schedule Analytics**:
  - Automatically linked to active calendar month selection (**Selected Month**, **Upcoming Pujas**, **Completed Pujas (Maharaj Did)**, **This Week**).
  - Week-by-week sub-filters (**Week 1**, **Week 2**, **Week 3**, **Week 4**).
- 🏷️ **Automatic Status Badges**:
  - 🟢 **`✓ Completed`**: Automatically badges past Pujas where the date has passed.
  - 🔵 **`⏳ Upcoming`**: Automatically badges future scheduled Pujas.
- 👥 **Yajman Directory & Itemized Dues Accounting**:
  - Calculates Baki and Earned Dakshina 100% individually per Puja (preventing profit from one Puja from offsetting unpaid debt of another Puja).
  - Itemized per-Puja breakdowns for **Bhudev Kharch**, **Yajman Baki (Due Amount)**, and **Total Earned Dakshina**.
  - Embedded **Referral Analytics** subtab ranking clients based on distinct new persons referred.
- 🕉️ **Bhudev (Pandit) Dakshina Manager**: Auto-calculates Bhudev count (`Auto +1` per Pandit added) and tracks individual Dakshina amounts alongside Samagri expenses.
- 📅 **Universal `DD-MM-YYYY` Date Standard**: Enforced strictly across all views, modals, pickers, WhatsApp summaries, and backup files.
- 🔒 **Offline-First & Persistent Data**: Powered by IndexedDB with `navigator.storage.persist()` protection. Works 100% offline.
- 📲 **One-Click WhatsApp & Backup Export**: Instantly export a formatted Puja expense summary directly to WhatsApp or download full JSON backup files.

---

## 🏗️ Architecture & Component Overview

```
puja-expense-manager/
├── public/
│   └── bhavik-logo.png              # HD transparent circular sacred logo
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Header branding, theme toggle & backup launcher
│   │   ├── PujaCalendar.jsx         # Interactive monthly calendar with dynamic analytics & popup modal
│   │   ├── PujaCard.jsx             # Puja card with automatic Completed/Upcoming badges
│   │   ├── PujaForm.jsx             # Puja booking form with dynamic tag manager & DD-MM-YYYY date picker
│   │   ├── ExpenseItem.jsx          # Samagri & Misc expense logger (Pooja Samagri, Bhudev Dakshina, Misc)
│   │   ├── BhudevList.jsx           # Auto-calculated Bhudev/Pandit Dakshina manager
│   │   ├── SummaryPieChart.jsx      # Recharts expense visual breakdown & Bhudev list
│   │   ├── ClientDirectory.jsx      # Yajman Directory, itemized dues accounting & Referral Analytics
│   │   ├── ReferralLeaderboard.jsx  # Distinct person referral ranking leaderboard
│   │   └── ExportModal.jsx          # JSON backup export and restore tool
│   ├── services/
│   │   ├── storageService.js        # IndexedDB storage layer with persistence lock
│   │   └── exportService.js         # WhatsApp formatted text generator & JSON file exporter
│   ├── utils/
│   │   └── formatters.js            # Centralized DD-MM-YYYY date formatting helper
│   ├── styles/
│   │   └── index.css                # Master CSS design system, CSS variables & media queries
│   ├── App.jsx                      # Root router, tab state & main dashboard view
│   └── main.jsx                     # Application entry point
├── package.json
└── README.md
```

---

## 🛠️ Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Icons**: Lucide React
- **Data Visualization**: Recharts (PieChart & Responsive Container)
- **Image Processing**: Sharp (for logo circular cropping)
- **Local Database**: LocalForage (IndexedDB key-value store)
- **Styling**: Vanilla CSS (CSS Custom Properties & Media Queries)

---

## 🚀 Getting Started Locally

```bash
# 1. Clone the repository
git clone https://github.com/openclaw-by-hiten/Bhavik-maharaj-APP.git

# 2. Navigate to project directory
cd Bhavik-maharaj-APP

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Build production bundle
npm run build
```

---

## 📄 License
This application is custom-created for **Bhavik Maharaj Puja Expense, Calendar & Bhudev Tracker**. All rights reserved.
