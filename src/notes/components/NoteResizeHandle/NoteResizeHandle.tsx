import './NoteResizeHandle.css'

type NoteResizeHandleProps = {
  onMouseDown: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export function NoteResizeHandle({ onMouseDown }: NoteResizeHandleProps) {
  return (
    <button
      type="button"
      className="note-resize-handle"
      aria-label="Resize note"
      onMouseDown={onMouseDown}
    />
  )
}

