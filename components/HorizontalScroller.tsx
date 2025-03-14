"use client"

import { useRef, useEffect } from "react"
import type React from "react" // Added import for React

interface HorizontalScrollerProps {
  children: React.ReactNode
}

export function HorizontalScroller({ children }: HorizontalScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const scrollLeft = () => {
      scroller.scrollBy({ left: -200, behavior: "smooth" })
    }

    const scrollRight = () => {
      scroller.scrollBy({ left: 200, behavior: "smooth" })
    }

    const leftButton = document.getElementById("scrollLeft")
    const rightButton = document.getElementById("scrollRight")

    leftButton?.addEventListener("click", scrollLeft)
    rightButton?.addEventListener("click", scrollRight)

    return () => {
      leftButton?.removeEventListener("click", scrollLeft)
      rightButton?.removeEventListener("click", scrollRight)
    }
  }, [])

  return (
    <div className="overflow-x-auto flex space-x-2 pb-4" ref={scrollerRef}>
      {children}
    </div>
  )
}

