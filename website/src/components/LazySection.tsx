'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

interface LazySectionProps {
  children: ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  fallback?: ReactNode
}

export default function LazySection({
  children,
  className = '',
  threshold = 0.1,
  rootMargin = '100px',
  fallback = <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={sectionRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  )
}
