# CareConnect — AI Healthcare & Telemedicine Ecosystem

A full-featured healthcare appointment booking and management platform built with React.

## Features

- **Authentication** — Login, Register, Forgot Password (localStorage-based with JSONPlaceholder fallback)
- **Dashboard** — Summary stats, upcoming appointments, quick actions, recent activity
- **Doctor Booking** — Doctor search/filter, weekly/monthly calendar, slot selection, Formik-validated booking form, reschedule support
- **Patient Check-In** — OTP verification, queue status with live position, digital token with QR
- **Prescription** — Medicine form with autocomplete, digital signature pad, PDF export (jsPDF + html2canvas)
- **Billing & Payment** — Multi-method payment (Cash/Card/UPI/Net Banking/Insurance), invoice generation, printable invoice template
- **Booking History** — Searchable/filterable appointment table, patient details modal
- **Notifications** — Categorized notifications with read/unread state
- **Reports & Analytics** — Weekly booking charts, consultation mode distribution, department/doctor stats
- **AI Chat Assistant** — Floating chat widget with rule-based healthcare responses

## Tech Stack

- **React 18** with Vite
- **Redux Toolkit** + Redux Saga
- **React Router v6** (protected/public route guards)
- **Formik** + Yup validation
- **MUI Icons** + Lucide React
- **SCSS** (per-component) + Tailwind CSS 4
- **jsPDF** + html2canvas (PDF generation)
- **Vitest** + Testing Library

## Folder Structure

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── setupTests.js
├── components/
│   ├── features/
│   │   └── ChatAssistant/
│   │       ├── ChatAssistant.jsx
│   │       └── ChatAssistant.scss
│   └── layout/
│       ├── Header/
│       │   ├── Header.jsx
│       │   └── Header.scss
│       ├── Layout/
│       │   ├── Layout.jsx
│       │   └── Layout.scss
│       └── Sidebar/
│           ├── Sidebar.jsx
│           └── Sidebar.scss
├── constants/
│   └── index.js
├── data/
│   └── doctors.js
├── pages/
│   ├── BillingPaymentPage/
│   │   ├── BillingPaymentPage.jsx
│   │   └── BillingPaymentPage.scss
│   ├── BookingHistoryPage/
│   │   ├── BookingHistoryPage.jsx
│   │   └── BookingHistoryPage.scss
│   ├── ChatAssistantPage/
│   │   ├── ChatAssistantPage.jsx
│   │   └── ChatAssistantPage.scss
│   ├── DashboardPage/
│   │   ├── DashboardPage.jsx
│   │   └── DashboardPage.scss
│   ├── DoctorBookingPage/
│   │   ├── DoctorBookingPage.jsx
│   │   └── DoctorBookingPage.scss
│   ├── ForgotPasswordPage/
│   │   ├── ForgotPasswordPage.jsx
│   │   └── ForgotPasswordPage.scss
│   ├── GeneratePrescriptionPage/
│   │   ├── GeneratePrescriptionPage.jsx
│   │   └── GeneratePrescriptionPage.scss
│   ├── LoginPage/
│   │   ├── LoginPage.jsx
│   │   └── LoginPage.scss
│   ├── NotificationsPage/
│   │   ├── NotificationsPage.jsx
│   │   └── NotificationsPage.scss
│   ├── PatientCheckInPage/
│   │   ├── PatientCheckInPage.jsx
│   │   └── PatientCheckInPage.scss
│   ├── RegisterPage/
│   │   ├── RegisterPage.jsx
│   │   └── RegisterPage.scss
│   └── ReportsPage/
│       ├── ReportsPage.jsx
│       └── ReportsPage.scss
├── redux/
│   ├── index.js
│   ├── store.js
│   ├── reducers/
│   │   └── index.js
│   ├── sagas/
│   │   ├── index.js
│   │   ├── authSaga.js
│   │   └── bookingSaga.js
│   ├── selectors/
│   │   ├── index.js
│   │   ├── authSelectors.js
│   │   └── bookingSelectors.js
│   └── slices/
│       ├── authSlice.js
│       └── bookingSlice.js
├── routes/
│   ├── index.js
│   ├── routeConfig.js
│   ├── ProtectedRoute.jsx
│   └── PublicRoute.jsx
└── styles/
    └── App.scss
```

## Routes

| Path | Page | Access |
|------|------|--------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/forgot-password` | Forgot Password | Public |
| `/dashboard` | Dashboard | Protected |
| `/appointment` | Doctor Booking | Protected |
| `/checkin` | Patient Check-In | Protected |
| `/prescription` | Generate Prescription | Protected |
| `/billing` | Billing & Payment | Protected |
| `/booking-history` | Booking History | Protected |
| `/notifications` | Notifications | Protected |
| `/reports` | Reports & Analytics | Protected |
| `/chat-assistant` | AI Chat Assistant | Protected |

## Setup & Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build        # Vite production build
npm run preview      # Preview production build
npm run test         # Run tests with Vitest
```
