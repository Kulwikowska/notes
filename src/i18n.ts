type SupportedLocale = 'en'

type TranslationKey =
  | 'app.title'
  | 'app.subtitle'
  | 'trashZone.label'
  | 'note.placeholder'
  | 'toolbar.newNote'
  | 'toolbar.hint'

type TranslationTable = Record<SupportedLocale, Record<TranslationKey, string>>

const translations: TranslationTable = {
  en: {
    'app.title': 'Sticky Notes',
    'app.subtitle': 'Create, move, and resize colorful notes on your desktop board.',
    'trashZone.label': 'Drop here to delete',
    'note.placeholder': 'Write something…',
    'toolbar.newNote': 'New note',
    'toolbar.hint': 'Double-click anywhere on the board to create a new note at that position.',
  },
}

export function translate(key: TranslationKey, locale: SupportedLocale = 'en'): string {
  return translations[locale][key]
}

