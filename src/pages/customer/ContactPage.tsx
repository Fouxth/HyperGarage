import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react'
import { useSettings } from '@/api/hooks'

export default function ContactPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('th') ? 'th' : 'en'
  const { data: settings } = useSettings()

  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const email = settings?.contactEmail || 'support@hypergarage.com'
  const phone = settings?.contactPhone || '02-000-0000'
  const address = settings?.address || (lang === 'th' ? 'กรุงเทพมหานคร ประเทศไทย' : 'Bangkok, Thailand')

  const channels = [
    { icon: Phone, label: lang === 'th' ? 'โทรศัพท์' : 'Phone', value: phone, href: `tel:${phone.replace(/[^0-9+]/g, '')}` },
    { icon: Mail, label: lang === 'th' ? 'อีเมล' : 'Email', value: email, href: `mailto:${email}` },
    { icon: MapPin, label: lang === 'th' ? 'ที่อยู่' : 'Address', value: address },
    { icon: Clock, label: lang === 'th' ? 'เวลาทำการ' : 'Hours', value: lang === 'th' ? 'จันทร์-เสาร์ 9:00-18:00 น.' : 'Mon-Sat 9:00-18:00' },
  ]

  // Compose a prefilled email to the store — no data is sent from our servers.
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(subject || (lang === 'th' ? 'สอบถามข้อมูลจากเว็บไซต์' : 'Website enquiry'))}&body=${encodeURIComponent(`${lang === 'th' ? 'ชื่อ' : 'Name'}: ${name}\n\n${message}`)}`

  return (
    <div className="min-h-screen bg-bg py-8 md:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>{t('order.backHome')}</span>
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('footer.contact')}</h1>
        </div>
        <p className="text-sm text-muted mb-8">
          {lang === 'th' ? `ทีมงาน ${settings?.storeName || 'HyperGarage'} ยินดีให้บริการ ติดต่อได้ตามช่องทางด้านล่าง` : `The ${settings?.storeName || 'HyperGarage'} team is here to help. Reach us via the channels below.`}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact channels */}
          <div className="lg:col-span-2 space-y-3">
            {channels.map((c) => {
              const Icon = c.icon
              const inner = (
                <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                  <Icon className="w-5 h-5 flex-shrink-0 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">{c.label}</p>
                    <p className="text-sm text-white break-words">{c.value}</p>
                  </div>
                </div>
              )
              return c.href ? (
                <a key={c.label} href={c.href} className="block hover:opacity-90 transition-opacity">{inner}</a>
              ) : (
                <div key={c.label}>{inner}</div>
              )
            })}
          </div>

          {/* Message form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={(e) => { e.preventDefault(); window.location.href = mailtoHref }}
              className="rounded-2xl border border-border bg-card p-6 space-y-4"
            >
              <h2 className="font-semibold text-white">{lang === 'th' ? 'ส่งข้อความถึงเรา' : 'Send us a message'}</h2>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'th' ? 'ชื่อของคุณ' : 'Your name'}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-white outline-none focus:border-primary"
              />
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={lang === 'th' ? 'หัวข้อ' : 'Subject'}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-white outline-none focus:border-primary"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder={lang === 'th' ? 'รายละเอียดที่ต้องการสอบถาม...' : 'How can we help you?'}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-white outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {lang === 'th' ? 'ส่งข้อความ' : 'Send message'}
              </button>
              <p className="text-xs text-muted">
                {lang === 'th' ? 'ปุ่มนี้จะเปิดโปรแกรมอีเมลของคุณพร้อมข้อความที่กรอกไว้' : 'This opens your email app with the message pre-filled.'}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
