'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function TestTrackToggle() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const track = searchParams.get('track') || 'Academic'

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
      <div style={{ 
        display: 'inline-flex', 
        background: 'var(--color-bg)', 
        border: '1px solid var(--color-border)', 
        borderRadius: '30px', 
        padding: '4px',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <button 
          onClick={() => router.push('?track=Academic')}
          style={{ 
            padding: '10px 24px', 
            borderRadius: '26px', 
            border: 'none', 
            background: track === 'Academic' ? 'var(--color-purple)' : 'transparent',
            color: track === 'Academic' ? '#fff' : 'var(--color-muted)',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.9rem'
          }}
        >
          Academic
        </button>
        <button 
          onClick={() => router.push('?track=General')}
          style={{ 
            padding: '10px 24px', 
            borderRadius: '26px', 
            border: 'none', 
            background: track === 'General' ? 'var(--color-purple)' : 'transparent',
            color: track === 'General' ? '#fff' : 'var(--color-muted)',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.9rem'
          }}
        >
          General Training
        </button>
      </div>
    </div>
  )
}
