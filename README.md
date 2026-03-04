## Notes – React Single Page App

This is a **single page React application** bootstrapped with **Vite + TypeScript**. It implements a sticky-notes board with drag, resize, and local persistence.

### How to start

1. **Install dependencies**
   - `npm install`

2. **Run the app in development**
   - `npm run dev`
   - Open the printed URL (usually `http://localhost:5173`)

3. **Run tests**
   - `npm run test` – watch mode
   - `npm run test:run` – single CI-style run with coverage enabled

4. **Lint and build**
   - `npm run lint` – run ESLint
   - `npm run build` – type-check and build for production
   - `npm run preview` – preview the production build locally

### Architecture overview

- **Entry and shell**
  - `src/main.tsx` – mounts the React app into the DOM.
  - `src/App.tsx` – top-level layout (page header and main content).

- **Notes domain**
  - `src/notes/NotesBoard.tsx` – main board UI: renders notes, toolbar, and trash zone; wires up all notes-related hooks.
  - `src/notes/notesReducer.ts` – pure reducer and `createInitialState` for all note actions (`CREATE_NOTE`, `MOVE_NOTE`, `FOCUS_NOTE`, `UPDATE_CONTENT`, `RESIZE_NOTE`, `DELETE_NOTE`, `HYDRATE_STATE`).
  - `src/notes/types.ts` – shared domain types (`Note`, `NotesState`, `NotesAction`).
  - `src/notes/constants.ts` – default and minimum note dimensions and the storage key.

- **Hooks**
  - `src/notes/hooks/useNotesState.ts` – owns `NotesState` via `useReducer`, creates centered notes, handles board double-click creation, and exposes content/focus helpers.
  - `src/notes/hooks/useDragNote.ts` – handles dragging notes within the board, including trash-zone detection and `MOVE_NOTE` / `DELETE_NOTE` dispatch.
  - `src/notes/hooks/useResizeNote.ts` – handles resizing notes from the resize handle and dispatches `RESIZE_NOTE` using computed dimensions.
  - `src/notes/hooks/usePersistNotes.ts` – loads initial state from storage (`HYDRATE_STATE`) and saves changes back to `localStorage`.

- **Utilities and helpers**
  - `src/notes/utils/notesStorage.ts` – `loadNotesState` / `saveNotesState` with runtime validation of stored data.
  - `src/notes/helpers/resizeHelpers.ts` – `computeClampedDimensions`, which calculates note width/height during resize and clamps them to board bounds and minimum sizes.
  - `src/notes/utils/index.ts` and `src/notes/helpers/index.ts` – small re-export barrels.

- **UI components**
  - `src/notes/components/Toolbar/Toolbar.tsx` – “New note” toolbar and hint text.
  - `src/notes/components/TrashZone/TrashZone.tsx` – trash drop target that highlights when a dragged note intersects it.
  - `src/notes/components/NoteTextarea/NoteTextarea.tsx` – controlled textarea for note content.
  - `src/notes/components/NoteResizeHandle/NoteResizeHandle.tsx` – bottom-right resize handle button used by `useResizeNote`.

- **Styling and theming**
  - `src/App.css` – main layout and app-level styling.
  - `src/notes/NotesBoard.css` and component-specific `.css` files – board and note visuals, including drag/resize affordances.
  - `src/theme.ts` – palette of sticky-note colors.

- **Internationalization**
  - `src/i18n.ts` – minimal translation helper (`translate`) used for toolbar labels and text.

- **Testing**
  - `src/setupTests.ts` – Vitest + Testing Library setup (jest-dom matchers, cleanup).
  - `vite.config.ts` – Vitest configuration with jsdom environment, test include pattern (`src/**/*.test.{ts,tsx}`), and coverage settings.
  - `src/notes/components/NoteResizeHandle/NoteResizeHandle.test.tsx` – example component test file using Vitest, React Testing Library, and `userEvent`.

This structure keeps domain logic (reducers, hooks, storage, helpers) decoupled from presentational components, so behavior can be tested in isolation and UI can evolve without changing the core note model.
