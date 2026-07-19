import { Landmark } from 'lucide-react'
import { findBank, bankInitials } from '@/lib/banks'

export default function BankBadge({ bankName, size = 32 }: { bankName: string | undefined; size?: number }) {
  const bank = findBank(bankName)

  if (!bank) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex flex-shrink-0 items-center justify-center rounded-full bg-border text-muted-light"
      >
        <Landmark size={size * 0.55} />
      </div>
    )
  }

  return (
    <div
      style={{ width: size, height: size, backgroundColor: bank.color, fontSize: size * 0.32 }}
      className="flex flex-shrink-0 items-center justify-center rounded-full font-bold text-white"
      title={bank.name}
    >
      {bankInitials(bank)}
    </div>
  )
}
