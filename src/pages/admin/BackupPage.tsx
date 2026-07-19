import { useState } from 'react'
import { motion } from 'framer-motion'
import { HardDrive, Database, Download } from 'lucide-react'
import { api } from '@/api/client'

export default function BackupPage() {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setDownloading(true)
    setError(null)
    try {
      const blob = await api.backupExport()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hypergarage-backup-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ดาวน์โหลดข้อมูลสำรองไม่สำเร็จ')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <HardDrive className="w-7 h-7 text-primary" /> สำรองข้อมูล (Backup)
      </h1>

      <div className="max-w-xl rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-start gap-3">
          <Database className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted" />
          <p className="text-sm text-white">
            ดาวน์โหลดข้อมูลสำคัญของร้านทั้งหมด (สินค้า, ตัวเลือกสินค้า, หมวดหมู่, แบรนด์, คำสั่งซื้อ, คูปอง, รีวิว, คำขอคืนสินค้า, ลูกค้า, การตั้งค่าร้าน) เป็นไฟล์ JSON ไฟล์เดียว
          </p>
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> {downloading ? 'กำลังดาวน์โหลด...' : 'ดาวน์โหลดข้อมูลสำรอง'}
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <p className="text-xs text-muted">
          * สำหรับการสำรองข้อมูลระดับฐานข้อมูล (point-in-time recovery) แนะนำให้ตั้งค่า backup อัตโนมัติที่ผู้ให้บริการ PostgreSQL โดยตรงเพิ่มเติม
        </p>
      </div>
    </motion.div>
  )
}
