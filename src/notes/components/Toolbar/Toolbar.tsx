import './Toolbar.css'
import { translate } from '../../../i18n'

type Props = {
  onCreateNote: () => void
}

export function Toolbar({ onCreateNote }: Props) {
  return (
    <section className="toolbar" aria-label="Notes toolbar">
      <button className="toolbar-button" type="button" onClick={onCreateNote}>
        {translate('toolbar.newNote')}
      </button>
      <p className="toolbar-hint">
        {translate('toolbar.hint')}
      </p>
    </section>
  )
}

