# คู่มือสรุปซอร์สโค้ดและโครงสร้างระบบ HyperGarage (ฉบับเตรียมพร้อมนำเสนออาจารย์)

เอกสารฉบับนี้รวบรวมคำอธิบายการทำงานของระบบ ฟังก์ชัน หลักการออกแบบ และสถาปัตยกรรมซอฟต์แวร์ทั้งฝั่ง **Backend (Node.js/Express)** และ **Frontend (React/Vite)** ของโปรเจกต์ **HyperGarage** ไว้อย่างครบถ้วน เพื่อใช้เป็นคู่มือตอบคำถามอาจารย์กรรมการระหว่างการนำเสนอ

---

## 1. ภาพรวมสถาปัตยกรรมระบบ (System Architecture)

ระบบ HyperGarage ถูกออกแบบตามสถาปัตยกรรม **Client-Server Architecture (Decoupled Single Page Application)** โดยแบ่งส่วนการทำงานชัดเจน:

- **Frontend:** พัฒนาด้วย **React 18**, **TypeScript**, **Vite** และ **TailwindCSS**
  - **State Management & Caching:** ใช้ **TanStack React Query (v5)** จัดการ Data Fetching / Caching / Invalidation และ **React Context API** สำหรับ Cart/Wishlist
  - **Icons & Animation:** ใช้ **Lucide React** และ **Framer Motion**
- **Backend:** พัฒนาด้วย **Node.js**, **Express.js (TypeScript)**
  - **ORM & Database:** ใช้ **Prisma ORM (v6)** เชื่อมต่อกับฐานข้อมูล **PostgreSQL**
  - **Authentication & Security:** ใช้ **JSON Web Tokens (JWT)** ร่วมกับ **Bcrypt** แฮชรหัสผ่าน และเพิ่มระบบ **Audit Log (บันทึกประวัติการทำงาน)**
  - **File Upload:** ใช้ **Multer** สำหรับอัปโหลดไฟล์รูปภาพสินค้า/รีวิว

---

## 2. โครงสร้างและการทำงานฝั่ง Backend (Server Functions & Routes)

### 2.1 โครงสร้างไฟล์และไฟล์หลัก (Core Files)

1. **[server/src/index.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/index.ts)**
   - **หน้าที่:** Entry Point หลักของเซิร์ฟเวอร์ Express
   - **ฟังก์ชันสำคัญ:**
     - โหลดตัวแปรสภาพแวดล้อมด้วย `dotenv/config`
     - ตั้งค่า Middleware ส่วนกลาง: `cors()`, `express.json()`, `express.static('uploads')`
     - ลงทะเบียน Router ทั้งหมดเข้ากับ Endpoint เช่น `/api/products`, `/api/orders`, `/api/auth`
     - เริ่มเปิดระบบให้ฟังคำขอที่พอร์ตที่กำหนด (`app.listen(port)`)

2. **[server/src/prisma.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/prisma.ts)**
   - **หน้าที่:** สร้างและส่งออก Singleton Instance ของ `PrismaClient`
   - **หลักการสำคัญ:** มีการใส่ `import 'dotenv/config'` ไว้ส่วนบนสุด เพื่อการันตีว่าค่า `DATABASE_URL` จาก `.env` ถูกโหลดก่อนที่ Prisma จะเริ่มเชื่อมต่อฐานข้อมูล PostgreSQL

3. **[server/src/lib/jwtSecret.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/lib/jwtSecret.ts)**
   - **หน้าที่:** บริหารจัดการคีย์ลับในการเข้ารหัส/ถอดรหัส JWT (`getJwtSecret()`)
   - **ความปลอดภัย:** หากเป็นโหมด `production` จะบังคับใช้ `process.env.JWT_SECRET` หากไม่มีจะขัดขวางการบูตเซิร์ฟเวอร์ทันที ส่วนโหมด `development` จะสุ่ม UUID ใหม่ต่อเซสชันเพื่อป้องกัน hardcoded credentials

