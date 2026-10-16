import Image from 'next/image'
import { theme } from '@/lib/theme'
import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  if (theme.logoSrc) {
    return (
      <Image
        src={theme.logoSrc}
        alt=""
        width={36}
        height={36}
        className={cn('size-9 rounded-lg object-contain', className)}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid size-9 place-items-center rounded-lg bg-primary text-base font-bold text-primary-foreground',
        className,
      )}
    >
      {theme.logoText}
    </span>
  )
}

export function BrandLogo({ showTagline = true }: { showTagline?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark />
      <span className="flex flex-col leading-tight">
        <span className="text-base font-semibold tracking-tight">{theme.brandName}</span>
        {showTagline && (
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {theme.tagline}
          </span>
        )}
      </span>
    </span>
  )
}
