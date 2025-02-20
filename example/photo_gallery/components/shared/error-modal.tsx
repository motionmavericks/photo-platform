"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Home, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  message?: string
}

export function ErrorModal({ isOpen, onClose, message = "Oops! Something went wrong" }: ErrorModalProps) {
  const router = useRouter()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-72 h-72 relative mb-6">
            <img
              src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzk1cnFwczBzcTNjeHZlaTN4dmI2NTlrdnpjeTdjcnplMW14ZWd2bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kFkljcDMTpGdIiszOz/giphy.gif"
              alt="Confused puppy getting groomed"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">404: Page Not Found</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">{message}</p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                router.back()
                onClose()
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button
              onClick={() => {
                router.push("/")
                onClose()
              }}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

