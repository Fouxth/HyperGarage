import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import { useReports } from '@/api/hooks'
import { useTranslation } from 'react-i18next'

export default function ReportsPage() {
  const { t } = useTranslation()
  const { data: reports, isLoading } = useReports()

  const translateMethod = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cod':
      case 'cash on delivery':
        return 'เก็บเงินปลายทาง (COD)'
      case 'transfer':
      case 'bank transfer':
        return 'โอนเงินผ่านธนาคาร'
      case 'card':
      case 'credit card':
        return 'บัตรเครดิต/เดบิต'
      default:
        return method
    }
  }

  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'รอชำระเงิน'
      case 'processing': return 'กำลังเตรียมจัดส่ง'
      case 'shipped': return 'จัดส่งแล้ว'
      case 'delivered': return 'ส่งถึงแล้ว'
      case 'cancelled': return 'ยกเลิกคำสั่งซื้อ'
      default: return status
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-8">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <BarChart3 className="w-7 h-7 text-primary" /> {t('admin.reportsPage.title')}
      </h1>

      {isLoading && <p className="text-sm text-muted">กำลังโหลดข้อมูล…</p>}

      {reports && (
        <>
          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-light">{t('admin.reportsPage.topProducts')}</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-5 py-3 text-muted font-medium">{t('admin.reportsPage.productCol')}</th>
                    <th className="px-5 py-3 text-muted font-medium">{t('admin.reportsPage.unitsCol')}</th>
                    <th className="px-5 py-3 text-muted font-medium">{t('admin.reportsPage.revenueCol')}</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.topProducts.map((p) => (
                    <tr key={p.name} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                      <td className="px-5 py-3 text-white font-medium">{p.name}</td>
                      <td className="px-5 py-3 text-muted-light">{p.quantity} ชิ้น</td>
                      <td className="px-5 py-3 font-semibold text-primary">฿{p.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                  {reports.topProducts.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-5 py-12 text-center text-muted">
                        {t('admin.reportsPage.noSales')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <section>
              <h2 className="mb-3 text-sm font-semibold text-muted-light">{t('admin.reportsPage.revByMethod')}</h2>
              <div className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-lg">
                {reports.revenueByPaymentMethod.map((r) => (
                  <div key={r.method} className="flex items-center justify-between text-sm">
                    <span className="text-muted-light font-medium">{translateMethod(r.method)}</span>
                    <span className="font-semibold text-white">฿{r.total.toLocaleString()}</span>
                  </div>
                ))}
                {reports.revenueByPaymentMethod.length === 0 && <p className="text-sm text-muted text-center py-6">{t('admin.reportsPage.noOrders')}</p>}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold text-muted-light">{t('admin.reportsPage.orderByStatus')}</h2>
              <div className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-lg">
                {reports.ordersByStatus.map((r) => (
                  <div key={r.status} className="flex items-center justify-between text-sm">
                    <span className="text-muted-light font-medium">{translateStatus(r.status)}</span>
                    <span className="font-semibold text-white">{r.count} ออเดอร์</span>
                  </div>
                ))}
                {reports.ordersByStatus.length === 0 && <p className="text-sm text-muted text-center py-6">{t('admin.reportsPage.noOrders')}</p>}
              </div>
            </section>
          </div>
        </>
      )}
    </motion.div>
  )
}
