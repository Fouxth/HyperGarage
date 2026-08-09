# HyperGarage (ไฮเปอร์การาจ)

> **แพลตฟอร์มอีคอมเมิร์ซสำหรับจำหน่ายอะไหล่แต่งเครื่องยนต์สายซิ่ง/แดร็กสไตล์ไทย พร้อมระบบตรวจสอบความเข้ากันได้ของอะไหล่กับรถยนต์**
> (HyperGarage: Full-Stack E-Commerce Platform for Thai Racing/Drag Engine Parts with Vehicle Compatibility Checker)

---

## 📋 ภาพรวมโครงการ (Project Overview)

โครงการ **HyperGarage** พัฒนาขึ้นเพื่อแก้ไขปัญหาของผู้ใช้ในวงการแต่งรถที่ไม่แน่ใจว่าอะไหล่ชิ้นใดใช้ได้กับรถยนต์ยี่ห้อ/รุ่น/เครื่องยนต์ของตนบ้าง (Vehicle Compatibility) และความยุ่งยากในการค้นหา เปรียบเทียบ และสั่งซื้ออะไหล่แต่งเครื่องยนต์จากหลายแบรนด์ในที่เดียว โครงงานนี้สร้างระบบตรวจสอบความเข้ากันได้ (Compatibility Checker) พร้อมกับฟังก์ชันอีคอมเมิร์ซครบวงจร (ตะกร้า สั่งซื้อแบบ Guest Checkout รีวิวสินค้า) และระบบจัดการหลังบ้านสำหรับผู้ดูแลร้าน (จัดการสินค้า คำสั่งซื้อ สต็อก คูปอง และรายงานสรุปที่คำนวณจากข้อมูลจริงในฐานข้อมูล) โดยเชื่อมต่อฐานข้อมูล PostgreSQL จริงตลอดทั้งระบบ ไม่มีข้อมูลจำลอง (mock data) หลงเหลืออยู่

### 🔗 เอกสารโครงการ (Project Documentation Links)

* **Repository URL:** `https://github.com/Fouxth/HyperGarage`
* **เอกสารข้อกำหนดความต้องการซอฟต์แวร์มาตรฐาน IEEE 830 (SRS):** [docs/Software_Requirements_Specification_SRS.md](./docs/Software_Requirements_Specification_SRS.md) / [public/SRS.md](./public/SRS.md)
* **คัมภีร์ข้อมูลเชิงลึกทางเทคนิคและแนวทางตอบคำถามสอบ (Master Technical Reference):** [docs/master_technical_reference.md](./docs/master_technical_reference.md)
* **รายงานสรุปการทำ Workshop และลำดับการพัฒนาระบบ (Workshops Log):** [docs/project_workshops.md](./docs/project_workshops.md)
* **หน้าแสดงเอกสาร SRS Interactive บนเว็บ:** [https://fouxth.github.io/HyperGarage/srs.html](https://fouxth.github.io/HyperGarage/srs.html)

---

## 🛠️ โครงสร้างของโครงการ (Project Structure)

```plaintext
HyperGarage/
├── .gitignore               # ไฟล์สำหรับระบุสิ่งที่ Git จะไม่นำไปติดตาม (เช่น node_modules, .env)
├── README.md                # ไฟล์นี้ (ภาพรวมโครงการและลิงก์เอกสาร)
├── index.html               # HTML entry point ของ React SPA (Vite)
├── src/                      # โค้ด Frontend (React + TypeScript)
│   ├── api/                  # API client (fetch wrapper) + React Query hooks
│   ├── components/           # Header, Footer, Layout, ProductCard และ component ที่ใช้ร่วมกัน
│   ├── context/               # CartContext, WishlistContext (เก็บสถานะใน localStorage)
│   ├── pages/
│   │   ├── customer/          # หน้าฝั่งลูกค้า (11 หน้า)
│   │   └── admin/              # หน้าฝั่งแอดมิน (18 หน้า)
│   ├── i18n/                  # ไฟล์แปลภาษา (th.ts, en.ts)
│   └── types/                  # TypeScript interfaces
├── server/                    # โค้ด Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── routes/             # products, categories, brands, vehicles, orders, reviews, coupons, settings, stats
│   │   └── index.ts             # จุดเริ่มต้นของ Express server
│   └── prisma/
│       ├── schema.prisma        # Schema ฐานข้อมูล PostgreSQL (Product, Order, Review, VehicleBrand ฯลฯ)
│       └── seed-data.ts          # ข้อมูลตั้งต้นสำหรับ seed เข้าฐานข้อมูลจริง
└── public/
    ├── SRS.md                  # เอกสารวิเคราะห์และออกแบบระบบ (System Requirement Specification)
    └── srs.html                 # หน้าแสดงเอกสาร SRS แบบ Interactive (เรนเดอร์ SRS.md ด้วย marked.js + mermaid.js)
```

---

## 🚀 เครื่องมือและเทคโนโลยีหลัก (Technologies)

* **Frontend:** React 19 + TypeScript, Vite 6, Tailwind CSS 4, React Router 7, TanStack Query (React Query), Framer Motion, i18next
* **Backend:** Node.js + Express (TypeScript)
* **Database:** PostgreSQL จริง (คลาวด์) เชื่อมต่อผ่าน Prisma ORM — ไม่มีการจำลองข้อมูลด้วย LocalStorage/JSON ฝั่งแบ็กเอนด์
* **Documentation Tools:** Markdown, HTML5, `marked.js` (Markdown Parser), `mermaid.js` (Diagram Drawing)

---

## ⚙️ การติดตั้งและใช้งาน (Getting Started)

```bash
git clone https://github.com/Fouxth/HyperGarage.git
cd HyperGarage

# ติดตั้ง frontend
npm install

# ติดตั้ง backend
cd server
npm install
```

ตั้งค่าฐานข้อมูลโดยสร้างไฟล์ `server/.env` (ไม่ commit เข้า git):

```
DATABASE_URL="postgresql://user:password@host:5432/dbname"
PORT=4000
```

รัน migration และ seed ข้อมูลตั้งต้น แล้วเปิด 2 terminal เพื่อรันทั้งสองฝั่ง:

```bash
# Terminal 1 — Backend API (http://localhost:4000)
cd server
npx prisma migrate dev
npm run prisma:seed
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
npm run dev
```

---

## 🧑‍💻 สมาชิกทีมผู้พัฒนา

* `65007912 นายภัทรพิสิฏ ทองเกิด`
