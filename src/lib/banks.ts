export interface Bank {
  name: string
  short: string
  color: string
}

export const THAI_BANKS: Bank[] = [
  { name: 'ธนาคารกสิกรไทย', short: 'KBank', color: '#0A8043' },
  { name: 'ธนาคารไทยพาณิชย์', short: 'SCB', color: '#4E2A84' },
  { name: 'ธนาคารกรุงเทพ', short: 'BBL', color: '#1E4598' },
  { name: 'ธนาคารกรุงไทย', short: 'KTB', color: '#1BA5E1' },
  { name: 'ธนาคารกรุงศรีอยุธยา', short: 'BAY', color: '#FEC43B' },
  { name: 'ธนาคารทหารไทยธนชาต', short: 'ttb', color: '#0C3A8C' },
  { name: 'ธนาคารออมสิน', short: 'GSB', color: '#EB198D' },
  { name: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร', short: 'BAAC', color: '#4C9F38' },
  { name: 'ธนาคารซีไอเอ็มบีไทย', short: 'CIMB', color: '#7E2E38' },
  { name: 'ธนาคารยูโอบี', short: 'UOB', color: '#0B3B7A' },
  { name: 'ธนาคารทิสโก้', short: 'TISCO', color: '#00539B' },
  { name: 'ธนาคารเกียรตินาคินภัทร', short: 'KKP', color: '#6E267B' },
]

export function findBank(name: string | undefined | null): Bank | undefined {
  if (!name) return undefined
  return THAI_BANKS.find((b) => b.name === name)
}

export function bankInitials(bank: Bank) {
  return bank.short.slice(0, 2).toUpperCase()
}
