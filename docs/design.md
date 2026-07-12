# การออกแบบระบบ (System Design)

## 1. สถาปัตยกรรมระบบเชิงเทคนิค (3-Tier Technical Architecture)

### Presentation Layer (หน้าบ้าน)
พัฒนาด้วย React 19 SPA + Tailwind CSS 4 ทำงานร่วมกับ LocalStorage สำหรับเก็บข้อมูลตะกร้าสินค้าและรายการโปรดแบบชั่วคราว ใช้ TanStack Query (React Query) จัดการ data fetching, caching, และ background refetching เพื่อให้ข้อมูลอัปเดตอัตโนมัติ

### Application Layer (หลังบ้าน)
พัฒนาด้วย Node.js + Express (TypeScript) เป็น REST API Server โดยแบ่งเอนจินภายในเป็น:
- **Compatibility Engine**: กรองสินค้าตามข้อมูลรถยนต์ (ยี่ห้อ/รุ่น/เจเนอเรชัน/เครื่องยนต์)
- **Order Processor**: ควบคุม checkout flow ตรวจสอบสต็อก ตัดสต็อก สร้างคำสั่งซื้อ (Prisma Transaction)
- **Stats Engine**: รวบรวมข้อมูลยอดขาย/รายงานจาก Order/Product tables

### Data Storage Layer (ฐานข้อมูล)
ใช้ PostgreSQL (Cloud Database) ผ่าน Prisma ORM ในการจัดเก็บข้อมูลถาวรทั้งหมด ได้แก่ ข้อมูลสินค้า สต็อก ข้อมูลรถยนต์ คำสั่งซื้อ รีวิว คูปอง และการตั้งค่าร้าน

---

## 2. การออกแบบเส้นทางการใช้งานแยกตามบทบาท (Role-Based Feature Flow)

การควบคุมการเข้าถึงฟังก์ชันแบ่งตามส่วนของแอปพลิเคชัน:

### ส่วนลูกค้า (Customer Interface — `/`)
สามารถเข้าถึงฟังก์ชัน:
- ค้นหาและกรองสินค้า + Compatibility Checker
- ดูรายละเอียดสินค้า/รีวิว
- จัดการตะกร้า + สั่งซื้อ (Guest Checkout)
- ติดตามคำสั่งซื้อด้วยเบอร์โทร
- ดูโปรโมชั่น/Flash Sale

### ส่วนหลังบ้าน (Admin Dashboard — `/admin/*`)
เข้าถึงได้เฉพาะผู้ดูแลระบบ:
- Dashboard ภาพรวมยอดขาย
- CRUD สินค้า/หมวดหมู่/แบรนด์
- จัดการคำสั่งซื้อ/สถานะ
- จัดการข้อมูลรถยนต์ (Vehicle Taxonomy)
- จัดการคูปอง/Flash Sale
- ดูรายงาน/สถิติ
- ตั้งค่าระบบ/Maintenance Mode

---

## 3. การออกแบบโครงสร้างข้อมูล (Database Design)

### Entity Relationship

```
Category (1) ←→ (N) Product
Brand (1) ←→ (N) Product
Product (1) ←→ (N) ProductCompatibility
Product (1) ←→ (N) Review
Product (1) ←→ (N) OrderItem
Order (1) ←→ (N) OrderItem
VehicleBrand (1) ←→ (N) VehicleModel
VehicleModel (1) ←→ (N) VehicleGeneration
```

### ตารางข้อมูลหลัก

| ตาราง | หน้าที่ | ฟิลด์หลัก |
|-------|---------|-----------|
| Product | สินค้า | name, nameEn, slug, price, stock, sku, specs(JSON), images[], rating |
| Category | หมวดหมู่ | name, nameEn, slug, icon, image |
| Brand | แบรนด์ | name, slug, logo, country |
| Order | คำสั่งซื้อ | orderNumber, customer, phone, total, status, paymentMethod, paymentStatus |
| OrderItem | รายการสินค้าในออเดอร์ | orderId, productId, quantity, priceEach |
| Review | รีวิวสินค้า | productId, userName, rating, comment, images[] |
| Coupon | คูปองส่วนลด | code, type(percent/fixed), value, active, usageLimit, expiresAt |
| ProductCompatibility | ความเข้ากันได้ | productId, brand, model, generation, years, engine |
| VehicleBrand | ยี่ห้อรถ | name (unique) |
| VehicleModel | รุ่นรถ | name, vehicleBrandId |
| VehicleGeneration | เจเนอเรชัน | name, years, engines[], vehicleModelId |
| StoreSettings | ตั้งค่าร้าน (Singleton) | storeName, contactEmail, currency, maintenanceMode |

### Enums

| Enum | ค่า |
|------|-----|
| OrderStatus | pending, processing, shipped, delivered, cancelled |
| PaymentStatus | pending, paid, refunded |
| CouponType | percent, fixed |

---

## 4. API Design

Base URL: `http://localhost:4000/api`

| Method | Endpoint | หน้าที่ |
|--------|----------|---------|
| GET | /products | ดึงรายการสินค้า (รองรับ filter, sort, search, pagination) |
| GET | /products/:slug | ดึงรายละเอียดสินค้า |
| POST | /products | สร้างสินค้าใหม่ |
| PUT | /products/:id | แก้ไขสินค้า |
| DELETE | /products/:id | ลบสินค้า (409 ถ้ามีออเดอร์) |
| GET | /categories | ดึงหมวดหมู่ทั้งหมด |
| POST | /categories | สร้างหมวดหมู่ |
| PUT | /categories/:id | แก้ไขหมวดหมู่ |
| DELETE | /categories/:id | ลบหมวดหมู่ (409 ถ้ามีสินค้า) |
| GET | /brands | ดึงแบรนด์ทั้งหมด |
| POST | /brands | สร้างแบรนด์ |
| PUT | /brands/:id | แก้ไขแบรนด์ |
| DELETE | /brands/:id | ลบแบรนด์ (409 ถ้ามีสินค้า) |
| GET | /vehicles | ดึงข้อมูลรถยนต์ (hierarchy) |
| POST | /vehicles/brands | สร้างยี่ห้อรถ |
| POST | /vehicles/models | สร้างรุ่นรถ |
| POST | /vehicles/generations | สร้างเจเนอเรชัน |
| GET | /orders | ดึงคำสั่งซื้อ (filter by status/phone) |
| POST | /orders | สร้างคำสั่งซื้อ (checkout + ตัดสต็อก) |
| PATCH | /orders/:id/status | อัปเดตสถานะ |
| GET | /reviews | ดึงรีวิว |
| POST | /reviews | สร้างรีวิว (+ อัปเดต rating สินค้า) |
| GET | /coupons | ดึงคูปอง |
| POST | /coupons | สร้างคูปอง |
| GET | /stats/dashboard | ข้อมูล Dashboard |
| GET | /stats/reports | รายงานธุรกิจ |
| GET | /settings | ดึงการตั้งค่าร้าน |
| PUT | /settings | อัปเดตการตั้งค่า |
