import { minNoteHeight, minNoteWidth } from '../constants'
import type { Note } from '../types'

export type ResizeSession = {
  noteId: string
  startWidth: number
  startHeight: number
  originClientX: number
  originClientY: number
}

export function computeClampedDimensions(
  event: MouseEvent,
  resize: ResizeSession,
  note: Note,
  boardRect: DOMRect,
): { width: number; height: number } {
  const dx = event.clientX - resize.originClientX
  const dy = event.clientY - resize.originClientY
  const rawWidth = resize.startWidth + dx
  const rawHeight = resize.startHeight + dy

  const maxWidth = Math.max(boardRect.width - note.x, minNoteWidth)
  const maxHeight = Math.max(boardRect.height - note.y, minNoteHeight)

  const width = Math.min(
    Math.max(Math.round(rawWidth), minNoteWidth),
    Math.round(maxWidth),
  )
  const height = Math.min(
    Math.max(Math.round(rawHeight), minNoteHeight),
    Math.round(maxHeight),
  )

  return { width, height }
}
