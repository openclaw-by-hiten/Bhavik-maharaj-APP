# 🚩 Bhavik Maharaj - Puja Expense & Bhudev Tracker

A modern, high-performance, offline-first Web Application custom-designed for **Bhavik Maharaj** to effortlessly manage Puja bookings, client payments, samagri expenses, Bhudev (Pandit) Dakshina, and customer referral analytics.

---

## ✨ Features & Highlights

- 🎨 **Auspicious Spiritual Design System**: Built using a curated, vibrant palette of Saffron Bhagwa Orange (`#ea580c`), Sacred Haldi Gold (`#ca8a04`), Royal Blue (`#1e40af`), and crisp white card containers with smooth glassmorphic dark mode support.
- 📱 **Mobile & Desktop Responsive**: Fully optimized bottom action navigation bar for mobile devices, adaptive card grids, and responsive controls bar.
- 🔒 **Offline-First & Persistent Data**: Powered by browser IndexedDB with `navigator.storage.persist()` protection against aggressive phone storage clearers. Works 100% offline without needing an active internet connection.
- 👥 **Clients Directory View**: Centralized client history tab with read-only online view for past Puja records, lifetime total spend tracking, and WhatsApp breakdown sharing.
- 🕉️ **Bhudev (Pandit) Dakshina Manager**: Auto-calculates Bhudev count (`Auto +1` per Pandit added) and tracks individual Dakshina amounts alongside Samagri expenses.
- 🏆 **Customer Referral Analytics**: Ranks pre-registered clients based on **distinct new persons referred** to Bhavik Maharaj.
- 🏷️ **Dynamic Custom Puja Tag Manager**: Type any custom Puja name and press `Enter` to create quick-select tags. Delete individual tags using the `×` button. Saved permanently in `localStorage`.
- 📅 **Universal `DD-MM-YYYY` Date Standard**: Uniform date formatting across all views, modals, and export summaries.
- 📲 **One-Click WhatsApp & Backup Export**: Instantly export a formatted Puja expense summary directly to WhatsApp or download full JSON backup files for safe keeping.

---

## 🏗️ Architecture & Component Overview

```
puja-expense-manager/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Header branding, theme toggle & backup modal launcher
│   │   ├── PujaCard.jsx             # Puja booking card with balance status & quick actions
│   │   ├── PujaForm.jsx             # Comprehensive Puja booking modal with dynamic tags
│   │   ├── ExpenseItem.jsx          # Samagri/Petrol/Food item expense logger
│   │   ├── BhudevList.jsx           # Auto-calculated Bhudev/Pandit Dakshina manager
│   │   ├── SummaryPieChart.jsx      # Recharts expense visual breakdown & Bhudev list
│   │   ├── ClientDirectory.jsx      # Read-only customer history & lifetime spend tracker
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
- **Local Database**: LocalForage (IndexedDB key-value store)
- **Styling**: Vanilla CSS (CSS Custom Properties & Media Queries)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Execution

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
This application is created for **Bhavik Maharaj Puja Expense & Bhudev Tracker**. All rights reserved.
