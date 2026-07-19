import { useState } from 'react'
import { motion } from 'framer-motion'
import { Undo2, Check, X as XIcon, RotateCcw } from 'lucide-react'
import { useReturns, useUpdateReturnStatus } from '@/api/hooks'
import type { ReturnStatus } from '@/types'

const statusOptions: (ReturnStatus | 'All')[] = ['All', 'requested', 'approved', 'rejected', 'refunded']

const statusLabels: Record<ReturnStatus, string> = {
  requested: 'รอตรวจสอบ',
  approved: 'อนุมัติแล้ว (รอคืนเงิน)',
  rejected: 'ปฏิเสธคำขอ',
  refunded: 'คืนเงินแล้ว',
}

function statusClass(status: ReturnStatus) {
  switch (status) {
    case 'requested': return 'bg-warning/15 text-warning'
    case 'approved': return 'bg-primary/15 text-primary'
    case 'rejected': return 'bg-error/15 text-error'
    case 'refunded': return 'bg-success/15 text-success'
  }
}

export default function ReturnsPage() {
  const [statusFilter, setStatusFilter] = useState<ReturnStatus | 'All'>('All')
  const { data: returns = [], isLoading } = useReturns(statusFilter)
  const updateStatus = useUpdateReturnStatus()
  const [refundAmounts, setRefundAmounts] = useState<Record<string, string>>({})

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <Undo2 className="w-7 h-7 text-primary" /> คืนสินค้า/คืนเงิน (Returns)
      </h1>
      <p className="text-sm text-muted">จัดการคำขอคืนสินค้าจากลูกค้า อนุมัติแล้วระบบจะเพิ่มสต็อกสินค้ากลับเข้าคลังให้อัตโนมัติ</p>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as ReturnStatus | 'All')}
        className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm text-white outline-none focus:border-primary/50"
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>{s === 'All' ? 'ทุกสถานะ' : statusLabels[s]}</option>
        ))}
      </select>

      <div className="rounded-xl border border-border bg-card divide-y divide-border/50">
        {returns.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{r.orderNumber} · {r.customer}</p>
              <p className="text-xs text-muted">{r.reason}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(r.status)}`}>
              {statusLabels[r.status]}
            </span>
            {r.status === 'requested' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateStatus.mutate({ id: r.id, input: { status: 'approved' } })}
                  disabled={updateStatus.isPending}
                  className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  <Check size={13} /> อนุมัติ
                </button>
                <button
                  onClick={() => updateStatus.mutate({ id: r.id, input: { status: 'rejected' } })}
                  disabled={updateStatus.isPending}
                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-light hover:text-white"
                >
                  <XIcon size={13} /> ปฏิเสธ
                </button>
              </div>
            )}
            {r.status === 'approved' && (
              <div className="flex items-center gap-2">
                <input
                  value={refundAmounts[r.id] ?? ''}
                  onChange={(e) => setRefundAmounts({ ...refundAmounts, [r.id]: e.target.value })}
                  placeholder="ยอดคืนเงิน (฿)"
                  className="w-32 rounded-lg border border-border bg-bg px-2 py-1.5 text-xs text-white outline-none focus:border-primary"
                />
                <button
                  onClick={() => updateStatus.mutate({ id: r.id, input: { status: 'refunded', refundAmount: Number(refundAmounts[r.id]) || undefined } })}
                  disabled={updateStatus.isPending}
                  className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
                >
                  <RotateCcw size={13} /> ยืนยันคืนเงิน
                </button>
              </div>
            )}
            {r.refundAmount != null && <span className="text-xs text-muted-light">คืนเงินแล้ว ฿{r.refundAmount.toLocaleString()}</span>}
          </div>
        ))}
        {!isLoading && returns.length === 0 && (
          <p className="px-5 py-16 text-center text-sm text-muted">ไม่มีคำขอคืนสินค้าในขณะนี้</p>
        )}
      </div>
    </motion.div>
  )
}
