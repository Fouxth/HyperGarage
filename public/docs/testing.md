# CSI 204 Workshop 3

> **65007912 นายภัทรพิสิฏ ทองเกิด** | กลุ่ม T002

---

## การทดสอบ API และ Load Testing

## Lab #1: การทดสอบ API ด้วย Bruno

### Test Case 1: GET /api/products

**Endpoint:** `https://hyper-garage.duckdns.org/api/products`  
**Method:** GET  
ใช้ดึงข้อมูลรายการสินค้าจากเซิร์ฟเวอร์ในรูปแบบ JSON หากสำเร็จจะแสดงสถานะ 200 OK

**Test Scripts:**
```javascript
test("Status code should be 200", function() {
    expect(res.getStatus()).to.equal(200);
});

test("Response must be in JSON format", function() {
    expect(res.getHeader("content-type")).to.include("application/json");
});

test("Response should be an array", function() {
    expect(res.getBody()).to.be.an("array");
});

test("Each product should have required fields", function() {
    const data = res.getBody();
    if (data.length > 0) {
        expect(data[0]).to.have.property("id");
        expect(data[0]).to.have.property("name");
        expect(data[0]).to.have.property("price");
        expect(data[0]).to.have.property("stock");
        expect(data[0]).to.have.property("sku");
    }
});

test("Response time is less than 2000ms", function() {
    expect(res.getResponseTime()).to.be.below(2000);
});
```

---

### Test Case 2: POST /api/orders (สร้างคำสั่งซื้อ)

**Endpoint:** `https://hyper-garage.duckdns.org/api/orders`  
**Method:** POST  
**Body (JSON):**
```json
{
    "customer": "ทดสอบ ระบบ",
    "phone": "0812345678",
    "shippingAddress": "123 ถนนทดสอบ กรุงเทพฯ 10100",
    "paymentMethod": "cod",
    "items": [
        {
            "productId": "<PRODUCT_ID>",
            "quantity": 1
        }
    ]
}
```

**Test Scripts:**
```javascript
test("Status code should be 201 Created", function() {
    expect(res.getStatus()).to.equal(201);
});

test("Response must be in JSON format", function() {
    expect(res.getHeader("content-type")).to.include("application/json");
});

test("Order should have orderNumber", function() {
    const data = res.getBody();
    expect(data).to.have.property("orderNumber");
    expect(data.orderNumber).to.include("HG");
});

test("Order status should be pending", function() {
    const data = res.getBody();
    expect(data.status).to.equal("pending");
});

test("Response time is less than 2000ms", function() {
    expect(res.getResponseTime()).to.be.below(2000);
});
```

---

### Test Case 3: GET /api/products with Compatibility Filter

**Endpoint:** `https://hyper-garage.duckdns.org/api/products?vehicleBrand=Honda&vehicleModel=Civic&vehicleEngine=B16A`  
**Method:** GET  
ทดสอบระบบ Compatibility Checker โดยกรองสินค้าที่ใช้กับ Honda Civic B16A

**Test Scripts:**
```javascript
test("Status code should be 200", function() {
    expect(res.getStatus()).to.equal(200);
});

test("All products should be compatible with B16A", function() {
    const data = res.getBody();
    data.forEach(function(product) {
        const hasCompat = product.compatibility.some(function(c) {
            return c.engine === "B16A";
        });
        expect(hasCompat).to.equal(true);
    });
});
```

---

### Test Case 4: POST /api/reviews

**Endpoint:** `https://hyper-garage.duckdns.org/api/reviews`  
**Method:** POST  
**Body (JSON):**
```json
{
    "productId": "<PRODUCT_ID>",
    "userName": "สมชาย ทดสอบ",
    "rating": 5,
    "comment": "สินค้าคุณภาพดี ใส่แล้วเครื่องแรงขึ้นมาก"
}
```

**Test Scripts:**
```javascript
test("Status code should be 201 Created", function() {
    expect(res.getStatus()).to.equal(201);
});

test("Review should have correct rating", function() {
    const data = res.getBody();
    expect(data.rating).to.equal(5);
});

test("Review should have correct userName", function() {
    const data = res.getBody();
    expect(data.userName).to.equal("สมชาย ทดสอบ");
});
```

---

## Lab #2: การทดสอบประสิทธิภาพ (Load Testing) ด้วย JMeter

### วิธีการทดสอบ

