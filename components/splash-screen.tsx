
'use client'

import Image from 'next/image'

export function SplashScreen() {
  return (
    <main className="fixed inset-0 z-[99999] flex min-h-screen w-screen items-center justify-center overflow-hidden bg-white">
      <div className="flex w-full flex-col items-center justify-center px-6">
        <Image
          src="/jobalign-logo.jpg"
          alt="JobAlign — Aligning Talent. Building Futures."
          width={1000}
          height={1000}
          priority
          className="h-auto w-full max-w-[780px] object-contain"
        />
      </div>
    </main>
  )
}
