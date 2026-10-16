
'use client'

import { useEffect, useState } from 'react'
import { DashboardView } from '@/components/views/dashboard-view'
import { SplashScreen } from '@/components/splash-screen'

export default function Page() {
  const [showSplash, setShowSplash] = useState(true)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const exitTimer = window.setTimeout(() => {
      setExiting(true)
    }, 2800)

    const finishTimer = window.setTimeout(() => {
      setShowSplash(false)
    }, 3800)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(finishTimer)
    }
  }, [])

  return (
    <>
      <div
        className={`transition-opacity duration-1000 ease-in-out ${
          showSplash ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <DashboardView />
      </div>

      {showSplash && (
        <div
          className={`fixed inset-0 z-[99999] transition-opacity duration-1000 ease-in-out ${
            exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <SplashScreen />
        </div>
      )}
    </>
  )
}
