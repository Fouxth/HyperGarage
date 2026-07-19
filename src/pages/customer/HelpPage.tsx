import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, LifeBuoy, ChevronDown, Search, Truck, RotateCcw, Phone } from 'lucide-react'

type QA = { q: { th: string; en: string }; a: { th: string; en: string } }

const faqs: QA[] = [
  {
    q: { th: 'ต้องสมัครสมาชิกก่อนสั่งซื้อไหม?', en: 'Do I need an account to order?' },
    a: {
      th: 'ไม่ต้องครับ HyperGarage รองรับการสั่งซื้อแบบ Guest Checkout เพียงกรอกชื่อ เบอร์โทร และที่อยู่จัดส่ง ก็สั่งซื้อได้ทันที และติดตามคำสั่งซื้อได้ด้วยเบอร์โทรศัพท์',
      en: 'No. HyperGarage supports Guest Checkout — just enter your name, phone number, and shipping address to order, then track it using your phone number.',
    },
  },
  {
    q: { th: 'จะรู้ได้อย่างไรว่าอะไหล่เข้ากับรถของผม?', en: 'How do I know a part fits my car?' },
    a: {
      th: 'ใช้ระบบตรวจสอบความเข้ากันได้ (Compatibility Checker) เลือกยี่ห้อ → รุ่น → ปีรถ → รหัสเครื่องยนต์ ระบบจะแสดงเฉพาะอะไหล่ที่ใช้กับรถคันนั้นได้จริง',
      en: 'Use the Compatibility Checker: select brand → model → year → engine code, and the system will show only parts that fit that exact vehicle.',
    },
  },
  {
    q: { th: 'มีช่องทางการชำระเงินอะไรบ้าง?', en: 'What payment methods are available?' },
    a: {
      th: 'รองรับเก็บเงินปลายทาง (COD), โอนผ่านธนาคาร และสแกนจ่ายด้วย QR พร้อมเพย์ โดยระบบจะแสดงเลขบัญชีและ QR ให้อัตโนมัติเมื่อเลือกช่องทางโอนเงิน',
      en: 'We support Cash on Delivery (COD), bank transfer, and PromptPay QR. The account number and QR code appear automatically when you choose bank transfer.',
    },
  },
  {
    q: { th: 'จัดส่งใช้เวลากี่วัน?', en: 'How long does delivery take?' },
    a: {
      th: 'การจัดส่งแบบมาตรฐานใช้เวลา 2-4 วันทำการ และแบบด่วนภายใน 1-2 วันทำการ ขึ้นอยู่กับพื้นที่จัดส่ง ดูรายละเอียดเพิ่มเติมได้ที่หน้าข้อมูลการจัดส่ง',
      en: 'Standard delivery takes 2-4 business days and express 1-2 business days, depending on your area. See the Shipping Info page for details.',
    },
  },
  {
    q: { th: 'ถ้าได้รับสินค้าผิดรุ่นหรือชำรุดต้องทำอย่างไร?', en: 'What if I receive a wrong or defective item?' },
    a: {
      th: 'ท่านสามารถขอคืนหรือเปลี่ยนสินค้าได้ภายใน 7 วันนับจากวันที่ได้รับสินค้า โดยสินค้าต้องอยู่ในสภาพเดิม ดูขั้นตอนได้ที่หน้าการคืนสินค้า',
      en: 'You can request a return or exchange within 7 days of receiving the item, provided it is in original condition. See the Returns page for the steps.',
    },
  },
  {
    q: { th: 'ติดตามสถานะคำสั่งซื้อได้ที่ไหน?', en: 'Where can I track my order status?' },
    a: {
      th: 'ไปที่หน้าติดตามคำสั่งซื้อ แล้วกรอกหมายเลขคำสั่งซื้อหรือเบอร์โทรศัพท์ที่ใช้ตอนสั่งซื้อ ระบบจะแสดงสถานะล่าสุดของออเดอร์ให้ทันที',
      en: 'Go to the Order Tracking page and enter your order number or the phone number used at checkout to see the latest status instantly.',
    },
  },
]

const shortcuts = [
  { to: '/shipping-info', icon: Truck, th: 'ข้อมูลการจัดส่ง', en: 'Shipping Info' },
  { to: '/returns', icon: RotateCcw, th: 'การคืนสินค้า', en: 'Returns' },
  { to: '/order-tracking', icon: Search, th: 'ติดตามคำสั่งซื้อ', en: 'Track Order' },
  { to: '/contact', icon: Phone, th: 'ติดต่อเรา', en: 'Contact Us' },
]

export default function HelpPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('th') ? 'th' : 'en'
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-bg py-8 md:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>{t('order.backHome')}</span>
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('footer.helpCenter')}</h1>
        </div>
        <p className="text-sm text-muted mb-8">
          {lang === 'th' ? 'คำถามที่พบบ่อยและทางลัดไปยังบริการที่คุณต้องการ' : 'Frequently asked questions and quick links to what you need.'}
        </p>

        {/* Quick shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {shortcuts.map((s) => {
            const Icon = s.icon
            return (
              <Link
                key={s.to}
                to={s.to}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center hover:border-primary/50 transition-colors"
              >
                <Icon className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium text-muted-light">{lang === 'th' ? s.th : s.en}</span>
              </Link>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-white">{item.q[lang]}</span>
                  <ChevronDown className={`w-4 h-4 flex-shrink-0 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-muted leading-relaxed border-t border-border pt-3">
                    {item.a[lang]}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
