# HyperGarage

ระบบ E-Commerce สำหรับขายอะไหล่แต่งรถยนต์ระดับพรีเมียม พัฒนาด้วย React + TypeScript + Tailwind CSS

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

---

## Overview

HyperGarage เป็นแพลตฟอร์ม E-Commerce สำหรับจำหน่ายอะไหล่แต่งรถยนต์สมรรถนะสูง ออกแบบ UI/UX ในสไตล์พรีเมียม Dark Theme ที่ได้แรงบันดาลใจจาก Tesla, Porsche, Apple และ Stripe รองรับทั้งภาษาไทยและภาษาอังกฤษ

## Features

### Customer Website
- **Homepage** - Hero Banner, Compatibility Checker, Categories, Featured Products, Flash Sale พร้อม Countdown, Top Brands, Newsletter
- **Product Detail** - Gallery, Specifications, Compatibility Table, Reviews, Q&A, Related Products
- **Compatibility Checker** - เลือกยี่ห้อรถ > รุ่น > เจเนอเรชัน > ปี > เครื่องยนต์ เพื่อค้นหาอะไหล่ที่เข้ากันได้
- **i18n** - รองรับภาษาไทยและอังกฤษ สลับได้ทันที

### Admin Dashboard
- **Dashboard** - Revenue, Orders, Visitors, Customers พร้อมกราฟแนวโน้ม
- **Sales Overview** - Area Chart แสดงยอดขายรายเดือน
- **Category Sales** - Donut Chart แสดงสัดส่วนยอดขายตามหมวดหมู่
- **Product Management** - ตารางจัดการสินค้า พร้อม Search และ Filter
- **Order Management** - ตารางคำสั่งซื้อ พร้อม Status Filter
- **Low Stock Alert** - แจ้งเตือนสินค้าใกล้หมด
- **Latest Reviews & Notifications** - รีวิวล่าสุดและการแจ้งเตือน

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite 6 | Build Tool & Dev Server |
| Tailwind CSS 4 | Utility-first CSS |
| React Router 7 | Client-side Routing |
| Recharts | Charts & Data Visualization |
| Framer Motion | Animations |
| Lucide React | Icon Library |
| i18next | Internationalization (TH/EN) |

## Design System

| Token | Value |
|---|---|
| Primary | `#D6001C` |
| Background | `#0B0B0B` |
| Card | `#161616` |
| Border | `#2B2B2B` |
| Text | `#FFFFFF` |
| Muted | `#888888` |
| Font | Inter |

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, AdminSidebar, AdminHeader
│   └── ui/              # Button, Badge, Card, Select
├── pages/
│   ├── customer/        # HomePage, ProductPage
│   └── admin/           # DashboardPage
├── data/                # Mock data (products, categories, brands, vehicles)
├── i18n/                # Translations (en.ts, th.ts)
├── types/               # TypeScript interfaces
├── hooks/               # Custom hooks
└── lib/                 # Utilities
```

## Getting Started

### Prerequisites

- Node.js 20.19+ หรือ 22.12+
- npm

### Installation

```bash
git clone https://github.com/Fouxth/HyperGarage.git
cd HyperGarage
npm install
```

### Development

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173`

### Routes

| Path | Page |
|---|---|
| `/` | Customer Homepage |
| `/product/:slug` | Product Detail |
| `/admin` | Admin Dashboard |

### Build

```bash
npm run build
```

## Screenshots

### Customer Homepage
- Hero Banner พร้อม Gradient Background
- Compatibility Checker (ค้นหาอะไหล่ตามรุ่นรถ)
- Categories Grid, Featured Products, Flash Sale

### Admin Dashboard
- Stats Cards พร้อม Trend Indicators
- Sales Overview Chart & Category Donut Chart
- Product Management Table & Order Management

## Compatibility Database

รองรับข้อมูลรถยนต์:

| Brand | Models |
|---|---|
| Honda | Civic (FD, FB, FC, FK8, FL5), Jazz (GE, GK), Accord (G8, G9, G10) |
| Toyota | 86 (ZN6, ZN8), Supra (A90), GR Yaris |
| Subaru | WRX STI (VAB), BRZ (ZC6, ZD8) |
| Nissan | 370Z (Z34), GT-R (R35) |
| Mazda | MX-5 (ND), Mazda 3 (BP) |

## License

MIT
