import { useCallback, useReducer } from 'react'
import { defaultNoteHeight, defaultNoteWidth } from '../constants'
import { createInitialState, notesReducer } from '../notesReducer'
import type { NotesAction, NotesState } from '../types'

type UseNotesStateArgs = {
  boardRef: React.RefObject<HTMLElement | null>
}

type UseNotesStateResult = {
  state: NotesState
  dispatch: React.Dispatch<NotesAction>
  handleCreateCenteredNote: () => void
  handleBoardDoubleClick: React.MouseEventHandler<HTMLElement>
  handleNoteContentChange: (id: string, content: string) => void
  focusNote: (id: string) => void
}

function clampNotePosition(
  rawX: number,
  rawY: number,
  rect: DOMRect,
): { x: number; y: number } {
  const maxX = Math.max(rect.width - defaultNoteWidth, 0)
  const maxY = Math.max(rect.height - defaultNoteHeight, 0)

  const x = Math.min(Math.max(Math.round(rawX), 0), Math.round(maxX))
  const y = Math.min(Math.max(Math.round(rawY), 0), Math.round(maxY))

  return { x, y }
}

export function useNotesState({ boardRef }: UseNotesStateArgs): UseNotesStateResult {
  const [state, dispatch] = useReducer(notesReducer, undefined, createInitialState)

  const handleCreateCenteredNote = useCallback(() => {
    if (!boardRef.current) {
      return
    }

    const rect = boardRef.current.getBoundingClientRect()
    const rawX = rect.width / 2 - defaultNoteWidth / 2
    const rawY = rect.height / 2 - defaultNoteHeight / 2
    const { x, y } = clampNotePosition(rawX, rawY, rect)

    dispatch({
      type: 'CREATE_NOTE',
      payload: {
        x,
        y,
        width: defaultNoteWidth,
        height: defaultNoteHeight,
      },
    })
  }, [boardRef])

  const handleBoardDoubleClick = useCallback<React.MouseEventHandler<HTMLElement>>((event) => {
    if (!boardRef.current) {
      return
    }

    const rect = boardRef.current.getBoundingClientRect()
    const localX = event.clientX - rect.left
    const localY = event.clientY - rect.top
    const rawX = localX - defaultNoteWidth / 2
    const rawY = localY - defaultNoteHeight / 2
    const { x, y } = clampNotePosition(rawX, rawY, rect)

    dispatch({
      type: 'CREATE_NOTE',
      payload: {
        x,
        y,
        width: defaultNoteWidth,
        height: defaultNoteHeight,
      },
    })
  }, [boardRef])

  const handleNoteContentChange = useCallback((id: string, content: string) => {
    dispatch({
      type: 'UPDATE_CONTENT',
      payload: {
        id,
        content,
      },
    })
  }, [])

  const focusNote = useCallback((id: string) => {
    dispatch({
      type: 'FOCUS_NOTE',
      payload: { id },
    })
  }, [])

  return {
    state,
    dispatch,
    handleCreateCenteredNote,
    handleBoardDoubleClick,
    handleNoteContentChange,
    focusNote,
  }
}
