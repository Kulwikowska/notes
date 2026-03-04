import { useMemo, useRef } from 'react'
import './NotesBoard.css'
import { NoteResizeHandle } from './components/NoteResizeHandle'
import { NoteTextarea } from './components/NoteTextarea'
import { TrashZone } from './components/TrashZone'
import { Toolbar } from './components/Toolbar'
import { useDragNote, useNotesState, usePersistNotes, useResizeNote } from './hooks'

type NotesBoardProps = Record<string, never>

export function NotesBoard(_: NotesBoardProps) {
  const boardRef = useRef<HTMLElement | null>(null)
  const trashRef = useRef<HTMLDivElement>(null)

  const {
    state,
    dispatch,
    handleCreateCenteredNote,
    handleBoardDoubleClick,
    handleNoteContentChange,
  } = useNotesState({ boardRef })

  usePersistNotes({ state, dispatch })

  const { dragState, isTrashActive, handleNoteHeaderMouseDown } = useDragNote({
    boardRef,
    trashRef,
    state,
    dispatch,
  })

  const { handleResizeHandleMouseDown } = useResizeNote({
    boardRef,
    state,
    dispatch,
  })

  const hasNotes = state.notes.length > 0

  const sortedNotes = useMemo(
    () => [...state.notes].sort((a, b) => a.zIndex - b.zIndex),
    [state.notes],
  )

  return (
    <>
      <Toolbar onCreateNote={handleCreateCenteredNote} />
      <section
        ref={boardRef}
        className="board"
        aria-label="Notes board"
        onDoubleClick={handleBoardDoubleClick}
      >
        {!hasNotes && (
          <p className="board-empty-hint">
            Click &quot;New note&quot; or double-click anywhere on the board to start.
          </p>
        )}

        {sortedNotes.map((note) => {
          const isDragging = dragState?.noteId === note.id

          return (
            <article
              key={note.id}
              className={`note${isDragging ? ' note--dragging' : ''}`}
              onDoubleClick={(event) => {
                event.stopPropagation()
              }}
              style={{
                left: `${note.x / 16}rem`,
                top: `${note.y / 16}rem`,
                width: `${note.width / 16}rem`,
                height: `${note.height / 16}rem`,
                backgroundColor: note.color,
                zIndex: note.zIndex,
              }}
            >
              <header
                className="note-header"
                onMouseDown={(event) => handleNoteHeaderMouseDown(event, note.id)}
              />
              <div className="note-body">
                <NoteTextarea
                  value={note.content}
                  onChange={(content) => handleNoteContentChange(note.id, content)}
                />
              </div>
              <NoteResizeHandle
                onMouseDown={(event) => handleResizeHandleMouseDown(event, note.id)}
              />
            </article>
          )
        })}
        <TrashZone isActive={isTrashActive} trashRef={trashRef as React.RefObject<HTMLDivElement>} />
      </section>
    </>
  )
}
