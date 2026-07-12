import React from 'react'
import { notFound } from 'next/navigation'
import { client } from '../../../../sanity/client'
import type { Metadata } from 'next'
import InteractiveReadingClient from './InteractiveReadingClient'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const test = await client.fetch(`*[_type == "ieltsReading" && slug.current == $slug][0] { title }`, {
    slug: resolvedParams.slug
  })
  
  if (!test) return { title: 'Test Not Found' }
  return { title: `${test.title} | IELTS Reading Practice` }
}

export default async function IELTSReadingTestPage({ params }: Props) {
  const resolvedParams = await params;
  
  const test = await client.fetch(`*[_type == "ieltsReading" && slug.current == $slug][0]`, { 
    slug: resolvedParams.slug 
  })

  if (!test) {
    notFound()
  }

  return <InteractiveReadingClient initialTest={test} />
}