1. สร้าง Thread Group ใน JMeter
2. เพิ่ม HTTP Request sampler → `GET https://hyper-garage.duckdns.org/api/products`
3. เพิ่ม Summary Report listener
4. รันทดสอบ 3 รอบ: 10, 50, 100 users

### JMeter Test Plan Configuration

| พารามิเตอร์ | ค่า |
|------------|-----|
| Target URL | https://hyper-garage.duckdns.org/api/products |
| Method | GET |
| Ramp-up Period | 1 วินาที |
| Loop Count | 1 |

### ผลการทดสอบ (ตัวอย่าง — ต้องรันจริง)

| จำนวนผู้ใช้จำลอง (คน) | จำนวนคำขอทั้งหมด (Samples) | Response Time เฉลี่ย (Average) | อัตราการผ่าน (Status) | อัตราความผิดพลาด (Error Rate) |
|----------------------|--------------------------|------------------------------|---------------------|---------------------------|
| 10 | 10 | ___ ms | สำเร็จทั้งหมด | 0% |
| 50 | 50 | ___ ms | สำเร็จทั้งหมด | 0% |
| 100 | 100 | ___ ms | สำเร็จทั้งหมด | 0% |

> **หมายเหตุ:** ให้รัน JMeter จริง แล้วกรอกตัวเลข Response Time ที่ได้ + screenshot ผลลัพธ์

### วิธีรัน

1. เปิด backend: `cd server && npm run dev`
2. เปิด JMeter: `jmeter` (ต้องติดตั้ง Apache JMeter)
3. สร้าง Test Plan:
   - Add > Thread Group (ตั้ง Number of Threads = 10/50/100)
   - Add > HTTP Request (Server: localhost, Port: 4000, Path: /api/products)
   - Add > Listener > Summary Report
4. กด Run (▶) แล้วดูผลที่ Summary Report
5. Screenshot ผลแต่ละรอบ

---

## Bruno Collection (Import ได้เลย)

คุณสามารถนำไฟล์ Bruno Collection ไปใช้ทดสอบได้จาก 2 ช่องทางนี้ครับ:

1. **ดาวน์โหลดเป็นไฟล์ ZIP (สำหรับหน้าเว็บ):**
   [📥 ดาวน์โหลด hypergarage-api.zip](./hypergarage-api.zip) (หลังจากดาวน์โหลด ให้แตกไฟล์ ZIP แล้วเปิดโฟลเดอร์ด้วยโปรแกรม Bruno)
2. **คัดลอกจากโฟลเดอร์ในเครื่องคอมพิวเตอร์ของคุณ (Local):**
   โฟลเดอร์นี้อยู่ในโปรเจกต์ของคุณแล้วที่พาธ `public/docs/hypergarage-api/` สามารถเปิดโปรแกรม Bruno แล้วเลือกเปิดโฟลเดอร์นี้ได้โดยตรงครับ

### โครงสร้าง Collection

```
hypergarage-api/
├── bruno.json
├── collection.bru
├── environments/
│   ├── Local.bru
│   └── Production.bru
├── Products/
│   ├── GET All Products.bru
│   └── GET Products with Compatibility Filter.bru
├── Categories/
│   └── GET All Categories.bru
├── Orders/
│   ├── POST Create Order.bru
│   └── GET Orders by Phone.bru
├── Reviews/
│   ├── POST Create Review.bru
│   └── GET Recent Reviews.bru
├── Stats/
│   ├── GET Dashboard Stats.bru
│   ├── GET Store Settings.bru
│   └── GET Health Check.bru
├── Auth/
│   ├── POST Login.bru
│   └── GET Get Current User.bru
├── Staff/
│   ├── GET List Staff.bru
│   ├── POST Create Staff.bru
│   ├── PATCH Update Staff.bru
│   └── DELETE Delete Staff.bru
└── Upload/
    └── POST Upload Image.bru
```

### วิธี Import

1. เปิด Bruno
2. Click "Open Collection"
3. เลือกโฟลเดอร์ `hypergarage-api/`
4. Collection "HyperGarage API" จะปรากฏในรายการ
5. เลือก Environment:
   - **Production** (baseUrl = `https://hyper-garage.duckdns.org/api`) เพื่อยิงทดสอบ API จริงออนไลน์ได้ทันทีโดยไม่ต้องรัน backend เอง
   - **Local** (baseUrl = `http://localhost:4000/api`) หากเปิดรัน Backend บนเครื่องตัวเอง (Localhost)
6. เลือก Request ที่ต้องการ แล้วกด Send เพื่อทดสอบได้เลยครับ
