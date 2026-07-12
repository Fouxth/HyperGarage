# CSI 204 Workshop 4

> **65007912 นายภัทรพิสิฏ ทองเกิด** | กลุ่ม T002

---

## 3. การพัฒนาระบบและการทดสอบ (System Development & Testing)

กระบวนการพัฒนาระบบ HyperGarage ดำเนินตามวงจรการพัฒนาซอฟต์แวร์แบบระบบ (SDLC) โดยมุ่งเน้นการเขียนโค้ดที่มีระเบียบ มีการบริหารความเสี่ยงด้านประสิทธิภาพ และทดสอบระบบอย่างเป็นขั้นเป็นตอน

### 3.1 ชุดเทคโนโลยีที่เลือกใช้และเหตุผล (Technology Stack & Rationale)

- **Frontend (ส่วนหน้าบ้าน):** ใช้ React 19 SPA ร่วมกับ Vite 6 และ Tailwind CSS 4 เพื่อการแสดงผลที่รวดเร็ว ลื่นไหล มี Hot Module Replacement (HMR) ช่วยให้พัฒนาได้ไว ใช้ TanStack Query สำหรับ data fetching และ caching อัตโนมัติ ลด request ซ้ำ
- **Backend (ส่วนหลังบ้าน):** ใช้ Node.js + Express (TypeScript) เพื่อสร้าง REST APIs ข้อดีของ TypeScript คือให้ความสามารถด้าน Type Safety ป้องกันข้อผิดพลาดของข้อมูลตั้งแต่ระดับเขียนโค้ด (Compile-time) ใช้ Prisma ORM สำหรับ type-safe database queries
- **Database (ระบบฐานข้อมูล):** ใช้งาน PostgreSQL (Cloud Database) ผ่าน Prisma ORM เนื่องจากเป็น Relational Database ที่เหมาะสำหรับการเก็บข้อมูลที่มีความสัมพันธ์ซับซ้อน เช่น การเชื่อมโยงข้อมูลรถยนต์กับอะไหล่ที่เข้ากันได้

### 3.2 กระบวนการทำงานร่วมกัน (Git & Development Workflow)

นำกระบวนการบริหารสาขาโค้ด (Branching Strategy) มาใช้ในการพัฒนา โดยตั้งชื่อสาขาเป็น feature/[task-slug] เสมอ มีการป้องกันไม่ให้แก้ไขสาขาหลัก main โดยตรง และมีการตรวจสอบความถูกต้องก่อนจะรวมโค้ด (Merge) เสมอ ใช้ Conventional Commits สำหรับรูปแบบ commit message

### 3.3 การจัดการความเสี่ยงด้านประสิทธิภาพ (Risk & Performance Management)

เพื่อป้องกันปัญหาระบบหน่วงช้าจากการเรียกดึงข้อมูลบ่อยๆ จึงได้ออกแบบระบบดังนี้:

- **TanStack Query Caching:** ตั้งค่า staleTime และ gcTime ให้เหมาะสม ลดการเรียก API ซ้ำโดยไม่จำเป็น ข้อมูลที่ไม่เปลี่ยนบ่อย (เช่น หมวดหมู่, แบรนด์) จะ cache ไว้นานกว่าข้อมูลที่เปลี่ยนบ่อย (เช่น สต็อกสินค้า)
- **Vite Proxy:** ใช้ proxy สำหรับ development เพื่อหลีกเลี่ยงปัญหา CORS โดย Frontend (port 5174) จะ proxy API requests ไปยัง Backend (port 4000) โดยอัตโนมัติ
- **Lazy Loading:** ทุกหน้าใช้ React.lazy() + Suspense เพื่อ code-splitting ลดขนาด initial bundle
- **Prisma Transactions:** ใช้ interactive transactions สำหรับ atomic operations เช่น การสร้างคำสั่งซื้อ (สร้าง Order + OrderItems + ตัดสต็อก ในขั้นตอนเดียว)

### 3.4 แนวทางการทดสอบระบบ (Testing Approach)

ดำเนินการทดสอบด้วยวิธี User Acceptance Testing (UAT) โดยมี Test Case จำลองการใช้งานตามบทบาท (Actors) ทั้งหมด เช่น:

- **UAT-01 (ลูกค้า):** จำลองการใช้ Compatibility Checker เลือกรถ Honda Civic EK แล้วตรวจสอบว่าระบบแสดงเฉพาะอะไหล่ที่เข้ากันได้ จากนั้นทดสอบ Guest Checkout สั่งซื้อสินค้าแล้วตรวจสอบว่าสต็อกถูกหักถูกต้อง
- **UAT-02 (แอดมิน):** ทดสอบการเพิ่ม/แก้ไข/ลบสินค้าในหน้า Admin Panel ทดสอบการอัปเดตสถานะคำสั่งซื้อ และตรวจสอบความถูกต้องของรายงานยอดขายบน Dashboard
- **UAT-03 (ระบบ):** ทดสอบ Maintenance Mode เปิด/ปิด, ทดสอบลบสินค้าที่มีออเดอร์แล้ว (ต้อง 409 Conflict), ทดสอบ Responsive Design บนทุกขนาดจอ
