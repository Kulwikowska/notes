import { useEffect } from 'react'
import { loadNotesState, saveNotesState } from '../utils'
import type { NotesAction, NotesState } from '../types'

type UsePersistNotesArgs = {
  state: NotesState
  dispatch: React.Dispatch<NotesAction>
}

export function usePersistNotes({ state, dispatch }: UsePersistNotesArgs) {
  useEffect(() => {
    const loaded = loadNotesState()

    if (loaded === null) {
      return
    }

    dispatch({
      type: 'HYDRATE_STATE',
      payload: loaded,
    })
  }, [dispatch])

  useEffect(() => {
    saveNotesState(state)
  }, [state.notes, state.nextZIndex])
}
