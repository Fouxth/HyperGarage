# คัมภีร์ข้อมูลเชิงลึกทางเทคนิคโปรเจกต์ HyperGarage (Master Technical Reference)

เอกสารฉบับนี้รวบรวม **โครงสร้างซอร์สโค้ดแบบละเอียดทุกมิติ, API Specifications, ข้อมูลเชิงลึกของอัลกอริทึม (Algorithms), โมเดลฐานข้อมูล (Prisma Schema), และแนวทางการป้องกันคำถามสอบวิชาโครงงานซอฟต์แวร์** ไว้อย่างสมบูรณ์ที่สุด

---

## 1. ผังและนิยามฐานข้อมูลแบบละเอียด (Database Schema & Prisma Models)

ฐานข้อมูลใช้ **PostgreSQL** บริหารจัดการผ่าน **Prisma ORM** นิยามโมเดลไว้ใน `server/prisma/schema.prisma`:

### 1.1 ตารางผู้ใช้งานและสิทธิ์ (Auth & User Management)
```prisma
enum Role {
  SUPERADMIN     // สิทธิ์สูงสุด: จัดการพนักงาน, คืนเงิน, ลบข้อมูล
  STOCK_STAFF    // พนักงานคลัง: เพิ่ม/แก้ไข/ลบ สินค้า, แบรนด์, คลังสินค้า
  ORDER_STAFF    // พนักงานออเดอร์: จัดการคำสั่งซื้อ, คืนสินค้า, ปรับสถานะส่งของ
}

model Staff {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String   // เก็บด้วย Bcrypt Hash (Salt Rounds = 10)
  role      Role     @default(STOCK_STAFF)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Customer {
  id        String            @id @default(cuid())
  email     String            @unique
  name      String
  password  String
  phone     String?
  banned    Boolean           @default(false)
  addresses CustomerAddress[]
  orders    Order[]
  createdAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt
}
```

### 1.2 ตารางแคตตาล็อกสินค้า (Product Catalog)
```prisma
model Product {
  id            String                 @id @default(cuid())
  name          String
  nameEn        String
  slug          String                 @unique
  price         Float                  // ราคากลางในฐานข้อมูล
  originalPrice Float?
  discount      Float?
  images        String[]
  sku           String                 @unique
  stock         Int                    @default(0)
  rating        Float                  @default(0) // อัปเดตเฉลี่ยจาก Review
  reviewCount   Int                    @default(0)
  description   String
  specs         Json                   @default("{}") // เก็บสเปกแบบ Key-Value JSON
  tags          String[]
  isNew         Boolean                @default(false)
  isFeatured    Boolean                @default(false)
  isFlashSale   Boolean                @default(false)
  flashSaleEnd  DateTime?              // เวลา UTC สิ้นสุด Flash Sale
  brandId       String
  brand         Brand                  @relation(fields: [brandId], references: [id])
  categoryId    String
  category      Category               @relation(fields: [categoryId], references: [id])
  compatibility ProductCompatibility[]
  variants      ProductVariant[]
  reviews       Review[]
  createdAt     DateTime               @default(now())
  updatedAt     DateTime               @updatedAt
}

model ProductVariant {
  id         String   @id @default(cuid())
  productId  String
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  name       String   // เช่น "สีแดง", "ขนาด L"
  sku        String   @unique
  priceDelta Float    @default(0) // ราคาที่เพิ่ม/ลด จากราคาหลักของสินค้า
  stock      Int      @default(0) // สต็อกแยกตาม Variant
}
```

