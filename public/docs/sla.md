# Service Level Agreement (SLA)
# HyperGarage E-Commerce Platform

เอกสารข้อตกลงระดับการให้บริการ (Service Level Agreement) สำหรับแพลตฟอร์ม HyperGarage ระบบ E-Commerce จำหน่ายอะไหล่แต่งรถยนต์

---

## 1. ภาพรวมบริการ

### 1.1 ขอบเขตบริการ

| รายการ | รายละเอียด |
|--------|-----------|
| ชื่อบริการ | HyperGarage E-Commerce Platform |
| ประเภท | ระบบ E-Commerce สำหรับจำหน่ายอะไหล่แต่งรถยนต์ |
| ผู้ให้บริการ | ทีมพัฒนา HyperGarage |
| ผู้รับบริการ | ลูกค้าที่เข้าใช้งานเว็บไซต์ และผู้ดูแลระบบ (Admin) |
| ช่องทางบริการ | เว็บไซต์ (Responsive Web Application) |
| ภาษาที่รองรับ | ไทย |

### 1.2 ส่วนประกอบของระบบ

| ส่วนประกอบ | เทคโนโลยี | หน้าที่ |
|-----------|----------|--------|
| Frontend | React 19 + Vite 6 + Tailwind CSS 4 | แสดงผลหน้าเว็บ, UX/UI |
| Backend API | Express + TypeScript + Prisma ORM | ประมวลผล Business Logic |
| Database | PostgreSQL (Cloud) | จัดเก็บข้อมูลสินค้า, คำสั่งซื้อ, รีวิว |
| Hosting | Cloud Server | รันแอปพลิเคชัน |

---

## 2. เป้าหมายระดับการให้บริการ (Service Level Objectives)

### 2.1 ความพร้อมใช้งาน (Availability)

| ระดับ | เป้าหมาย | Downtime สูงสุดต่อเดือน | หมายเหตุ |
|------|---------|----------------------|---------|
| ระบบหลัก (Website) | 99.5% | ~3.6 ชั่วโมง/เดือน | ไม่รวมช่วงบำรุงรักษาตามกำหนด |
| API Backend | 99.5% | ~3.6 ชั่วโมง/เดือน | ต้องตอบกลับทุก endpoint |
| ฐานข้อมูล | 99.9% | ~43 นาที/เดือน | Cloud-managed PostgreSQL |

### 2.2 ประสิทธิภาพ (Performance)

| ตัวชี้วัด | เป้าหมาย | วิธีวัด |
|----------|---------|--------|
| Page Load Time (หน้าแรก) | ≤ 3 วินาที | Lighthouse / WebPageTest |
| API Response Time (GET) | ≤ 500 มิลลิวินาที (p95) | JMeter / Bruno |
| API Response Time (POST) | ≤ 1,000 มิลลิวินาที (p95) | JMeter / Bruno |
| Time to First Byte (TTFB) | ≤ 800 มิลลิวินาที | Browser DevTools |
| Concurrent Users | ≥ 100 คนพร้อมกัน | JMeter Load Test |

### 2.3 ความถูกต้องของข้อมูล (Data Integrity)

| ตัวชี้วัด | เป้าหมาย |
|----------|---------|
| Order Accuracy | 100% — ทุกคำสั่งซื้อต้องบันทึกถูกต้อง |
| Stock Accuracy | ≥ 99% — สต็อกต้องตรงกับยอดจริงหลังหักคำสั่งซื้อ |
| Price Accuracy | 100% — ราคาที่แสดงต้องตรงกับราคาในฐานข้อมูล |

---

## 3. การดูแลรักษาและสนับสนุน

### 3.1 ช่วงเวลาบำรุงรักษาตามกำหนด (Scheduled Maintenance)

| รายการ | รายละเอียด |
|--------|-----------|
| วัน/เวลา | ทุกวันอังคาร 02:00 – 04:00 น. |
| แจ้งล่วงหน้า | อย่างน้อย 24 ชั่วโมง |
| ระยะเวลาสูงสุด | 2 ชั่วโมงต่อครั้ง |
| Maintenance Mode | ระบบแสดงหน้า "ปิดปรับปรุงชั่วคราว" อัตโนมัติ |

### 3.2 การจัดลำดับความรุนแรง (Severity Levels)

