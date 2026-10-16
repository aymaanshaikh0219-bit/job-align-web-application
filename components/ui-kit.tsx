import { FlaskConical } from 'lucide-react'
import { matchTone } from '@/lib/skills'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.ComponentProps<'section'>) {
  return <section className={cn('rounded-xl border bg-card p-4 sm:p-5', className)} {...props} />
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-pretty text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function DemoBadge({ label = 'Demo', className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-warning',
        className,
      )}
    >
      <FlaskConical className="size-3" aria-hidden="true" />
      {label}
    </span>
  )
}

export function Notice({
  children,
  tone = 'warning',
  className,
}: {
  children: React.ReactNode
  tone?: 'warning' | 'info'
  className?: string
}) {
  return (
    <div
      role="note"
      className={cn(
        'rounded-lg border px-3 py-2.5 text-sm',
        tone === 'warning'
          ? 'border-warning/30 bg-warning/10 text-foreground'
          : 'border-primary/25 bg-primary/5 text-foreground',
        className,
      )}
    >
      {children}
    </div>
  )
}

const toneClasses = {
  strong: 'bg-success/12 text-success border-success/30',
  fair: 'bg-warning/12 text-warning border-warning/30',
  low: 'bg-muted text-muted-foreground border-border',
}

export function MatchBadge({ score, className }: { score: number; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums',
        toneClasses[matchTone(score)],
        className,
      )}
    >
      {score}% match
    </span>
  )
}

export function ProgressRing({
  value,
  size = 72,
  stroke = 7,
  label,
}: {
  value: number
  size?: number
  stroke?: number
  label?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const tone = matchTone(value)
  const color = tone === 'strong' ? 'var(--success)' : tone === 'fair' ? 'var(--warning)' : 'var(--muted-foreground)'
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={label ?? `${value}%`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (Math.min(value, 100) / 100) * c}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-semibold tabular-nums">{value}%</span>
    </div>
  )
}

export function SkillChip({
  skill,
  variant = 'neutral',
  onRemove,
}: {
  skill: string
  variant?: 'neutral' | 'have' | 'missing'
  onRemove?: () => void
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium',
        variant === 'have' && 'border-success/30 bg-success/10 text-success',
        variant === 'missing' && 'border-dashed border-destructive/40 bg-destructive/5 text-destructive',
        variant === 'neutral' && 'bg-muted text-foreground',
      )}
    >
      {skill}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${skill}`}
          className="-mr-0.5 rounded px-0.5 text-current opacity-60 hover:opacity-100"
        >
          ×
        </button>
      )}
    </span>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-card px-6 py-12 text-center">
      <div className="mb-3 grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">{icon}</div>
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