### 1.3 ตารางคำสั่งซื้อและการคืนสินค้า (Orders & Returns)
```prisma
enum OrderStatus {
  pending      // รอรหัสชำระเงิน/รอตรวจสอบ
  processing   // กำลังเตรียมสินค้า
  shipped      // จัดส่งแล้ว
  delivered    // ส่งถึงผู้รับแล้ว
  cancelled    // ยกเลิก
}

enum PaymentStatus {
  pending      // ยังไม่ชำระเงิน
  paid         // ชำระเงินแล้ว
  refunded     // คืนเงินแล้ว
}

model Order {
  id              String        @id @default(cuid())
  orderNumber     String        @unique // สุ่มในรูปแบบ "HG-XXXXXX"
  customer        String        // ชื่อผู้รับสินค้า
  phone           String        // เบอร์โทรติดต่อ
  shippingAddress String        // ที่อยู่จัดส่ง
  paymentMethod   String        // เช่น "PromptPay", "Transfer", "COD"
  paymentStatus   PaymentStatus @default(pending)
  status          OrderStatus   @default(pending)
  total           Float         // ยอดเงินรวมคำนวณจากเซิร์ฟเวอร์
  trackingNumber  String?
  carrier         String?
  customerId      String?
  customerRel     Customer?     @relation(fields: [customerId], references: [id])
  items           OrderItem[]
  returns         Return[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

---

## 2. ข้อมูลจำเพาะระบบ RESTful API Specs & Endpoints Matrix

| HTTP Method | Route Endpoint | Authentication / Role | คำอธิบายหน้าที่และ Payload |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Public | เข้าสู่ระบบพนักงาน (`{ email, password }`) -> คืนค่า JWT Token |
| **POST** | `/api/account/register` | Public | ลงทะเบียนลูกค้าใหม่ (`{ email, name, password, phone }`) |
| **POST** | `/api/account/login` | Public | เข้าสู่ระบบลูกค้า -> คืนค่า Customer Token |
| **GET** | `/api/products` | Public | ดึงรายการสินค้า สามารถกรองด้วย `?featured=true`, `?flashSale=true`, `?category=slug`, `?q=search` |
| **POST** | `/api/products` | Staff (`SUPERADMIN`, `STOCK_STAFF`) | สร้างสินค้าใหม่ |
| **PATCH** | `/api/products/:id/flash-sale` | Staff (`SUPERADMIN`, `STOCK_STAFF`) | เปิด/ปิด Flash Sale (`{ isFlashSale, discount, flashSaleEnd }`) |
| **POST** | `/api/orders` | Optional Customer / Guest | สร้างออเดอร์ใหม่พร้อมตัดสต็อกสินค้าใน Transaction |
| **GET** | `/api/orders` | Customer / Staff / PII Restricted | ดูรายการออเดอร์ (ผู้ใช้ทั่วไปต้องใส่ `?phone=xxx&orderNumber=yyy`) |
| **PATCH** | `/api/orders/:id/status` | Staff (`SUPERADMIN`, `ORDER_STAFF`) | อัปเดตสถานะออเดอร์ (`pending` -> `processing` -> `shipped`) |
| **POST** | `/api/returns` | Verified Owner / Customer / Staff | ยื่นคำขอคืนสินค้า (ตรวจสอบเบอร์โทรหรือ Token เจ้าของ) |
| **PATCH** | `/api/returns/:id/status` | Staff (`SUPERADMIN`, `ORDER_STAFF`) | อนุมัติคืนสินค้า คืนเงิน และ**คืนสต็อกสินค้าอัตโนมัติ** |
| **POST** | `/api/reviews` | Public / Customer | ส่งรีวิวสินค้า (ประเมินคะแนน 1-5 ดาว และอัปเดตค่าเฉลี่ยลง Product) |
| **GET** | `/api/vehicles/tree` | Public | ดึงความสัมพันธ์ ยี่ห้อรถ -> รุ่นรถ -> โฉมรถ แบบ Tree Structure |
| **GET** | `/api/stats/dashboard` | Staff (`SUPERADMIN`, `ORDER_STAFF`) | ดึงสรุปสถิติมุมมองผู้บริหาร (ยอดขายรวม, จำนวนออเดอร์, กราฟยอดขาย) |
| **GET** | `/api/backup/export` | Staff (`SUPERADMIN`) | ดาวน์โหลดไฟล์ JSON สำรองข้อมูลทุกตารางในระบบ |

---

## 3. อัลกอริทึมและการทำงานเชิงลึก (Algorithm Deep-Dive)

### 3.1 อัลกอริทึมสั่งซื้อและตัดสต็อกสินค้า (Atomic Checkout Algorithm)

ไฟล์: **[server/src/routes/orders.ts](file:///Users/pn/Desktop/Fouxth/HyperGarage/server/src/routes/orders.ts)**

```typescript
// 1. ตรวจสอบความถูกต้องของ Input (Input Boundary Validation)
if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
  return res.status(400).json({ error: 'Order must contain between 1 and 50 items' })
}