| ระดับ | คำอธิบาย | ตัวอย่าง | เวลาตอบรับ | เวลาแก้ไข |
|------|---------|---------|-----------|----------|
| Critical (P1) | ระบบล่มทั้งหมด, ไม่สามารถใช้งานได้ | Server down, Database ล่ม | ≤ 30 นาที | ≤ 4 ชั่วโมง |
| High (P2) | ฟีเจอร์หลักใช้งานไม่ได้ | ไม่สามารถสั่งซื้อ, ชำระเงินไม่ได้ | ≤ 1 ชั่วโมง | ≤ 8 ชั่วโมง |
| Medium (P3) | ฟีเจอร์รองมีปัญหา | รีวิวโหลดไม่ขึ้น, ตัวกรองไม่ทำงาน | ≤ 4 ชั่วโมง | ≤ 24 ชั่วโมง |
| Low (P4) | ปัญหาเล็กน้อย / ปรับปรุง UI | Typo, สีไม่ตรง, animation กระตุก | ≤ 24 ชั่วโมง | ≤ 1 สัปดาห์ |

---

## 4. การเฝ้าระวังและรายงาน (Monitoring & Reporting)

### 4.1 เครื่องมือเฝ้าระวัง

| เครื่องมือ | ตรวจสอบ | ความถี่ |
|-----------|--------|--------|
| Health Check API | `/api/health` — ตรวจสถานะ server + DB | ทุก 1 นาที |
| Error Logging | Console errors, API errors | Real-time |
| Performance Monitoring | Response time, throughput | ทุก 5 นาที |
| Uptime Monitoring | HTTP status code | ทุก 1 นาที |

### 4.2 รายงานประจำ

| รายงาน | ความถี่ | เนื้อหา |
|--------|--------|--------|
| Uptime Report | รายสัปดาห์ | % availability, downtime events |
| Performance Report | รายเดือน | Avg response time, p95, p99 |
| Incident Report | ตามเหตุการณ์ | Root cause, timeline, resolution |

---

## 5. นโยบายสำรองข้อมูล (Backup Policy)

| รายการ | รายละเอียด |
|--------|-----------|
| ประเภท | Full backup + Incremental backup |
| ความถี่ | Full backup ทุกวันอาทิตย์ 00:00 น., Incremental ทุก 6 ชั่วโมง |
| ระยะเก็บรักษา | 30 วัน |
| Recovery Time Objective (RTO) | ≤ 2 ชั่วโมง |
| Recovery Point Objective (RPO) | ≤ 6 ชั่วโมง |
| ทดสอบ Restore | ทุกเดือน |

---

## 6. ความปลอดภัย (Security)

| มาตรการ | รายละเอียด |
|---------|-----------|
| HTTPS/TLS | บังคับใช้ TLS 1.3 สำหรับทุก connection |
| Input Validation | ตรวจสอบ input ทุก endpoint ด้วย Zod/Prisma |
| SQL Injection Protection | ใช้ Prisma ORM (Parameterized queries) |
| XSS Protection | React auto-escaping + CSP headers |
| Rate Limiting | จำกัด 100 requests/นาที ต่อ IP |
| CORS | อนุญาตเฉพาะ domain ที่กำหนด |

---

## 7. เงื่อนไขและข้อยกเว้น

### 7.1 สิ่งที่ไม่รวมใน SLA

- ปัญหาจากฝั่งผู้ใช้ (เช่น เบราว์เซอร์ไม่รองรับ, อินเทอร์เน็ตช้า)
- เหตุสุดวิสัย (ภัยธรรมชาติ, ไฟดับ, Cloud provider ล่ม)
- การบำรุงรักษาตามกำหนดที่แจ้งล่วงหน้าแล้ว
- ปัญหาจาก Third-party services (Payment gateway, CDN)

### 7.2 เบราว์เซอร์ที่รองรับ

| เบราว์เซอร์ | เวอร์ชันขั้นต่ำ |
|------------|--------------|
| Google Chrome | 90+ |
| Mozilla Firefox | 88+ |
| Safari | 14+ |
| Microsoft Edge | 90+ |
| Mobile Chrome/Safari | Latest 2 versions |

---

## 8. การทบทวนและปรับปรุง SLA

| รายการ | รายละเอียด |
|--------|-----------|
| รอบการทบทวน | ทุก 6 เดือน |
| ผู้รับผิดชอบ | ทีมพัฒนา HyperGarage |
| เกณฑ์ปรับปรุง | หาก Availability ต่ำกว่า 99% ติดต่อกัน 2 เดือน |
| ช่องทางแจ้งเปลี่ยนแปลง | ประกาศผ่านหน้า Maintenance Mode |