4. **[server/src/lib/audit.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/lib/audit.ts)**
   - **ฟังก์ชัน `logAudit(actorId, actorName, action, entity, entityId)`:** บันทึกประวัติการกระทำสำคัญของพนักงานลงในตาราง `AuditLog` ใน PostgreSQL เช่น การเปลี่ยนสถานะออเดอร์, การอัปเดตคืนสินค้า, การปรับแก้สต็อก

5. **[server/src/lib/notify.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/lib/notify.ts)**
   - **ฟังก์ชัน `notify(type, message, entityId?)`:** สร้างแจ้งเตือนอัตโนมัติในระบบสำหรับพนักงาน เช่น มีออเดอร์ใหม่เข้า, สต็อกสินค้าต่ำ, มีรีวิวใหม่ หรือมีคำขอคืนสินค้า

---

### 2.2 ระบบความปลอดภัยและ Middleware (Middlewares)

1. **[authMiddleware.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/middlewares/authMiddleware.ts)**
   - **ฟังก์ชัน `authMiddleware`:** ตรวจสอบความถูกต้องของ JWT ของ **พนักงาน (Staff)**
   - **หลักการทำงาน:**
     - ดึง Token จาก Header `Authorization: Bearer <token>`
     - ถอดรหัสลับด้วย `jwt.verify`
     - **Database Re-verification:** Query ข้อมูลลงไปยังฐานข้อมูล `prisma.staff.findUnique` เพื่อตรวจสอบว่าพนักงานยังมีตัวตนในระบบ และไม่ถูกระงับสิทธิ์จริง ป้องกันการใช้ Token เก่าที่พนักงานถูกลบออกไปแล้ว

2. **[roleMiddleware.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/middlewares/roleMiddleware.ts)**
   - **ฟังก์ชัน `requireRole(allowedRoles)`:** ตรวจสอบบทบาทของพนักงาน (RBAC - Role Based Access Control)
   - **บทบาทในระบบ:** `SUPERADMIN`, `STOCK_STAFF`, `ORDER_STAFF` หากบทบาทของพนักงานไม่อยู่ใน `allowedRoles` จะตอบกลับ `403 Forbidden`

3. **[customerAuthMiddleware.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/middlewares/customerAuthMiddleware.ts)**
   - **ฟังก์ชัน `customerAuthMiddleware`:** ตรวจสอบความถูกต้องของ JWT ของ **ลูกค้าทั่วไป (Customer Account)** เพื่อเปิดใช้งานฟีเจอร์ส่วนตัว เช่น รายการที่ชอบ, ประวัติสั่งซื้อ, การเพิ่มที่อยู่

---

### 2.3 โมดูล API เส้นทางต่างๆ (API Routes Overview)

