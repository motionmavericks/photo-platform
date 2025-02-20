"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Undo, Redo } from "lucide-react"

interface UndoRedoManagerProps<T> {
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

export function UndoRedoManager<T>({ onUndo, onRedo, canUndo, canRedo }: UndoRedoManagerProps<T>) {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={onUndo} disabled={!canUndo}>
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onRedo} disabled={!canRedo}>
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function useUndoRedoState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState)
  const [history, setHistory] = useState<T[]>([initialState])
  const [historyIndex, setHistoryIndex] = useState(0)

  const updateState = useCallback(
    (newState: T) => {
      setState(newState)
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), newState])
      setHistoryIndex((prev) => prev + 1)
    },
    [historyIndex],
  )

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      setState(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1)
      setState(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  return {
    state,
    updateState,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  }
}

