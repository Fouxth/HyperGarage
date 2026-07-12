# CSI 204 Workshop 4

> **65007912 นายภัทรพิสิฏ ทองเกิด** | กลุ่ม T002

---

## 2. การออกแบบระบบ (System Design)

การออกแบบระบบ HyperGarage ถูกแบ่งออกเป็น 3 ส่วนหลักตามมาตรฐาน เพื่อรับประกันประสิทธิภาพ ความปลอดภัย และการรองรับการขยายตัว (Scalability) ในอนาคต

### 2.1 สถาปัตยกรรมระบบเชิงเทคนิค (3-Tier Technical Architecture)

- **Presentation Layer (หน้าบ้าน):** พัฒนาด้วย React 19 SPA + Tailwind CSS 4 ทำงานร่วมกับ TanStack Query สำหรับ caching และ state management ฝั่ง Client ใช้ React Router สำหรับ client-side navigation แบบ SPA
- **Application Layer (หลังบ้าน):** พัฒนาด้วย Node.js + Express API Server บน TypeScript โดยแบ่งเอนจินภายในเป็น:
  - **Compatibility Engine:** ตรวจจับเงื่อนไขยี่ห้อรถ รุ่น เจเนอเรชัน และรหัสเครื่องยนต์ กรองสินค้าที่เข้ากันได้
  - **Order Processor:** ควบคุมกระบวนการสั่งซื้อ ตัดสต็อก คำนวณราคา/ส่วนลด แบบ Atomic Transaction
  - **Review Aggregator:** คำนวณคะแนนเฉลี่ยรีวิวแบบ real-time พร้อม Transaction สำหรับ concurrent writes
- **Data Storage Layer (ฐานข้อมูล):** ใช้งาน PostgreSQL (Cloud Database) ผ่าน Prisma ORM ในการจัดเก็บข้อมูลถาวรทั้งหมด เช่น ข้อมูลสินค้า ข้อมูลรถยนต์ คำสั่งซื้อ รีวิว และคูปอง

### 2.2 การออกแบบเส้นทางการใช้งานแยกตามบทบาท (Role-Based Feature Flow)

การควบคุมการเข้าถึงฟังก์ชันถูกออกแบบตามบทบาทผู้ใช้งาน (Role-Based Access Control) โดยแบ่งออกเป็น 2 กลุ่มหลัก:

- **ส่วนลูกค้า (Customer Interface):** สามารถเข้าถึงฟังก์ชันค้นหาสินค้า, ใช้ Compatibility Checker, เพิ่มสินค้าลงตะกร้า, สั่งซื้อแบบ Guest Checkout, ติดตามออเดอร์, และเขียนรีวิวสินค้าได้โดยตรง
- **ส่วนหลังบ้าน (Admin Dashboard):** จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ เข้าถึงได้ผ่านหน้า Admin Panel แยกต่างหาก สามารถจัดการสินค้า, คำสั่งซื้อ, ข้อมูลรถยนต์, คูปอง, ดูรายงาน, และตั้งค่าระบบ

### 2.3 การออกแบบโครงสร้างข้อมูล (Database Design)

มีการออกแบบตารางข้อมูลหลักจำนวน 11 models ผ่าน Prisma Schema ได้แก่:

- **Product, Category, Brand:** ข้อมูลสินค้า หมวดหมู่ และแบรนด์ มีความสัมพันธ์แบบ Many-to-One
- **VehicleBrand → VehicleModel → VehicleGeneration:** ข้อมูลรถยนต์แบบ Hierarchical (ยี่ห้อ → รุ่น → เจเนอเรชัน/เครื่องยนต์)
- **ProductCompatibility:** ตารางเชื่อมความเข้ากันได้ระหว่างสินค้ากับเจเนอเรชันรถยนต์ (Many-to-Many)
- **Order, OrderItem:** คำสั่งซื้อและรายการสินค้าในออเดอร์ มี Enum สำหรับ OrderStatus (pending, confirmed, shipped, delivered, cancelled) และ PaymentStatus
- **Review:** รีวิวสินค้าจากลูกค้า ผูกกับ Product
- **Coupon:** คูปองส่วนลด รองรับ CouponType แบบ percentage และ fixed
- **StoreSettings:** ตั้งค่าร้านค้า (ชื่อร้าน, ค่าจัดส่ง, Maintenance Mode)

### 2.4 การออกแบบ API Endpoints

| Method | Endpoint | หน้าที่ |
|--------|----------|--------|
| GET | /api/products | ดึงรายการสินค้าทั้งหมด (รองรับ filter ตามรถยนต์) |
| GET | /api/products/:id | ดึงรายละเอียดสินค้า |
| POST | /api/products | สร้างสินค้าใหม่ |
| PUT | /api/products/:id | แก้ไขสินค้า |
| DELETE | /api/products/:id | ลบสินค้า |
| GET | /api/categories | ดึงหมวดหมู่ทั้งหมด |
| GET | /api/brands | ดึงแบรนด์ทั้งหมด |
| GET | /api/orders | ดึงคำสั่งซื้อ (filter ตามเบอร์โทร) |
| POST | /api/orders | สร้างคำสั่งซื้อใหม่ |
| PATCH | /api/orders/:id/status | อัปเดตสถานะคำสั่งซื้อ |
| GET | /api/reviews/recent | ดึงรีวิวล่าสุด |
| POST | /api/reviews | สร้างรีวิวใหม่ |
| GET | /api/stats/dashboard | ดึงข้อมูลสรุป Dashboard |
| GET | /api/vehicle-brands | ดึงข้อมูลยี่ห้อรถ (Cascading) |
| GET | /api/settings | ดึงตั้งค่าร้าน |
| PUT | /api/settings | อัปเดตตั้งค่าร้าน |
| GET | /api/health | Health Check |
