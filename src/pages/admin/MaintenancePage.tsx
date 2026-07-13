import { motion } from 'framer-motion'
import { Wrench } from 'lucide-react'
import { useSettings, useUpdateSettings } from '@/api/hooks'

export default function MaintenancePage() {
  const { data: settings } = useSettings()
  const updateSettings = useUpdateSettings()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <Wrench className="w-7 h-7 text-primary" /> ดูแลระบบ / ปรับปรุงร้านค้า (Maintenance)
      </h1>
      <p className="text-sm text-muted">
        การเปิดใช้งานโหมดปรับปรุงร้านค้า (Maintenance Mode) จะมีผลทำให้ลูกค้าทั่วไปไม่สามารถเข้าชมร้านค้าได้ 
        และจะแสดงหน้าจอปรับปรุงระบบขึ้นมาแทนที่ โดยที่ผู้ดูแลระบบยังคงสามารถล็อกอินเข้าหลังบ้านเพื่อทำการแก้ไขงานต่าง ๆ ได้ตามปกติ
      </p>

      <div className="max-w-xl rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">โหมดปรับปรุงร้านค้า (Maintenance Mode)</p>
            <p className="text-xs text-muted mt-1">
              สถานะปัจจุบัน: {settings?.maintenanceMode ? (
                <span className="text-primary font-bold">เปิดใช้งาน (ON) - ลูกค้าเข้าหน้าเว็บหลักไม่ได้</span>
              ) : (
                <span className="text-green-400 font-bold">ปิดการใช้งาน (OFF) - ร้านค้าเปิดขายปกติ</span>
              )}
            </p>
          </div>
          <button
            onClick={() => settings && updateSettings.mutate({ maintenanceMode: !settings.maintenanceMode })}
            className={`relative h-7 w-12 rounded-full transition-colors ${settings?.maintenanceMode ? 'bg-primary' : 'bg-white/10'}`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${settings?.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
