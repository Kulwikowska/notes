import './NoteTextarea.css'
import { translate } from '../../../i18n'

type Props = {
  value: string
  onChange: (value: string) => void
}

export function NoteTextarea({ value, onChange }: Props) {
  return (
    <textarea
      className="note-textarea"
      placeholder={translate('note.placeholder')}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

