'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export default function TestTabs({ testType }: { testType: string }) {
  const pathname = usePathname()

  const tabs = [
    { label: 'Overview', href: `/${testType}` },
    { label: 'Listening', href: `/${testType}/listening` },
    { label: 'Reading', href: `/${testType}/reading` },
    { label: 'Writing', href: `/${testType}/writing` },
    { label: 'Speaking', href: `/${testType}/speaking` },
  ]

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '40px', marginTop: '20px' }}>
      {tabs.map((tab, i) => {
        const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`)
        return (
          <a 
            key={i} 
            href={tab.href} 
            className="btn btn-outline btn-sm" 
            style={{ 
              backgroundColor: isActive ? 'var(--color-purple)' : 'transparent', 
              color: isActive ? '#fff' : 'var(--color-text)', 
              borderColor: isActive ? 'var(--color-purple)' : 'var(--color-border)',
              padding: '8px 16px',
              borderRadius: '20px'
            }}
          >
            {tab.label}
          </a>
        )
      })}
    </div>
  )
}
