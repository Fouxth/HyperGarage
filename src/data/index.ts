import type { Product, Category, Brand, Vehicle, Order, AdminStats, SalesData, CategorySales } from '@/types'

export const categories: Category[] = [
  { id: '1', name: 'เครื่องยนต์', nameEn: 'Engine', slug: 'engine', icon: 'engine', productCount: 156, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400' },
  { id: '2', name: 'ระบบไอเสีย', nameEn: 'Exhaust', slug: 'exhaust', icon: 'exhaust', productCount: 89, image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400' },
  { id: '3', name: 'ช่วงล่าง', nameEn: 'Suspension', slug: 'suspension', icon: 'suspension', productCount: 124, image: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=400' },
  { id: '4', name: 'เบรก', nameEn: 'Brake', slug: 'brake', icon: 'brake', productCount: 67, image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400' },
  { id: '5', name: 'ล้อแม็ก', nameEn: 'Wheel', slug: 'wheel', icon: 'wheel', productCount: 203, image: 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=400' },
  { id: '6', name: 'ภายนอก', nameEn: 'Exterior', slug: 'exterior', icon: 'exterior', productCount: 178, image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400' },
  { id: '7', name: 'ภายใน', nameEn: 'Interior', slug: 'interior', icon: 'interior', productCount: 95, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400' },
  { id: '8', name: 'อิเล็กทรอนิกส์', nameEn: 'Electronics', slug: 'electronics', icon: 'electronics', productCount: 112, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400' },
]

export const brands: Brand[] = [
  { id: '1', name: 'HKS', slug: 'hks', logo: '', country: 'Japan', productCount: 45 },
  { id: '2', name: 'TEIN', slug: 'tein', logo: '', country: 'Japan', productCount: 38 },
  { id: '3', name: 'Brembo', slug: 'brembo', logo: '', country: 'Italy', productCount: 29 },
  { id: '4', name: 'RAYS', slug: 'rays', logo: '', country: 'Japan', productCount: 52 },
  { id: '5', name: 'K&N', slug: 'kn', logo: '', country: 'USA', productCount: 33 },
  { id: '6', name: 'CUSCO', slug: 'cusco', logo: '', country: 'Japan', productCount: 41 },
  { id: '7', name: 'GReddy', slug: 'greddy', logo: '', country: 'Japan', productCount: 27 },
  { id: '8', name: 'Sparco', slug: 'sparco', logo: '', country: 'Italy', productCount: 36 },
]

export const products: Product[] = [
  {
    id: '1',
    name: 'HKS Hi-Power Muffler',
    nameEn: 'HKS Hi-Power Muffler',
    slug: 'hks-hi-power-muffler',
    price: 15900,
    originalPrice: 18900,
    discount: 16,
    images: ['https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600'],
    brand: 'HKS',
    category: 'ระบบไอเสีย',
    categorySlug: 'exhaust',
    sku: 'HKS-EXH-001',
    stock: 25,
    rating: 4.8,
    reviewCount: 124,
    description: 'High-performance exhaust muffler with titanium tip. Delivers deep, aggressive exhaust note with improved flow.',
    specs: { 'Material': 'Stainless Steel / Titanium Tip', 'Inlet Size': '60mm', 'Outlet Size': '100mm', 'Weight': '4.2 kg', 'Sound Level': '89 dB' },
    compatibility: [
      { brand: 'Honda', model: 'Civic', generation: 'FD (2006-2011)', years: '2006-2011', engine: '1.8 i-VTEC' },
      { brand: 'Honda', model: 'Civic', generation: 'FB (2012-2015)', years: '2012-2015', engine: '1.8 i-VTEC' },
    ],
    tags: ['exhaust', 'performance', 'titanium'],
    isFeatured: true,
  },
  {
    id: '2',
    name: 'TEIN Flex Z Coilover',
    nameEn: 'TEIN Flex Z Coilover',
    slug: 'tein-flex-z-coilover',
    price: 24500,
    originalPrice: 28000,
    discount: 13,
    images: ['https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=600'],
    brand: 'TEIN',
    category: 'ช่วงล่าง',
    categorySlug: 'suspension',
    sku: 'TEIN-SUS-001',
    stock: 18,
    rating: 4.9,
    reviewCount: 89,
    description: 'Full-length adjustable coilover with 16-level damping adjustment. Street comfort with track performance.',
    specs: { 'Type': 'Full-length Adjustable', 'Damping': '16 Levels', 'Spring Rate F': '8 kg/mm', 'Spring Rate R': '6 kg/mm', 'Lowering Range': '-15 to -55mm' },
    compatibility: [
      { brand: 'Honda', model: 'Civic', generation: 'FD (2006-2011)', years: '2006-2011', engine: '1.8 i-VTEC' },
      { brand: 'Honda', model: 'Civic', generation: 'FD (2006-2011)', years: '2006-2011', engine: '2.0 i-VTEC' },
    ],
    tags: ['suspension', 'coilover', 'adjustable'],
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Brembo GT-R Brake Kit',
    nameEn: 'Brembo GT-R Brake Kit',
    slug: 'brembo-gt-r-brake-kit',
    price: 45900,
    originalPrice: 52000,
    discount: 12,
    images: ['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600'],
    brand: 'Brembo',
    category: 'เบรก',
    categorySlug: 'brake',
    sku: 'BRE-BRK-001',
    stock: 8,
    rating: 5.0,
    reviewCount: 56,
    description: '6-piston monoblock caliper with 355mm slotted rotor. Ultimate stopping power for street and track.',
    specs: { 'Pistons': '6-Piston Monoblock', 'Rotor Size': '355mm', 'Rotor Type': 'Slotted', 'Caliper Color': 'Red', 'Pad Type': 'High-Performance Street' },
    compatibility: [
      { brand: 'Honda', model: 'Civic', generation: 'FK8 (2017-2021)', years: '2017-2021', engine: '2.0 VTEC Turbo' },
    ],
    tags: ['brake', 'performance', 'track'],
    isFeatured: true,
  },
  {
    id: '4',
    name: 'RAYS Volk TE37 SL',
    nameEn: 'RAYS Volk TE37 SL',
    slug: 'rays-volk-te37-sl',
    price: 18900,
    images: ['https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=600'],
    brand: 'RAYS',
    category: 'ล้อแม็ก',
    categorySlug: 'wheel',
    sku: 'RAY-WHL-001',
    stock: 12,
    rating: 4.9,
    reviewCount: 203,
    description: 'Forged monoblock wheel. The legendary TE37, now lighter than ever with the SL specification.',
    specs: { 'Size': '18x9.5 +38', 'PCD': '5x114.3', 'Material': 'Forged 6061-T6', 'Weight': '7.8 kg', 'Color': 'Bronze' },
    compatibility: [
      { brand: 'Honda', model: 'Civic', generation: 'FD (2006-2011)', years: '2006-2011', engine: 'All' },
      { brand: 'Honda', model: 'Civic', generation: 'FK8 (2017-2021)', years: '2017-2021', engine: 'All' },
      { brand: 'Toyota', model: '86', generation: 'ZN6 (2012-2021)', years: '2012-2021', engine: 'All' },
    ],
    tags: ['wheel', 'forged', 'lightweight'],
    isFeatured: true,
  },
  {
    id: '5',
    name: 'K&N Air Filter',
    nameEn: 'K&N Air Filter',
    slug: 'kn-air-filter',
    price: 3290,
    images: ['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600'],
    brand: 'K&N',
    category: 'เครื่องยนต์',
    categorySlug: 'engine',
    sku: 'KN-ENG-001',
    stock: 50,
    rating: 4.7,
    reviewCount: 312,
    description: 'High-flow washable air filter. Increases airflow up to 50% over stock paper filters.',
    specs: { 'Type': 'Drop-in Replacement', 'Material': 'Cotton Gauze', 'Washable': 'Yes', 'Oil Type': 'K&N Filter Oil', 'Warranty': 'Million Mile' },
    compatibility: [
      { brand: 'Honda', model: 'Civic', generation: 'FD (2006-2011)', years: '2006-2011', engine: '1.8 i-VTEC' },
      { brand: 'Honda', model: 'Civic', generation: 'FD (2006-2011)', years: '2006-2011', engine: '2.0 i-VTEC' },
      { brand: 'Honda', model: 'Jazz', generation: 'GE (2008-2014)', years: '2008-2014', engine: '1.5 i-VTEC' },
    ],
    tags: ['air-filter', 'engine', 'washable'],
    isFeatured: true,
  },
  {
    id: '6',
    name: 'CUSCO Strut Bar',
    nameEn: 'CUSCO Strut Bar',
    slug: 'cusco-strut-bar',
    price: 4500,
    images: ['https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=600'],
    brand: 'CUSCO',
    category: 'ช่วงล่าง',
    categorySlug: 'suspension',
    sku: 'CUS-SUS-001',
    stock: 30,
    rating: 4.6,
    reviewCount: 78,
    description: 'Aluminum strut tower bar for improved chassis rigidity and handling response.',
    specs: { 'Material': 'Aluminum', 'Type': 'Type OS', 'Position': 'Front', 'Weight': '1.2 kg' },
    compatibility: [
      { brand: 'Honda', model: 'Civic', generation: 'FD (2006-2011)', years: '2006-2011', engine: 'All' },
    ],
    tags: ['strut-bar', 'chassis', 'handling'],
    isFeatured: true,
    isFlashSale: true,
    flashSaleEnd: '2024-12-31T23:59:59',
  },
  {
    id: '7',
    name: 'HKS Super Power Flow',
    nameEn: 'HKS Super Power Flow',
    slug: 'hks-super-power-flow',
    price: 8900,
    originalPrice: 10500,
    discount: 15,
    images: ['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600'],
    brand: 'HKS',
    category: 'เครื่องยนต์',
    categorySlug: 'engine',
    sku: 'HKS-ENG-002',
    stock: 5,
    rating: 4.8,
    reviewCount: 67,
    description: 'Mushroom-style air intake filter with 200mm diameter. Maximum airflow for turbocharged applications.',
    specs: { 'Diameter': '200mm', 'Inlet': '80mm', 'Type': 'Mushroom', 'Material': 'Stainless Steel Mesh' },
    compatibility: [
      { brand: 'Honda', model: 'Civic', generation: 'FK8 (2017-2021)', years: '2017-2021', engine: '2.0 VTEC Turbo' },
    ],
    tags: ['intake', 'air-filter', 'turbo'],
    isFlashSale: true,
    flashSaleEnd: '2024-12-31T23:59:59',
  },
  {
    id: '8',
    name: 'GReddy Profec Boost Controller',
    nameEn: 'GReddy Profec Boost Controller',
    slug: 'greddy-profec-boost-controller',
    price: 12500,
    images: ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600'],
    brand: 'GReddy',
    category: 'อิเล็กทรอนิกส์',
    categorySlug: 'electronics',
    sku: 'GRD-ELC-001',
    stock: 15,
    rating: 4.7,
    reviewCount: 45,
    description: 'Electronic boost controller with OLED display. Precise boost pressure management with scramble boost feature.',
    specs: { 'Display': 'OLED', 'Boost Range': '0-300 kPa', 'Modes': '3 Presets + Scramble', 'Control': 'Stepping Motor' },
    compatibility: [
      { brand: 'Honda', model: 'Civic', generation: 'FK8 (2017-2021)', years: '2017-2021', engine: '2.0 VTEC Turbo' },
      { brand: 'Subaru', model: 'WRX STI', generation: 'VAB (2014-2021)', years: '2014-2021', engine: 'EJ257' },
    ],
    tags: ['boost-controller', 'electronics', 'turbo'],
  },
]

export const vehicles: Vehicle[] = [
  {
    brand: 'Honda',
    models: [
      {
        name: 'Civic',
        generations: [
          { name: 'FD (2006-2011)', years: '2006-2011', engines: ['1.8 i-VTEC', '2.0 i-VTEC'] },
          { name: 'FB (2012-2015)', years: '2012-2015', engines: ['1.8 i-VTEC', '2.0 i-VTEC'] },
          { name: 'FC (2016-2021)', years: '2016-2021', engines: ['1.5 VTEC Turbo', '1.8 i-VTEC'] },
          { name: 'FK8 (2017-2021)', years: '2017-2021', engines: ['2.0 VTEC Turbo'] },
          { name: 'FL5 (2022-Present)', years: '2022-2025', engines: ['2.0 VTEC Turbo'] },
        ],
      },
      {
        name: 'Jazz',
        generations: [
          { name: 'GE (2008-2014)', years: '2008-2014', engines: ['1.5 i-VTEC'] },
          { name: 'GK (2014-2020)', years: '2014-2020', engines: ['1.5 i-VTEC', '1.5 i-DCD'] },
        ],
      },
      {
        name: 'Accord',
        generations: [
          { name: 'G8 (2008-2013)', years: '2008-2013', engines: ['2.0 i-VTEC', '2.4 i-VTEC'] },
          { name: 'G9 (2013-2018)', years: '2013-2018', engines: ['2.0 i-VTEC', '2.4 i-VTEC'] },
          { name: 'G10 (2019-Present)', years: '2019-2025', engines: ['1.5 VTEC Turbo', '2.0 e:HEV'] },
        ],
      },
    ],
  },
  {
    brand: 'Toyota',
    models: [
      {
        name: '86',
        generations: [
          { name: 'ZN6 (2012-2021)', years: '2012-2021', engines: ['FA20 2.0 Boxer'] },
          { name: 'ZN8 GR86 (2022-Present)', years: '2022-2025', engines: ['FA24 2.4 Boxer'] },
        ],
      },
      {
        name: 'Supra',
        generations: [
          { name: 'A90 (2019-Present)', years: '2019-2025', engines: ['B58 3.0 Turbo', 'B48 2.0 Turbo'] },
        ],
      },
      {
        name: 'Yaris',
        generations: [
          { name: 'GXPA16 GR Yaris (2020-Present)', years: '2020-2025', engines: ['G16E-GTS 1.6 Turbo'] },
        ],
      },
    ],
  },
  {
    brand: 'Subaru',
    models: [
      {
        name: 'WRX STI',
        generations: [
          { name: 'VAB (2014-2021)', years: '2014-2021', engines: ['EJ257 2.5 Turbo'] },
        ],
      },
      {
        name: 'BRZ',
        generations: [
          { name: 'ZC6 (2012-2021)', years: '2012-2021', engines: ['FA20 2.0 Boxer'] },
          { name: 'ZD8 (2022-Present)', years: '2022-2025', engines: ['FA24 2.4 Boxer'] },
        ],
      },
    ],
  },
  {
    brand: 'Nissan',
    models: [
      {
        name: '370Z',
        generations: [
          { name: 'Z34 (2009-2020)', years: '2009-2020', engines: ['VQ37VHR 3.7 V6'] },
        ],
      },
      {
        name: 'GT-R',
        generations: [
          { name: 'R35 (2007-Present)', years: '2007-2025', engines: ['VR38DETT 3.8 Twin-Turbo V6'] },
        ],
      },
    ],
  },
  {
    brand: 'Mazda',
    models: [
      {
        name: 'MX-5',
        generations: [
          { name: 'ND (2015-Present)', years: '2015-2025', engines: ['Skyactiv-G 1.5', 'Skyactiv-G 2.0'] },
        ],
      },
      {
        name: '3',
        generations: [
          { name: 'BP (2019-Present)', years: '2019-2025', engines: ['Skyactiv-G 2.0', 'Skyactiv-X 2.0'] },
        ],
      },
    ],
  },
]

export const orders: Order[] = [
  { id: '1', orderNumber: '#HG20240S21001', customer: 'นายธนกร ศรีสุข', items: [], total: 34800, status: 'pending', paymentMethod: 'Credit Card', paymentStatus: 'paid', createdAt: '2024-05-21 10:30', shippingAddress: 'Bangkok' },
  { id: '2', orderNumber: '#HG20240S21000', customer: 'นายธนกร ศรีสุข', items: [], total: 15900, status: 'processing', paymentMethod: 'PromptPay', paymentStatus: 'paid', createdAt: '2024-05-21 09:15', shippingAddress: 'Bangkok' },
  { id: '3', orderNumber: '#HG20240S10099', customer: 'นายธนกร ศรีสุข', items: [], total: 24500, status: 'shipped', paymentMethod: 'Bank Transfer', paymentStatus: 'paid', createdAt: '2024-05-20 18:45', shippingAddress: 'Chiang Mai' },
  { id: '4', orderNumber: '#HG20240S10098', customer: 'นายธนกร ศรีสุข', items: [], total: 45900, status: 'delivered', paymentMethod: 'Credit Card', paymentStatus: 'paid', createdAt: '2024-05-20 14:20', shippingAddress: 'Phuket' },
  { id: '5', orderNumber: '#HG20240S10097', customer: 'นายธนกร ศรีสุข', items: [], total: 3290, status: 'pending', paymentMethod: 'COD', paymentStatus: 'pending', createdAt: '2024-05-20 11:05', shippingAddress: 'Nonthaburi' },
]

export const adminStats: AdminStats = {
  revenue: 285450,
  revenueChange: 12.5,
  orders: 128,
  ordersChange: 8.3,
  visitors: 32,
  visitorsChange: 15.2,
  customers: 4642,
  customersChange: 5.1,
}

export const salesData: SalesData[] = [
  { month: 'Jan', revenue: 180000, orders: 85 },
  { month: 'Feb', revenue: 220000, orders: 102 },
  { month: 'Mar', revenue: 195000, orders: 91 },
  { month: 'Apr', revenue: 310000, orders: 145 },
  { month: 'May', revenue: 285000, orders: 128 },
  { month: 'Jun', revenue: 350000, orders: 162 },
  { month: 'Jul', revenue: 420000, orders: 195 },
  { month: 'Aug', revenue: 380000, orders: 178 },
  { month: 'Sep', revenue: 290000, orders: 135 },
  { month: 'Oct', revenue: 340000, orders: 158 },
  { month: 'Nov', revenue: 450000, orders: 210 },
  { month: 'Dec', revenue: 520000, orders: 242 },
]

export const categorySales: CategorySales[] = [
  { name: 'Engine', value: 35, color: '#D6001C' },
  { name: 'Suspension', value: 25, color: '#FF1A35' },
  { name: 'Exhaust', value: 20, color: '#FF4D63' },
  { name: 'Wheel', value: 10, color: '#FF8090' },
  { name: 'Brake', value: 10, color: '#FFB3BD' },
]
