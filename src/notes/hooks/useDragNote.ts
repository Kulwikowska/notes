import { useCallback, useEffect, useRef, useState } from 'react'
import type { NotesAction, NotesState } from '../types'

type DragState = {
  noteId: string
  offsetX: number
  offsetY: number
}

type UseDragNoteArgs = {
  boardRef: React.RefObject<HTMLElement | null>
  trashRef: React.RefObject<HTMLDivElement | null>
  state: NotesState
  dispatch: React.Dispatch<NotesAction>
}

type UseDragNoteResult = {
  dragState: DragState | null
  isTrashActive: boolean
  handleNoteHeaderMouseDown: (event: React.MouseEvent<HTMLElement>, noteId: string) => void
}

export function useDragNote({
  boardRef,
  trashRef,
  state,
  dispatch,
}: UseDragNoteArgs): UseDragNoteResult {
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [isTrashActive, setIsTrashActive] = useState(false)
  const isTrashActiveRef = useRef(false)

  const handleNoteHeaderMouseDown = useCallback(
    (event: React.MouseEvent<HTMLElement>, noteId: string) => {
      if (!boardRef.current) {
        return
      }

      const note = state.notes.find((item) => item.id === noteId)

      if (!note) {
        return
      }

      const rect = boardRef.current.getBoundingClientRect()

      const localX = event.clientX - rect.left
      const localY = event.clientY - rect.top

      const offsetX = localX - note.x
      const offsetY = localY - note.y

      dispatch({
        type: 'FOCUS_NOTE',
        payload: { id: noteId },
      })

      setDragState({
        noteId,
        offsetX,
        offsetY,
      })

      event.preventDefault()
    },
    [state.notes, boardRef, dispatch],
  )

  useEffect(() => {
    if (!dragState) {
      setIsTrashActive(false)
      isTrashActiveRef.current = false
      return
    }

    const activeDragState = dragState

    function handleWindowMouseMove(event: MouseEvent) {
      if (!boardRef.current) {
        return
      }

      const note = state.notes.find((item) => item.id === activeDragState.noteId)

      if (!note) {
        return
      }

      const rect = boardRef.current.getBoundingClientRect()

      const localX = event.clientX - rect.left
      const localY = event.clientY - rect.top

      const rawX = localX - activeDragState.offsetX
      const rawY = localY - activeDragState.offsetY

      const maxX = Math.max(rect.width - note.width, 0)
      const maxY = Math.max(rect.height - note.height, 0)

      const x = Math.min(Math.max(Math.round(rawX), 0), Math.round(maxX))
      const y = Math.min(Math.max(Math.round(rawY), 0), Math.round(maxY))

      let intersects = false

      if (trashRef.current) {
        const trashRect = trashRef.current.getBoundingClientRect()
        const trashLocalLeft = trashRect.left - rect.left
        const trashLocalTop = trashRect.top - rect.top
        const trashLocalRight = trashLocalLeft + trashRect.width
        const trashLocalBottom = trashLocalTop + trashRect.height

        const noteLeft = x
        const noteTop = y
        const noteRight = x + note.width
        const noteBottom = y + note.height

        intersects =
          noteLeft < trashLocalRight &&
          noteRight > trashLocalLeft &&
          noteTop < trashLocalBottom &&
          noteBottom > trashLocalTop
      }

      isTrashActiveRef.current = intersects
      setIsTrashActive(intersects)

      dispatch({
        type: 'MOVE_NOTE',
        payload: {
          id: note.id,
          x,
          y,
        },
      })
    }

    function handleWindowMouseUp() {
      if (isTrashActiveRef.current) {
        dispatch({
          type: 'DELETE_NOTE',
          payload: { id: activeDragState.noteId },
        })
      }

      setIsTrashActive(false)
      isTrashActiveRef.current = false
      setDragState(null)
    }

    window.addEventListener('mousemove', handleWindowMouseMove)
    window.addEventListener('mouseup', handleWindowMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove)
      window.removeEventListener('mouseup', handleWindowMouseUp)
    }
  }, [dragState, state.notes, boardRef, trashRef, dispatch])

  return {
    dragState,
    isTrashActive,
    handleNoteHeaderMouseDown,
  }
}
