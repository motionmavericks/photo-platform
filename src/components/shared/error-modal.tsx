"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
  title?: string
}

export function ErrorModal({ isOpen, onClose, message, title = "Error" }: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-zinc-500">{message}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
