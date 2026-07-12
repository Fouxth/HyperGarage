import { useTranslation } from 'react-i18next'
import { Newspaper } from 'lucide-react'

export default function BlogPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <Newspaper className="h-16 w-16 text-muted" />
      <h1 className="text-xl font-bold">{t('blog.title', 'Blog')}</h1>
      <p className="max-w-md text-sm text-muted">
        {t('blog.comingSoon', "We're working on tuning guides, product spotlights, and build features. Check back soon.")}
      </p>
    </div>
  )
}
