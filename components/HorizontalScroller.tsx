"use client"

import { useRef, useEffect, useState } from "react"
import type React from "react"

interface HorizontalScrollerProps {
  children: React.ReactNode
  centerBucketId?: number
}

export function HorizontalScroller({ children, centerBucketId }: HorizontalScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  // Add a state to track if the component has mounted
  const [isMounted, setIsMounted] = useState(false)

  // Set up the scroll buttons
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

    // Mark component as mounted after first render
    setIsMounted(true)

    return () => {
      leftButton?.removeEventListener("click", scrollLeft)
      rightButton?.removeEventListener("click", scrollRight)
    }
  }, [])

  // Center the bucket after the component has fully mounted and rendered
  useEffect(() => {
    if (!isMounted || !centerBucketId || !scrollerRef.current) return

    // Use setTimeout to ensure DOM is fully rendered and measurements are accurate
    const timeoutId = setTimeout(() => {
      const targetBucketElement = document.getElementById(`bucket-${centerBucketId}`)
      const scroller = scrollerRef.current

      if (targetBucketElement && scroller) {

        // Get the position and dimensions
        const scrollerRect = scroller.getBoundingClientRect()
        const elementRect = targetBucketElement.getBoundingClientRect()

        // Calculate the current position of the element
        const elementLeftPosition = elementRect.left - scrollerRect.left + scroller.scrollLeft

        // For centering, calculate the center of the viewport and element
        if (centerBucketId) {
          // Calculate the center position
          const scrollerCenter = scrollerRect.width / 2
          const elementCenter = elementRect.width / 2

          // Calculate the position that will center the element
          const targetScrollPosition = elementLeftPosition - scrollerCenter + elementCenter

          // Apply the scroll
          scroller.scrollTo({
            left: targetScrollPosition,
            behavior: "smooth",
          })
        }
      }
    }, 100) // Small delay to ensure accurate measurements

    return () => clearTimeout(timeoutId)
  }, [isMounted, centerBucketId])

  return (
    <div className="overflow-x-auto flex space-x-2 py-4 px-2" ref={scrollerRef}>
      {children}
    </div>
  )
}