// 2. คำนวณราคาและตรวจสอบสต็อกจากฐานข้อมูลจริง (Server-Side Price Calculation)
let total = 0
const orderItemsData = []

for (const item of items) {
  if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
    return res.status(400).json({ error: 'Item quantity must be an integer between 1 and 99' })
  }

  const product = await prisma.product.findUnique({
    where: { id: item.productId },
    include: { variants: true },
  })
  if (!product) return res.status(400).json({ error: `Product ${item.productId} not found` })

  let priceEach = product.price
  let variantName: string | undefined = undefined

  if (item.variantId) {
    const variant = product.variants.find((v) => v.id === item.variantId)
    if (!variant) return res.status(400).json({ error: `Variant ${item.variantId} not found` })
    
    // Check Stock ของ Variant
    if (variant.stock < item.quantity) {
      return res.status(400).json({ error: `Stock not enough for variant ${variant.name}` })
    }
    priceEach += variant.priceDelta
    variantName = variant.name
  } else {
    // Check Stock ของ Product หลัก
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Stock not enough for ${product.name}` })
    }
  }

  total += priceEach * item.quantity
  orderItemsData.push({
    productId: product.id,
    productName: product.name,
    productSlug: product.slug,
    productImage: product.images[0] || null,
    variantId: item.variantId || null,
    variantName: variantName || null,
    quantity: item.quantity,
    priceEach,
  })
}

// 3. ปฏิบัติการในระดับ Database Transaction (Atomicity & Isolation)
const order = await prisma.$transaction(async (tx) => {
  // 3.1 ตัดสต็อกสินค้า
  for (const item of items) {
    if (item.variantId) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      })
    } else {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }
  }

  // 3.2 สร้างเรคคอร์ด Order และ OrderItem
  return tx.order.create({
    data: {
      orderNumber: generateOrderNumber(), // สุ่มรหัสเช่น "HG-8F3A2K"
      customer: customer.trim(),
      phone: phone.trim(),
      shippingAddress: shippingAddress.trim(),
      paymentMethod,
      total,
      customerId,
      items: { create: orderItemsData },
    },
    include: { items: true },
  })
})
```

---

### 3.2 อัลกอริทึมคำนวณเวลานับถอยหลัง Flash Sale (Real-time Countdown Algorithm)

ไฟล์: **[HomePage.tsx](file:///Users/pn/Desktop/Fouxth/HyperGarage/src/pages/customer/HomePage.tsx)**

```typescript
// Hook นับถอยหลังเวลาคำนวณส่วนต่างมิลลิวินาที
const useCountdown = (targetDate: Date) => {
  const targetTime = targetDate.getTime()
  
  const calc = useCallback(() => {
    // คำนวณส่วนต่างระหว่าง เวลาเป้าหมาย กับ เวลาปัจจุบัน
    const diff = Math.max(0, targetTime - Date.now())
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }, [targetTime])

  const [time, setTime] = useState(calc)

  useEffect(() => {
    setTime(calc())
    const id = setInterval(() => setTime(calc()), 1000) // อัปเดตทุก 1 วินาที
    return () => clearInterval(id) // Clear Memory Leak เมื่อ Unmount
  }, [calc])

  return time
}
```

---

## 4. โครงสร้างแคช TanStack React Query & Invalidation Matrix

ฝั่ง Frontend ใช้ **TanStack React Query** ในการบริหารจัดการแคชของข้อมูล โดยมีตารางการสั่งล้างแคช (`Invalidation Matrix`) ดังนี้:

```mermaid
graph TD
    M1[Mutation: useCheckout] -->|invalidateQueries| Q1['orders']
    M1 -->|invalidateQueries| Q2['products']
    M1 -->|invalidateQueries| Q3['dashboardStats']
    
    M2[Mutation: useUpdateFlashSale] -->|invalidateQueries| Q2['products']
    
    M3[Mutation: useCreateReview] -->|invalidateQueries| Q4['productReviews']
    M3 -->|invalidateQueries| Q5['product']
    M3 -->|invalidateQueries| Q2['products']
    
    M4[Mutation: useUpdateReturnStatus] -->|invalidateQueries| Q6['returns']
    M4 -->|invalidateQueries| Q1['orders']
    M4 -->|invalidateQueries| Q2['products']
  ```

---

## 5. สรุปรายการปรับปรุงความปลอดภัย 11 ข้อ (Security Overhaul Assessment)

1. **Centralized JWT Secret:** ย้ายการจัดการคีย์ลับไปไว้ที่ `jwtSecret.ts` และห้ามใช้ Hardcoded Fallback String ในโหมด Production
2. **Database Re-Verification (Active Token Check):** `authMiddleware` คิวรีเช็กตัวตนพนักงานใน PostgreSQL ทุกคำขอ ป้องกันการใช้ Token ของพนักงานที่ถูกลบไปแล้ว
3. **Role-Based Access Control (RBAC):** กำหนด `requireRole(['SUPERADMIN', 'STOCK_STAFF'])` ครอบทุก Endpoint สำหรับการเปลี่ยนแปลงข้อมูลสำคัญ
4. **Order PII Privacy:** ปิดการดึงรายการออเดอร์ทั้งหมดสำหรับแขกภายนอก หากไม่ระบุทั้ง `phone` และ `orderNumber`
5. **Checkout Price & Quantity Validation:** บังคับให้ราคาสินค้าคำนวณจาก DB บนเซิร์ฟเวอร์เท่านั้น และจำกัดจำนวนสินค้าต่อออเดอร์ (`quantity` 1..99)
6. **Guest Order Claim Removal:** ลบฟังก์ชันการดึงออเดอร์อัตโนมัติด้วยเบอร์โทรตอนลงทะเบียน เพื่อป้องกันการแอบอ้างยึดคำสั่งซื้อของผู้อื่น
7. **Vehicle Catalog Protection:** เพิ่ม Middleware ป้องกันเส้นทางสร้าง/ลบข้อมูลแบรนด์และรุ่นรถยนต์
8. **Returns Ownership Authorization:** บังคับตรวจสอบเบอร์โทรหรือ Token บัญชีตรงกับออเดอร์ก่อนสร้างคำขอคืนสินค้า
9. **Review Validation & Anti-Spam:** จำกัดคะแนนดาว 1-5 และจำกัดความยาวของชื่อ/คอมเมนต์ ป้องกันสแปมข้อมูล
10. **Secure Admin Password Seeding:** ซ่อนรหัสผ่านตั้งต้นใน environment variables และยกเลิกการพิมพ์รหัสผ่านเป็นตัวอักษรธรรมดาออกคอนโซล
11. **Upload & Notification Protection:** จำกัดสิทธิ์การอัปโหลดไฟล์และการจัดการการแจ้งเตือนให้อนุญาตเฉพาะพนักงานที่ได้รับสิทธิ์เท่านั้น

---

## 6. แนวทางคำตอบสำหรับการสอบพรีเซนต์ระดับมหาวิทยาลัย (Master Defense Q&A)

### Q1: ทำไมถึงเลือกใช้ Prisma ORM แทนการเขียน SQL Raw Command ตรงๆ?
**แนวตอบ:** 
"การเลือกใช้ Prisma ORM ช่วยให้เราได้ประโยชน์ 3 ด้านหลักครับ:
1. **Type-Safety:** Prisma เจนเนอเรต TypeScript Types จาก Schema โดยตรง ทำให้ลดความผิดพลาดเรื่องชื่อคอลัมน์หรือประเภทข้อมูลตั้งแต่ช่วง Compile-Time
2. **Prevent SQL Injection:** Prisma ใช้ Prepared Statements ในการส่งคำสั่ง SQL ไปยัง PostgreSQL ทุกครั้ง ทำให้ป้องกันการโจมตีประเภท SQL Injection 100% โดยไม่ต้องเขียน Sanitization เอง
3. **Complex Transactions Made Easy:** ฟังก์ชัน `prisma.$transaction` ช่วยให้เราเขียนโค้ดการทำงานแบบ ACID Transaction ได้ง่ายและอ่านเข้าใจได้ชัดเจนครับ"

### Q2: หากอนาคตร้านค้ามีผู้ใช้งานพร้อมกันเป็นหมื่นคน (High Concurrency) สต็อกสินค้าจะเกิดปัญหา Race Condition หรือไม่ และจะแก้ไขอย่างไร?
**แนวตอบ:**
"ในปัจจุบันระบบเราใช้ `prisma.$transaction` ในการจัดการ แต่สำหรับระบบระดับ High Concurrency ในอนาคต เราสามารถอัปเกรดได้ 2 แนวทางครับ:
1. **Pessimistic Locking / Atomic Update:** ใช้ SQL `UPDATE product SET stock = stock - qty WHERE id = :id AND stock >= qty` เพื่อให้ PostgreSQL ทำการ Lock แถวข้อมูล (Row-level lock) ในระดับฐานข้อมูล
2. **Redis Message Queue / Reservation:** ใช้ Redis เป็น In-memory Database รับคิวการจองสินค้า (Inventory Reservation) ก่อนบันทึกลง PostgreSQL เพื่อตัดภาระของฐานข้อมูลหลักครับ"

### Q3: การส่งผ่านข้อมูลเวลาข้ามระหว่าง Client และ Server มีการจัดการเรื่อง Timezone อย่างไร?
**แนวตอบ:**
"ระบบใช้มาตรฐาน **ISO 8601 UTC** เป็นตัวกลางในการสื่อสารครับ:
- ฝั่งฐานข้อมูล PostgreSQL และ API จะจัดเก็บเวลาในรูป UTC (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- ฝั่ง Frontend เมื่อรับค่า ISO String มา จะใช้ฟังก์ชัน `isoToLocalString` แปลงเป็นเวลา Local Timezone (+7) สำหรับแสดงใน HTML5 `<input type="datetime-local">` และหน้า UI ทำให้ไม่ว่าผู้ใช้จะอยู่ที่โซนเวลาไหน เวลาในการนับถอยหลังและการแสดงผลจะแม่นยำตรงกันเสมอครับ"

### Q4: สถาปัตยกรรมระบบนี้รองรับการทำ CI/CD และการ Scaling ในอนาคตอย่างไร?
**แนวตอบ:**
"เนื่องจากเราออกแบบระบบแบบ **Decoupled Architecture** (แยก Frontend และ Backend ชัดเจนผ่าน RESTful API):
- ฝั่ง **Frontend (Vite/React)** เป็น Static Build สามารถนำไปปูบน CDN เช่น Vercel, Netlify หรือ Cloudflare Pages เพื่อความรวดเร็วและรองรับผู้ใช้ได้มหาศาล
- ฝั่ง **Backend (Node.js/Express)** เป็น Stateless Service สามารถรันบน Docker Containers และขยายแบบ Horizontal Scaling ผ่าน Kubernetes หรือ Cloud Load Balancers ร่วมกับ PostgreSQL Connection Pooling (เช่น PgBouncer) ได้ทันทีครับ"
