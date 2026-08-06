# 🚩 Bhavik Maharaj - Puja Expense, Calendar & Bhudev Tracker

A modern, high-performance, offline-first Web Application custom-designed for **Bhavik Maharaj** to effortlessly manage Puja bookings, interactive monthly calendar schedules, client payments, samagri expenses, Bhudev (Pandit) Dakshina, Yajman dues, and customer referral analytics.

---

## ✨ Features & Highlights

- 🎨 **Auspicious Spiritual Design System**: Built using a curated, vibrant palette of Saffron Bhagwa Orange (`#ea580c`), Sacred Haldi Gold (`#ca8a04`), Royal Blue (`#1e40af`), and crisp white card containers with smooth glassmorphic dark mode support.
- 🌸 **Sacred Pothi & Morpankh Logo**: High-definition transparent circular emblem featuring the Sacred Pothi (book), Garland, and Peacock Feather (`/bhavik-logo.png`).
- 🕉️ **Centralized Bhudev (Pandit) Directory (`BhudevDirectory.jsx`)**:
  - **Auto-Population**: Pandits added when booking or editing a Puja are automatically registered into the directory.
  - **Smart Logic Matrix**:
    - 🟠 **`Pending Handover Due`**: Maharaj paid the Pandit out of his own pocket (`isPaid: true`), but the Yajman has NOT paid Maharaj yet.
    - 🔴 **`Pending Bhudev Payment (Pandit Unpaid)`**: Maharaj has NOT paid the Pandit yet (`isPaid: false`).
    - 🟢 **`Paid & Settled`**: Both the Yajman paid Maharaj AND Maharaj paid the Pandit.
  - **Interactive 1-Click Checkbox**: Tap **`[✓] Paid to Pandit (Settled)`** directly inside any Pandit's history timeline row to update payment status on the spot!
  - **In-Card Inline History Expansion**: Card expands smoothly right in place under your finger showing full timeline history and financial breakdowns.
- 👥 **Yajman Directory & Itemized Dues Accounting**:
  - Calculates Baki and Earned Dakshina 100% individually per Puja.
  - **Direct Edit Integration**: Each Puja card in a Yajman's history features an **`✏️ Edit Puja / Add Expenses`** button for instant edits.
  - Embedded **Referral Analytics** subtab ranking clients based on distinct new persons referred.
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
- 📦 **Smart Expense Item Entry (`ExpenseItem.jsx`)**:
  - **Auto-Default Name**: Leaving the item name blank auto-uses the selected category name (e.g. `Pooja Samagri: ₹4,500`).
  - 🎤 **Custom Item & Toggle Deselect**: Includes a `Custom Item` category pill with Mic icon and click-again toggle deselect feature.
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
│   │   ├── BhudevDirectory.jsx      # Centralized Bhudev Directory with 1-click checkbox & inline expansion
│   │   ├── ClientDirectory.jsx      # Yajman Directory, itemized dues accounting & Referral Analytics
│   │   ├── PujaCalendar.jsx         # Interactive monthly calendar with dynamic analytics & popup modal
│   │   ├── PujaCard.jsx             # Puja card with automatic Completed/Upcoming badges
│   │   ├── PujaForm.jsx             # Puja booking form with dynamic tag manager & DD-MM-YYYY date picker
│   │   ├── ExpenseItem.jsx          # Samagri & Misc expense logger (auto-name, Mic category & deselect)
│   │   ├── BhudevList.jsx           # Bhudev/Pandit manager with Paid to Pandit checkbox control
│   │   ├── SummaryPieChart.jsx      # Recharts expense visual breakdown & Bhudev list
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
