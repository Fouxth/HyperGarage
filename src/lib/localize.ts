export function localizedName(item: { name: string; nameEn: string }, lang: string) {
  return lang.startsWith('th') ? item.name : item.nameEn
}
