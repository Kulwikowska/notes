import { notesStorageKey } from '../constants'
import type { Note, NotesState } from '../types'

function isStoredNote(value: unknown): value is Note {
  if (!value || typeof value !== 'object') {
    return false
  }

  const item = value as {
    id?: unknown
    x?: unknown
    y?: unknown
    width?: unknown
    height?: unknown
    content?: unknown
    color?: unknown
    zIndex?: unknown
    createdAt?: unknown
  }

  return (
    typeof item.id === 'string' &&
    typeof item.x === 'number' &&
    typeof item.y === 'number' &&
    typeof item.width === 'number' &&
    typeof item.height === 'number' &&
    typeof item.content === 'string' &&
    typeof item.color === 'string' &&
    typeof item.zIndex === 'number' &&
    typeof item.createdAt === 'number'
  )
}

export function loadNotesState(): NotesState | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = window.localStorage.getItem(notesStorageKey)

  if (!stored) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(stored)

    if (!parsed || typeof parsed !== 'object') {
      return null
    }

    const candidate = parsed as { notes?: unknown; nextZIndex?: unknown }

    if (!Array.isArray(candidate.notes) || typeof candidate.nextZIndex !== 'number') {
      return null
    }

    const notes = candidate.notes.filter(isStoredNote)

    if (notes.length === 0) {
      return null
    }

    return {
      notes,
      nextZIndex: candidate.nextZIndex,
    }
  } catch {
    return null
  }
}

export function saveNotesState(state: NotesState): void {
  if (typeof window === 'undefined') {
    return
  }

  const serializable: NotesState = {
    notes: state.notes,
    nextZIndex: state.nextZIndex,
  }

  window.localStorage.setItem(notesStorageKey, JSON.stringify(serializable))
}
