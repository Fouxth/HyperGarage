# Class Diagram

## แผนภาพคลาส ระบบ HyperGarage

```mermaid
classDiagram
    class Product {
        +String id
        +String name
        +String nameEn
        +String slug
        +Int price
        +Int originalPrice
        +Int discount
        +String[] images
        +String sku
        +Int stock
        +Float rating
        +Int reviewCount
        +String description
        +Json specs
        +String[] tags
        +Boolean isNew
        +Boolean isFeatured
        +Boolean isFlashSale
        +DateTime flashSaleEnd
        +String brandId
        +String categoryId
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Category {
        +String id
        +String name
        +String nameEn
        +String slug
        +String icon
        +String image
        +DateTime createdAt
    }

    class Brand {
        +String id
        +String name
        +String slug
        +String logo
        +String country
        +DateTime createdAt
    }

    class Order {
        +String id
        +String orderNumber
        +String customer
        +String phone
        +Int total
        +OrderStatus status
        +String paymentMethod
        +PaymentStatus paymentStatus
        +String shippingAddress
        +DateTime createdAt
    }

    class OrderItem {
        +String id
        +String orderId
        +String productId
        +Int quantity
        +Int priceEach
    }

    class Review {
        +String id
        +String productId
        +String userName
        +Int rating
        +String comment
        +String[] images
        +DateTime createdAt
    }

    class Coupon {
        +String id
        +String code
        +CouponType type
        +Int value
        +Boolean active
        +Int usageLimit
        +Int usedCount
        +DateTime expiresAt
        +DateTime createdAt
    }

    class ProductCompatibility {
        +String id
        +String productId
        +String brand
        +String model
        +String generation
        +String years
        +String engine
    }

    class VehicleBrand {
        +String id
        +String name
    }

    class VehicleModel {
        +String id
        +String name
        +String vehicleBrandId
    }

    class VehicleGeneration {
        +String id
        +String name
        +String years
        +String[] engines
        +String vehicleModelId
    }

    class StoreSettings {
        +String id
        +String storeName
        +String contactEmail
        +String contactPhone
        +String address
        +String currency
        +Boolean maintenanceMode
        +DateTime updatedAt
    }

    class OrderStatus {
        <<enumeration>>
        pending
        processing
        shipped
        delivered
        cancelled
    }

    class PaymentStatus {
        <<enumeration>>
        pending
        paid
        refunded
    }

    class CouponType {
        <<enumeration>>
        percent
        fixed
    }

    Category "1" --> "*" Product : มีสินค้า
    Brand "1" --> "*" Product : ผลิตสินค้า
    Product "1" --> "*" ProductCompatibility : เข้ากันได้กับ
    Product "1" --> "*" Review : มีรีวิว
    Product "1" --> "*" OrderItem : ถูกสั่งซื้อ
    Order "1" --> "*" OrderItem : ประกอบด้วย
    VehicleBrand "1" --> "*" VehicleModel : มีรุ่น
    VehicleModel "1" --> "*" VehicleGeneration : มีเจเนอเรชัน
    Order --> OrderStatus : สถานะ
    Order --> PaymentStatus : สถานะชำระเงิน
    Coupon --> CouponType : ประเภท
```

---

## คำอธิบายความสัมพันธ์

| ความสัมพันธ์ | ประเภท | หมายเหตุ |
|-------------|--------|----------|
| Category → Product | One-to-Many | หมวดหมู่หนึ่งมีได้หลายสินค้า |
| Brand → Product | One-to-Many | แบรนด์หนึ่งมีได้หลายสินค้า |
| Product → ProductCompatibility | One-to-Many | สินค้าหนึ่งใช้ได้กับหลายรุ่นรถ (Cascade Delete) |
| Product → Review | One-to-Many | สินค้าหนึ่งมีได้หลายรีวิว (Cascade Delete) |
| Product → OrderItem | One-to-Many | สินค้าหนึ่งปรากฏในหลายออเดอร์ |
| Order → OrderItem | One-to-Many | ออเดอร์หนึ่งมีได้หลายรายการ (Cascade Delete) |
| VehicleBrand → VehicleModel | One-to-Many | ยี่ห้อหนึ่งมีหลายรุ่น (Cascade Delete) |
| VehicleModel → VehicleGeneration | One-to-Many | รุ่นหนึ่งมีหลายเจเนอเรชัน (Cascade Delete) |
