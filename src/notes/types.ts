export type Note = {
  id: string
  x: number
  y: number
  width: number
  height: number
  content: string
  color: string
  zIndex: number
  createdAt: number
}

export type NotesState = {
  notes: Note[]
  nextZIndex: number
}

export type NotesAction =
  | {
      type: 'CREATE_NOTE'
      payload: {
        x: number
        y: number
        width: number
        height: number
      }
    }
  | {
      type: 'MOVE_NOTE'
      payload: {
        id: string
        x: number
        y: number
      }
    }
  | {
      type: 'FOCUS_NOTE'
      payload: {
        id: string
      }
    }
  | {
      type: 'UPDATE_CONTENT'
      payload: {
        id: string
        content: string
      }
    }
  | {
      type: 'RESIZE_NOTE'
      payload: {
        id: string
        width: number
        height: number
      }
    }
  | {
      type: 'DELETE_NOTE'
      payload: {
        id: string
      }
    }
  | {
      type: 'HYDRATE_STATE'
      payload: NotesState
    }

