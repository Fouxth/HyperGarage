# CSI 204 Workshop 1

> **65007912 นายภัทรพิสิฏ ทองเกิด** | กลุ่ม T002

---

## System Architecture

```mermaid
graph TB
    subgraph Client["Presentation Layer (Client)"]
        Browser["🌐 Web Browser"]
        React["React 19 SPA"]
        TQ["TanStack Query<br/>(Data Fetching & Cache)"]
        Router["React Router 7<br/>(Lazy Loading)"]
        LS["LocalStorage<br/>(Cart + Wishlist)"]
        i18n["i18next<br/>(TH/EN)"]
    end

    subgraph Server["Application Layer (Backend)"]
        Express["Express.js<br/>(TypeScript)"]
        Routes["REST API Routes"]
        
        subgraph Engines["Business Logic"]
            CE["Compatibility<br/>Engine"]
            OP["Order<br/>Processor"]
            SE["Stats<br/>Engine"]
        end
        
        Prisma["Prisma ORM<br/>(Type-safe queries)"]
    end

    subgraph Database["Data Storage Layer"]
        PG[("PostgreSQL<br/>(Cloud Database)")]
    end

    subgraph Frontend_Pages["Frontend Pages"]
        CP["Customer Pages<br/>(11 หน้า)"]
        AP["Admin Pages<br/>(18 หน้า)"]
    end

    Browser --> React
    React --> Router
    React --> TQ
    React --> LS
    React --> i18n
    Router --> CP
    Router --> AP

    TQ -->|"HTTP /api/*"| Express
    Express --> Routes
    Routes --> CE
    Routes --> OP
    Routes --> SE
    CE --> Prisma
    OP --> Prisma
    SE --> Prisma
    Prisma -->|"SQL Queries"| PG
```

---

## Technology Stack Overview

```mermaid
graph LR
    subgraph Frontend
        V[Vite 6] --> R[React 19]
        R --> TS1[TypeScript]
        R --> TW[Tailwind CSS 4]
        R --> FM[Framer Motion]
        R --> RC[Recharts]
        R --> LR[Lucide React]
    end

    subgraph Backend
        N[Node.js] --> E[Express]
        E --> TS2[TypeScript]
        E --> P[Prisma ORM]
    end

    subgraph Database
        P --> PG[(PostgreSQL)]
    end

    Frontend -->|"/api/* proxy"| Backend
```

---

## Data Flow: Checkout Process

```mermaid
sequenceDiagram
    participant C as Customer (Browser)
    participant LS as LocalStorage
    participant API as Express API
    participant DB as PostgreSQL

    C->>LS: เพิ่มสินค้าลงตะกร้า
    LS-->>C: แสดงตะกร้า

    C->>API: POST /api/orders<br/>{items, customer, phone, address}
    
    API->>DB: BEGIN TRANSACTION
    API->>DB: ตรวจสอบสต็อกทุกรายการ
    
    alt สต็อกเพียงพอ
        API->>DB: ตัดสต็อก (stock -= quantity)
        API->>DB: สร้าง Order + OrderItems
        API->>DB: COMMIT
        API-->>C: 201 Created {orderNumber}
        C->>LS: ล้างตะกร้า
    else สต็อกไม่พอ
        API->>DB: ROLLBACK
        API-->>C: 400 Bad Request
    end
```

---

## Data Flow: Compatibility Checker

```mermaid
sequenceDiagram
    participant C as Customer
    participant FE as React Frontend
    participant API as Express API
    participant DB as PostgreSQL

    C->>FE: เลือกยี่ห้อรถ "Honda"
    FE->>API: GET /api/vehicles
    API->>DB: SELECT vehicle hierarchy
    DB-->>API: brands > models > generations
    API-->>FE: vehicle tree data

    FE-->>C: แสดง dropdown: Civic, Integra...
    C->>FE: เลือก Civic > EK > B16A

    C->>FE: กด "ค้นหาสินค้า"
    FE->>API: GET /api/products?vehicleBrand=Honda&vehicleModel=Civic&vehicleEngine=B16A
    API->>DB: SELECT products JOIN compatibility
    DB-->>API: filtered products
    API-->>FE: compatible products list
    FE-->>C: แสดงเฉพาะอะไหล่ที่ใช้กับ B16A
```
