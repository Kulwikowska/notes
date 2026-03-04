import './App.css'
import { translate } from './i18n'
import { NotesBoard } from './notes/NotesBoard'

export function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">{translate('app.title')}</h1>
        <p className="app-subtitle">{translate('app.subtitle')}</p>
      </header>
      <main className="app-main">
        <NotesBoard />
      </main>
    </div>
  )
}
