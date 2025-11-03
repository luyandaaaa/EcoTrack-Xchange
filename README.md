# ♻️ EcoTrack-Xchange

**EcoTrack-Xchange** is a full-featured web application for coordinating waste management across three main user roles — **citizens**, **collectors**, and **administrators**.  
The platform integrates **waste reporting**, **collection coordination**, **a recycling marketplace**, **gamification**, and **analytics** to drive community engagement and sustainable environmental practices.

---

## 🚀 Project Summary

EcoTrack-Xchange provides a centralized digital ecosystem for waste management through:

- 🏙️ **Citizen Portal:** Report waste, scan recyclable items using AI, engage in quizzes, earn rewards, and participate in recycling campaigns.  
- 🚛 **Collector Portal:** Manage assigned collection areas, log collections, track performance, and sell recyclables.  
- 🧭 **Admin Portal:** Oversee waste activity via a map dashboard, manage collectors and marketplace listings, launch campaigns, and analyze data trends.

> The app focuses on **AI-powered waste recognition**, **gamified sustainability**, and a **recycling marketplace** that rewards responsible environmental behavior.

---

## 📸 Demo & Screenshots

Here are a few key views of the EcoTrack-Xchange platform:

### 🏠 Landing Page
![Landing Page](/homepage.png)

## 👤 Citizen Dashboard
![Citizen Dashboard](/dashboard.png)
![Citizen Dashboard1](/dashzulu.png)


### 📱 Waste Reporting / Scanner
![Waste Reporting](/report.png)
![Scanner](/scanner.png)

### 📱 Marketplace
![market](/marketplace.png)

### 📱 Rewards
![rewards](/quiz.png)

## 🚛 Collector Portal
![Collector Dashboard](/collectordash.png)

### 📱 Assigned Areas
![areas](/assignedareas.png)

### 📱 collection 
![collection](/collection.png)

### 📱 Sell Recyclables
![sell](/sell.png)

### 📱 Collectors Perfomance Analytics
![perfomance](/perfomance.png)

## 🗺️ Admin Portal
![Admin Map](/admindash.png)

### 📱 Assign Collectors to Reports
![assign](/collectorsdash.png)

### 📱 Dashboard Analytics
![admin](/dashanalyitics.png)

### 📱 Overview of Marketplace
![adminmarket](/dashmarketplace.png)

### 📱 Creation of Campaigns
![campaign ](/campaigns.png)


---

## ⚙️ Tech Stack

| Category | Technology |
|-----------|-------------|
| **Framework** | [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) (with [Vite](https://vitejs.dev/)) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + Tailwind plugins (typography, animations) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + custom **shadcn-style** components (`components/ui/`) |
| **Routing** | [react-router-dom v6](https://reactrouter.com/) |
| **Data Fetching / Caching** | [@tanstack/react-query](https://tanstack.com/query) |
| **State Management** | React Context API (AuthContext + planned WasteContext) |
| **Localization** | [i18next](https://www.i18next.com/) / [react-i18next](https://react.i18next.com/) |
| **Maps** | [react-leaflet](https://react-leaflet.js.org/) + [leaflet.heat](https://github.com/Leaflet/Leaflet.heat) |
| **Package Manager** | npm / pnpm / yarn compatible |

---

## 📂 Project Structure
```
EcoTrack-Xchange/
│
├── public/
│ ├── demo/ # Project demo screenshots
│ └── robots.txt
│
├── src/
│ ├── App.tsx # Main app with routing + providers
│ ├── main.tsx # App bootstrap (includes i18n setup)
│ ├── i18n.ts # Localization configuration
│ │
│ ├── contexts/
│ │ ├── AuthContext.tsx # Mock auth (localStorage-based)
│ │ └── WasteContext.tsx # Placeholder for waste-related global state
│ │
│ ├── components/
│ │ ├── ProtectedRoute.tsx
│ │ ├── ui/ # shadcn-style reusable UI primitives
│ │ └── ... # Role-specific sidebars, dialogs, etc.
│ │
│ ├── pages/
│ │ ├── Landing.tsx
│ │ ├── NotFound.tsx
│ │ ├── citizen/
│ │ ├── collector/
│ │ └── admin/
│ │
│ ├── assets/ # Images, icons
│ └── styles/ # Tailwind + custom CSS
│
├── package.json
└── README.md
```

Installation
```
bash
git clone https://github.com/yourusername/EcoTrack-Xchange.git
cd EcoTrack-Xchange
npm install
```

Run (Development)
```
bash
npm run dev
Build (Production)
bash
npm run build
npm run preview
```

## 🧱 Planned Improvements
Implement backend API (Node.js / Supabase / Firebase)

AI-powered waste recognition (image classification)

Real-time updates (WebSockets)

Complete WasteContext

JWT-based authentication

Leaderboards and badges for gamification

## 🌱 Project Vision & Impact
EcoTrack-Xchange empowers citizens and municipal teams to collaborate in building cleaner, smarter cities.
By combining AI, data visualization, and gamified community participation, the platform helps:

Reduce illegal dumping

Promote recycling behavior

Improve data-driven waste planning

Enable circular economy initiatives

## 📄 License
This project is open-source and available under the MIT License.
