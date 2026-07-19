import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle } from 'lucide-react'

const steps = {
  th: [
    'แจ้งความประสงค์ขอคืน/เปลี่ยนสินค้าภายใน 7 วันนับจากวันที่ได้รับ ผ่านหน้าติดต่อเราหรือโทรหาเจ้าหน้าที่',
    'แจ้งหมายเลขคำสั่งซื้อและแนบรูปถ่ายสินค้า/ปัญหาที่พบ',
    'เจ้าหน้าที่ตรวจสอบและแจ้งที่อยู่สำหรับส่งคืนภายใน 1-2 วันทำการ',
    'เมื่อได้รับสินค้าคืนและตรวจสอบเรียบร้อย จะคืนเงินหรือจัดส่งสินค้าใหม่ให้ภายใน 3-5 วันทำการ',
  ],
  en: [
    'Notify us of a return/exchange within 7 days of receiving the item, via the Contact page or by phone.',
    'Provide your order number and attach photos of the product/issue.',
    'Our team reviews and sends you the return address within 1-2 business days.',
    'Once the returned item is received and checked, we issue a refund or ship a replacement within 3-5 business days.',
  ],
}

const eligible = {
  th: ['สินค้าชำรุด/เสียหายจากการผลิต', 'ได้รับสินค้าผิดรุ่นหรือผิดรายการ', 'อะไหล่ไม่ตรงกับที่ระบบ Compatibility แจ้งไว้'],
  en: ['Defective or damaged on arrival', 'Wrong model or wrong item received', 'Part does not match the Compatibility Checker result'],
}

const notEligible = {
  th: ['สินค้าถูกติดตั้ง/ใช้งานแล้ว', 'เกิน 7 วันนับจากวันที่ได้รับสินค้า', 'ความเสียหายจากการติดตั้งผิดวิธีหรืออุบัติเหตุ'],
  en: ['Item already installed or used', 'More than 7 days since delivery', 'Damage from incorrect installation or accidents'],
}

export default function ReturnsPage() {
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
            <RotateCcw className="w-5 h-5" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('footer.returns')}</h1>
        </div>
        <p className="text-sm text-muted mb-8">
          {lang === 'th' ? 'รับประกันความพึงพอใจ คืน/เปลี่ยนสินค้าได้ภายใน 7 วัน' : 'Satisfaction guaranteed — return or exchange within 7 days.'}
        </p>

        {/* Steps */}
        <h2 className="text-lg font-semibold text-white mb-4">{lang === 'th' ? 'ขั้นตอนการคืนสินค้า' : 'How to Return'}</h2>
        <div className="rounded-xl border border-border bg-card p-6 mb-10">
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

        {/* Conditions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-semibold text-white mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {lang === 'th' ? 'เงื่อนไขที่คืนได้' : 'Eligible'}
            </h3>
            <ul className="space-y-2">
              {eligible[lang].map((c, i) => (
                <li key={i} className="text-sm text-muted leading-relaxed">• {c}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-semibold text-white mb-3">
              <XCircle className="w-4 h-4 text-red-500" /> {lang === 'th' ? 'เงื่อนไขที่คืนไม่ได้' : 'Not Eligible'}
            </h3>
            <ul className="space-y-2">
              {notEligible[lang].map((c, i) => (
                <li key={i} className="text-sm text-muted leading-relaxed">• {c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/order-tracking" className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-muted-light hover:text-white hover:border-primary/50 transition-colors">
            {t('footer.orderTracking')}
          </Link>
          <Link to="/contact" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
            {t('footer.contact')}
          </Link>
        </div>
      </div>
    </div>
  )
}
