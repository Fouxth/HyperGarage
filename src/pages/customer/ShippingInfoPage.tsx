import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Truck, Clock, MapPin, PackageCheck } from 'lucide-react'

const methods = [
  {
    icon: Truck,
    th: { name: 'จัดส่งมาตรฐาน', time: '2-4 วันทำการ', fee: 'เริ่มต้น ฿50 (ฟรีเมื่อซื้อครบ ฿1,500)' },
    en: { name: 'Standard Delivery', time: '2-4 business days', fee: 'From ฿50 (free over ฿1,500)' },
  },
  {
    icon: PackageCheck,
    th: { name: 'จัดส่งด่วน', time: '1-2 วันทำการ', fee: '฿120 ทั่วประเทศ' },
    en: { name: 'Express Delivery', time: '1-2 business days', fee: '฿120 nationwide' },
  },
]

const steps = {
  th: [
    'เมื่อสั่งซื้อสำเร็จ ระบบจะล็อกสต็อกและสร้างหมายเลขคำสั่งซื้อให้ทันที',
    'ทีมงานตรวจสอบและแพ็กสินค้าภายใน 24 ชั่วโมง (เว้นวันหยุด)',
    'จัดส่งผ่านบริษัทขนส่งพันธมิตร พร้อมอัปเดตสถานะเป็น "จัดส่งแล้ว"',
    'ติดตามสถานะได้ตลอดเวลาที่หน้าติดตามคำสั่งซื้อด้วยเบอร์โทรศัพท์',
  ],
  en: [
    'Once your order is placed, stock is reserved and an order number is generated instantly.',
    'Our team verifies and packs your items within 24 hours (excluding holidays).',
    'Shipped via our partner couriers, with status updated to "Shipped".',
    'Track the status anytime on the Order Tracking page using your phone number.',
  ],
}

export default function ShippingInfoPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('th') ? 'th' : 'en'

  return (
    <div className="min-h-screen bg-bg py-8 md:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>{t('order.backHome')}</span>
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Truck className="w-5 h-5" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('footer.shippingInfo')}</h1>
        </div>
        <p className="text-sm text-muted mb-8">
          {lang === 'th' ? 'รูปแบบการจัดส่ง ระยะเวลา และค่าบริการของ HyperGarage' : 'Delivery options, timelines, and fees at HyperGarage.'}
        </p>

        {/* Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {methods.map((m, i) => {
            const Icon = m.icon
            const info = m[lang]
            return (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-white">{info.name}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-light">
                    <Clock className="w-4 h-4 text-muted" /> {info.time}
                  </div>
                  <div className="flex items-center gap-2 text-muted-light">
                    <MapPin className="w-4 h-4 text-muted" /> {info.fee}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Process */}
        <h2 className="text-lg font-semibold text-white mb-4">
          {lang === 'th' ? 'ขั้นตอนการจัดส่ง' : 'Delivery Process'}
        </h2>
        <div className="rounded-xl border border-border bg-card p-6">
          <ol className="space-y-4">
            {steps[lang].map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <p className="text-sm text-muted leading-relaxed pt-0.5">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
