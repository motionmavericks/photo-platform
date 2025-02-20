"use client"

import { useEffect, useState } from "react"
import { ErrorModal } from "@/components/error-modal"

export default function NotFound() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(true)
  }, [])

  return (
    <ErrorModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      message="We couldn't find the page you're looking for."
    />
  )
}