| ไฟล์ Route | หน้าที่และฟังก์ชันสำคัญ |
| :--- | :--- |
| **[products.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/routes/products.ts)** | **จัดการแคตตาล็อกสินค้า:** ดึงรายการสินค้าพร้อมตัวกรอง (ค้นหา, หมวดหมู่, แบรนด์, ช่วงราคา, รุ่นรถที่รองรับ), สร้าง/แก้ไข/ลบสินค้า, จัดการสต็อก, จัดการระบบ Flash Sale (`PATCH /:id/flash-sale`), และจัดการ Variant ของสินค้า (เช่น ขนาด/สี) |
| **[orders.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/routes/orders.ts)** | **ระบบคำสั่งซื้อและการชำระเงิน:** <br>• `POST /api/orders`: รับออเดอร์ (Checkout), ตรวจสอบความถูกต้องของข้อมูล (Input validation), คำนวณราคาสินค้ารวมจากฐานข้อมูลจริง, ตรวจสอบสต็อก และใช้ **Prisma Database Transaction (`prisma.$transaction`)** ในการตัดสต็อกสินค้าและสร้าง OrderItem พร้อมกันเพื่อความสมบูรณ์ของข้อมูล (ACID)<br>• `GET /api/orders`: ดูรายการสั่งซื้อ ป้องกันข้อมูลส่วนบุคคล (PII) โดยผู้ใช้ทั่วไปต้องระบุทั้ง `phone` และ `orderNumber` |
| **[vehicles.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/routes/vehicles.ts)** | **จัดการฐานข้อมูลความเข้ากันได้ของรถยนต์:** ดึงแผนผังยี่ห้อ/รุ่น/โฉม/เครื่องยนต์ (`GET /tree`), ป้องกันสิทธิ์การสร้างและลบข้อมูลรถเฉพาะ `SUPERADMIN` หรือ `STOCK_STAFF` |
| **[returns.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/routes/returns.ts)** | **ระบบคำขอคืนสินค้า:** สร้างคำขอคืนสินค้า (พร้อมยืนยันความเป็นเจ้าของออเดอร์จากเบอร์โทร/บัญชี), พนักงานอนุมัติ/ปฏิเสธคำขอคืนสินค้า ซึ่งหากอนุมัติจะคืนสต็อกเข้าตารางสินค้าให้อัตโนมัติใน Transaction |
| **[reviews.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/routes/reviews.ts)** | **ระบบรีวิวสินค้า:** ดึงและสร้างรีวิวสินค้า พร้อมคำนวณคะแนนดาวเฉลี่ย (`_avg.rating`) และจำนวนรีวิว (`_count`) ของสินค้านั้นๆ อัปเดตลงตาราง Product ทันที |
| **[account.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/routes/account.ts)** | **ระบบบัญชีลูกค้า:** การลงทะเบียนลูกค้าใหม่ (แฮชรหัสผ่านด้วย Bcrypt), เข้าสู่ระบบ, เปลี่ยนรหัสผ่าน, จัดการสมุดที่อยู่ส่งของ (`/addresses`) |
| **[auth.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/routes/auth.ts)** | **ระบบเข้าสู่ระบบของพนักงาน:** รับอีเมล/รหัสผ่าน ตรวจสอบด้วย `bcrypt.compare` และออก JWT Token พร้อมระบุ Role |
| **[staff.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/routes/staff.ts)** | **จัดการพนักงานในระบบ (เฉพาะ SuperAdmin):** สร้างบัญชีพนักงานใหม่, ปรับเปลี่ยนบทบาท, ปรับเปลี่ยนรหัสผ่าน, ลบบัญชีพนักงาน |
| **[customers.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/routes/customers.ts)** | **จัดการสิทธิ์ลูกค้าหลังบ้าน:** ดึงรายชื่อลูกค้า, ตรวจสอบยอดใช้จ่ายรวม (`totalSpent`), และการสั่งระงับสิทธิ์ใช้งาน (Ban Customer) |
| **[stats.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/routes/stats.ts)** | **ระบบแดชบอร์ดและรายงาน:** คำนวณสรุปยอดขายรวม, จำนวนออเดอร์, ยอดขายแยกตามเดือน, ยอดขายแยกตามประเภทการชำระเงิน, สินค้าขายดี 5 อันดับแรก |
| **[backup.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/routes/backup.ts)** | **สำรองข้อมูลระบบ:** ดึงข้อมูลทุกตารางในฐานข้อมูลออกมาเป็นไฟล์ JSON สำหรับดาวน์โหลดสำรองข้อมูล |
| **[upload.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/routes/upload.ts)** | **ระบบอัปโหลดรูปภาพ:** รับไฟล์รูปภาพผ่าน `multer` ตรวจสอบประเภทไฟล์ (image/*) และบันทึกลงโฟลเดอร์ `/uploads` |
| **[coupons.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/routes/coupons.ts)** | **จัดการคูปองส่วนลด:** สร้าง, แก้ไข, ลบ และตรวจสอบส่วนลดคูปองแบบเปอร์เซ็นต์หรือแบบจำนวนเงินคงที่ |
| **[settings.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/routes/settings.ts)** | **ตั้งค่าร้านค้า:** ปรับเปลี่ยนข้อมูลติดต่อร้านค้า, ข้อมูลบัญชีธนาคาร/PromptPay, และเปิด-ปิดโหมดปิดปรับปรุงร้าน (`maintenanceMode`) |

---

## 3. โครงสร้างและการทำงานฝั่ง Frontend (React & TypeScript)

### 3.1 การเชื่อมต่อ API และ State (Client & React Query)

1. **[src/api/client.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/src/api/client.ts)**
   - **หน้าที่:** API Layer กลาง รวมฟังก์ชัน `fetch` สำหรับส่ง HTTP Requests ไปยัง Backend
   - **ฟังก์ชันสำคัญ:**
     - `getHeaders()`: แนบ JWT Token ของพนักงานจาก `localStorage` อัตโนมัติ
     - `get<T>()` / `send<T>()`: Wrapper ครอบ `fetch()` ตรวจสอบ HTTP Status หากพบ `401 Unauthorized` จะทำการ Redirect ไปยังหน้าเข้าสู่ระบบอัตโนมัติ
     - `api.products`, `api.checkout`, `api.updateFlashSale` ฯลฯ: แมปปิ้งฟังก์ชันไปยัง Endpoint แต่ละเส้น

2. **[src/api/hooks.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/src/api/hooks.ts)**
   - **หน้าที่:** Custom React Query Hooks สำหรับดึงและอัปเดตข้อมูล
   - **หลักการสำคัญ:**
     - **Query Hooks (`useQuery`):** เช่น `useProducts()`, `useOrders()`, `useDashboardStats()`, `useNotifications()` โดยตั้งค่า `refetchInterval: 30000` ในการแจ้งเตือนเพื่ออัปเดตข้อมูลอัตโนมัติ
     - **Mutation Hooks (`useMutation`):** เช่น `useCheckout()`, `useUpdateFlashSale()`, `useCreateProduct()`
     - **Automatic Cache Invalidation:** เมื่อทำการ Mutation สำเร็จ จะเรียก `queryClient.invalidateQueries({ queryKey: [...] })` เพื่อล้างแคชเก่าและดึงข้อมูลใหม่มาแสดงผลทันทีโดยผู้ใช้ไม่ต้องกด Refresh หน้าเว็บ

3. **Context States:**
   - **[CartContext.tsx](file:///Users/pn/Desktop/Fouxth/HyperGarage/src/context/CartContext.tsx):** จัดการตะกร้าสินค้า (เพิ่มสินค้า, ปรับจำนวน, ลบสินค้า, บันทึกลง `localStorage`)
   - **[WishlistContext.tsx](file:///Users/pn/Desktop/Fouxth/HyperGarage/src/context/WishlistContext.tsx):** จัดการรายการสินค้าที่ชื่นชอบ

---

### 3.2 ฟังก์ชันและ Helper สำคัญในหน้า UI

1. **[HomePage.tsx - Flash Sale Countdown](file:///Users/pn/Desktop/Fouxth/HyperGarage/src/pages/customer/HomePage.tsx)**
   - **`useCountdown(targetDate)`:** คำนวณส่วนต่างเวลารหว่าง `targetDate.getTime()` กับ `Date.now()` ออกมาเป็น วัน (D), ชั่วโมง (H), นาที (M), และวินาที (S) โดยอัปเดต State ทุก 1 วินาทีด้วย `setInterval`
   - **การคำนวณ `target` วันสิ้นสุด:**
     - ดึง `flashSaleEnd` จากรายการสินค้า Flash Sale ในระบบ
     - คัดเลือกเฉพาะวันที่ในอนาคตที่เร็วที่สุด (`Math.min(...futureDates)`)
     - หากไม่มีวันที่ในอนาคตเหลืออยู่ จะแสดง `00:00:00:00` อย่างแม่นยำ

2. **[FlashSalePage.tsx - Admin Date/Time Picker](file:///Users/pn/Desktop/Fouxth/HyperGarage/src/pages/admin/FlashSalePage.tsx)**
   - **`isoToLocalString(isoString)`:** แปลงเวลา ISO String แบบ UTC จากเซิร์ฟเวอร์ ให้เป็นเวลาท้องถิ่น (Local TimeZone +7) สำหรับใส่ใน `<input type="datetime-local">` ป้องกันปัญหาเวลาคลาดเคลื่อน
   - **`getDefaultEndDate()`:** คำนวณวันสิ้นสุดเริ่มต้นล่วงหน้า 7 วัน (เวลา 23:59 น.) เพื่อความสะดวกแก่ผู้ดูแลระบบ
   - **`showPicker()` Trigger:** เมื่อคลิกที่ช่องตั้งเวลา จะเรียก `e.currentTarget.showPicker()` เปิด Popup ปฏิทินเลือกวัน-เวลาของเบราว์เซอร์ขึ้นมาทันที

3. **[formatters.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/src/lib/formatters.ts)**
   - **`formatPrice(price)`:** ฟอร์แมตตัวเลขราคาให้อยู่ในรูปแบบสกุลเงินไทย เช่น `฿15,900`

---

## 4. แนวทางการตอบคำถามอาจารย์กรรมการ (Presentation Q&A Cheat Sheet)

| คำถามที่อาจารย์มักจะถาม | แนวทางการตอบเชิงเทคนิค |
| :--- | :--- |
| **Q: ระบบจัดการความปลอดภัย (Authentication & Authorization) ทำอย่างไร?** | **A:** ใช้ระบบ **JWT (JSON Web Tokens)** ร่วมกับ **RBAC (Role-Based Access Control)** โดยฝั่ง Backend มี `authMiddleware` ที่ไม่ได้แค่ตรวจสอบ Signature ของ Token แต่ยังคิวรีเช็กข้อมูลพนักงานในฐานข้อมูล PostgreSQL ทุกครั้ง หากพนักงานถูกระงับสิทธิ์หรือลบออก จะปฏิเสธคำขอทันที และมี `requireRole` ป้องกันเส้นทางสำคัญแยกตามบทบาท เช่น `SUPERADMIN`, `STOCK_STAFF`, `ORDER_STAFF` |
| **Q: การตัดสต็อกและการสร้างออเดอร์พร้อมกัน ป้องกันปัญหาข้อมูลไม่สอดคล้องกัน (Race Condition/Data Inconsistency) อย่างไร?** | **A:** ใช้ **Prisma Database Transaction (`prisma.$transaction`)** ในการทำงานแบบ ACID โดยหากการตัดสต็อกสินค้าชิ้นใดชิ้นหนึ่งล้มเหลว หรือสต็อกไม่พอ ระบบจะ Rollback การสร้างออเดอร์ทั้งหมดกลับทันที |
| **Q: ปรับแต่งประสิทธิภาพฝั่ง Frontend (Performance Optimization) อย่างไร?** | **A:** ใช้ **React Query** ทำการแคชข้อมูล ลดการยิง HTTP Request ซ้ำซ้อน, ใช้ **Vite Code Splitting** แยก Bundle หน้าเว็บตาม Route และใช้ **useMemo / useCallback** ป้องกันการ Re-render ส่วนคำนวณซับซ้อน เช่น การนับถอยหลังเวลา Flash Sale |
| **Q: ระบบจัดการเรื่อง Timezone วันเวลาอย่างไรรบกวนอธิบาย?** | **A:** ฝั่งฐานข้อมูลและ API จะจัดเก็บและส่งผ่านข้อมูลเวลาในรูปแบบมาตรฐาน **ISO 8601 UTC** ส่วนฝั่ง Frontend ก่อนนำไปแสดงใน DatePicker จะถูกแปลงด้วยฟังก์ชัน `isoToLocalString` ให้เป็นเวลาตาม TimeZone ท้องถิ่นของผู้ใช้งาน (UTC+7) ทำให้เวลาตรงกันเสมอ |
