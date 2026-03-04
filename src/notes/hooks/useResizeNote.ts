import { useCallback, useEffect, useState } from 'react'
import { computeClampedDimensions, type ResizeSession } from '../helpers'
import type { NotesAction, NotesState } from '../types'

type UseResizeNoteArgs = {
  boardRef: React.RefObject<HTMLElement | null>
  state: NotesState
  dispatch: React.Dispatch<NotesAction>
}

type UseResizeNoteResult = {
  handleResizeHandleMouseDown: (
    event: React.MouseEvent<HTMLButtonElement>,
    noteId: string,
  ) => void
}

export function useResizeNote({
  boardRef,
  state,
  dispatch,
}: UseResizeNoteArgs): UseResizeNoteResult {
  const [resizeState, setResizeState] = useState<ResizeSession | null>(null)

  const handleResizeHandleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, noteId: string) => {
      if (!boardRef.current) {
        return
      }

      const note = state.notes.find((item) => item.id === noteId)

      if (!note) {
        return
      }

      dispatch({
        type: 'FOCUS_NOTE',
        payload: {
          id: noteId,
        },
      })

      setResizeState({
        noteId,
        startWidth: note.width,
        startHeight: note.height,
        originClientX: event.clientX,
        originClientY: event.clientY,
      })

      event.preventDefault()
      event.stopPropagation()
    },
    [state.notes, boardRef, dispatch],
  )

  useEffect(() => {
    if (!resizeState) {
      return
    }

    const activeResizeState = resizeState

    function handleWindowMouseMove(event: MouseEvent) {
      if (!boardRef.current) return

      const note = state.notes.find((n) => n.id === activeResizeState.noteId)
      if (!note) return

      const rect = boardRef.current.getBoundingClientRect()
      const { width, height } = computeClampedDimensions(
        event,
        activeResizeState,
        note,
        rect,
      )

      dispatch({
        type: 'RESIZE_NOTE',
        payload: { id: note.id, width, height },
      })
    }

    function handleWindowMouseUp() {
      setResizeState(null)
    }

    window.addEventListener('mousemove', handleWindowMouseMove)
    window.addEventListener('mouseup', handleWindowMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove)
      window.removeEventListener('mouseup', handleWindowMouseUp)
    }
  }, [resizeState, state.notes, boardRef, dispatch])

  return { handleResizeHandleMouseDown }
}
