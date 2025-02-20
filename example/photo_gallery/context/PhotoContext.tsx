"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Photo } from "../types"

interface State {
  photos: Photo[]
}

type Action =
  | { type: "SET_PHOTOS"; payload: Photo[] }
  | { type: "ADD_PHOTO"; payload: Photo }
  | { type: "UPDATE_PHOTO"; payload: Photo }
  | { type: "DELETE_PHOTO"; payload: string }

const initialState: State = {
  photos: [],
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PHOTOS":
      return { ...state, photos: action.payload }
    case "ADD_PHOTO":
      return { ...state, photos: [...state.photos, action.payload] }
    case "UPDATE_PHOTO":
      return {
        ...state,
        photos: state.photos.map((photo) => (photo.id === action.payload.id ? action.payload : photo)),
      }
    case "DELETE_PHOTO":
      return {
        ...state,
        photos: state.photos.filter((photo) => photo.id !== action.payload),
      }
    default:
      return state
  }
}

const PhotoContext = createContext<
  | {
      state: State
      dispatch: React.Dispatch<Action>
    }
  | undefined
>(undefined)

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return <PhotoContext.Provider value={{ state, dispatch }}>{children}</PhotoContext.Provider>
}

export function usePhoto() {
  const context = useContext(PhotoContext)
  if (context === undefined) {
    throw new Error("usePhoto must be used within a PhotoProvider")
  }
  return context
}

