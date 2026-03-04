import './TrashZone.css'
import { translate } from '../../../i18n'

type Props = {
  isActive: boolean
  trashRef: React.RefObject<HTMLDivElement>
}

export function TrashZone({ isActive, trashRef }: Props) {
  return (
    <div
      ref={trashRef}
      className={`trash-zone${isActive ? ' trash-zone--active' : ''}`}
      aria-label="Trash zone"
    >
      {translate('trashZone.label')}
    </div>
  )
}

