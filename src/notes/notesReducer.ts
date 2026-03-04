import {
  minNoteHeight,
  minNoteWidth,
  noteBackgroundPalette,
} from './constants'
import type { Note, NotesAction, NotesState } from './types'

export function createInitialState(): NotesState {
  return {
    notes: [],
    nextZIndex: 1,
  }
}

export function notesReducer(state: NotesState, action: NotesAction): NotesState {
  if (action.type === 'CREATE_NOTE') {
    const colorIndex = state.notes.length % noteBackgroundPalette.length
    const color = noteBackgroundPalette[colorIndex]

    const baseWidth = Math.max(action.payload.width, minNoteWidth)
    const baseHeight = Math.max(action.payload.height, minNoteHeight)

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const createdAt = Date.now()

    const nextNote: Note = {
      id,
      x: action.payload.x,
      y: action.payload.y,
      width: baseWidth,
      height: baseHeight,
      content: '',
      color,
      zIndex: state.nextZIndex,
      createdAt,
    }

    return {
      notes: [...state.notes, nextNote],
      nextZIndex: state.nextZIndex + 1,
    }
  }

  if (action.type === 'MOVE_NOTE') {
    const nextNotes = state.notes.map((note) =>
      note.id === action.payload.id
        ? {
            ...note,
            x: action.payload.x,
            y: action.payload.y,
          }
        : note,
    )

    return {
      ...state,
      notes: nextNotes,
    }
  }

  if (action.type === 'FOCUS_NOTE') {
    const target = state.notes.find((note) => note.id === action.payload.id)

    if (!target) {
      return state
    }

    const nextNotes = state.notes.map((note) =>
      note.id === target.id
        ? {
            ...note,
            zIndex: state.nextZIndex,
          }
        : note,
    )

    return {
      notes: nextNotes,
      nextZIndex: state.nextZIndex + 1,
    }
  }

  if (action.type === 'UPDATE_CONTENT') {
    const nextNotes = state.notes.map((note) =>
      note.id === action.payload.id
        ? {
            ...note,
            content: action.payload.content,
          }
        : note,
    )

    return {
      ...state,
      notes: nextNotes,
    }
  }

  if (action.type === 'RESIZE_NOTE') {
    const nextNotes = state.notes.map((note) =>
      note.id === action.payload.id
        ? {
            ...note,
            width: action.payload.width,
            height: action.payload.height,
          }
        : note,
    )

    return {
      ...state,
      notes: nextNotes,
    }
  }

  if (action.type === 'DELETE_NOTE') {
    const nextNotes = state.notes.filter((note) => note.id !== action.payload.id)

    return {
      ...state,
      notes: nextNotes,
    }
  }

  if (action.type === 'HYDRATE_STATE') {
    return action.payload
  }

  return state
}
