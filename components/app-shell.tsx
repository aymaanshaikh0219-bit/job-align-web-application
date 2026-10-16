'use client'

import {
  Bookmark,
  Briefcase,
  FileText,
  LayoutDashboard,
  Settings,
  Target,
  UserRound,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BrandLogo, BrandMark } from '@/components/brand-logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { DemoBadge } from '@/components/ui-kit'
import { useAppState } from '@/lib/app-store'
import { theme } from '@/lib/theme'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/', label: 'Dashboard', short: 'Home', icon: LayoutDashboard, mobile: true },
  { href: '/jobs', label: 'Find jobs', short: 'Jobs', icon: Briefcase, mobile: true },
  { href: '/resume', label: 'My resume', short: 'Resume', icon: FileText, mobile: true },
  { href: '/skills', label: 'Skill gaps', short: 'Skills', icon: Target, mobile: true },
  { href: '/saved', label: 'Saved jobs', short: 'Saved', icon: Bookmark, mobile: true },
  { href: '/profile', label: 'Profile', short: 'Profile', icon: UserRound, mobile: false },
  { href: '/settings', label: 'Settings & status', short: 'Settings', icon: Settings, mobile: false },
]

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?'
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { profile, savedJobs } = useAppState()

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r bg-card px-3 py-5 lg:flex">
        <Link href="/" className="px-2">
          <BrandLogo />
        </Link>
        <nav aria-label="Main" className="mt-8 flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <item.icon className="size-[18px]" aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                {item.href === '/saved' && savedJobs.length > 0 && (
                  <span className="rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground tabular-nums">
                    {savedJobs.length}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
          <DemoBadge label="Demo mode" />
          <p className="mt-2 leading-relaxed">
            No sign-in. Data stays in this browser. See{' '}
            <Link href="/settings" className="font-medium text-primary underline-offset-2 hover:underline">
              status
            </Link>
            .
          </p>
        </div>
        <Link
          href="/profile"
          className="mt-3 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
            {initials(profile.name)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{profile.name}</span>
            <span className="block truncate text-xs text-muted-foreground">{profile.email}</span>
          </span>
        </Link>
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur lg:px-8">
          <Link href="/" className="flex items-center gap-2 lg:hidden" aria-label={`${theme.brandName} home`}>
            <BrandMark className="size-8" />
            <span className="font-semibold">{theme.brandName}</span>
          </Link>
          <DemoBadge className="lg:hidden" />
          <p className="hidden text-sm text-muted-foreground lg:block">
            {theme.projectLabel} · <span className="text-foreground">Demo listings until a job API is connected</span>
          </p>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <Link
              href="/settings"
              aria-label="Settings and status"
              className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            >
              <Settings className="size-[18px]" />
            </Link>
            <Link
              href="/profile"
              aria-label="Your profile"
              className="ml-1 grid size-8 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground lg:hidden"
            >
              {initials(profile.name)}
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-5 sm:pt-6 lg:px-8 lg:pb-10">{children}</main>

        <nav
          aria-label="Main"
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        >
          {nav
            .filter((n) => n.mobile)
            .map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium',
                    active ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  <item.icon className="size-5" aria-hidden="true" />
                  {item.short}
                  {item.href === '/saved' && savedJobs.length > 0 && (
                    <span className="absolute right-[calc(50%-18px)] top-1.5 size-2 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
        </nav>
      </div>
    </div>
  )
}
