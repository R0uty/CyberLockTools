# Copilot instructions for CyberLockTools

## Build, test, and lint

- Install dependencies: `npm install`
- Start the dev server: `npm run dev`
- Run the full test suite: `npm run test`
- Run a single test file: `npm run test -- src/pages/FlowMap.test.jsx`
- Run tests in watch mode: `npm run test:watch`
- Run ESLint: `npm run lint`
- Build the production bundle: `npm run build`
- Preview the production build: `npm run preview`

CI runs `npm run test`, then `npm run lint`, then `npm run build`.

## High-level architecture

- This is a single Vite + React browser app with no router. `src/App.jsx` owns page/tool navigation by writing `{ page, tool, category }` into `window.history.state`, then conditionally renders the active page or tool.
- Pages and tools are lazy-loaded in `src/App.jsx`. If a tool title is selected, App resolves it through `buildToolComponents()` from `src/data/toolRegistry.js`.
- `src/data/toolRegistry.js` is the source of truth for the general tool catalog: category, title, icon name, and title-to-component mapping. Tool titles are also used as navigation identifiers, so renames ripple into App navigation and cross-links.
- Most browser tools follow a split structure: UI in `src/tools/*.jsx`, logic in `src/utils/*.js`, and page-specific styling in `src/styles/pages/*.css`. Tests are colocated next to the related page or utility (`*.test.jsx`, `*.test.js`).
- The Flow Map is its own subsystem:
  - `src/data/flowMapConfig.js` defines flows, stages, nodes, tool references, storage keys, and active flow groups.
  - `src/pages/flowMapMachine.js` contains the reducer, event transition rules, and config consistency validation.
  - `src/pages/FlowMap.jsx` wires config + reducer + session persistence + rendering.
  - `src/components/flow-map/*` holds the canvas/progress UI pieces.
- Tool Guides are data-driven but keep their dataset inline in `src/pages/ToolGuides.jsx`; the page can highlight a guide based on a slugified tool name passed from App navigation.

## Key conventions

- Preserve the privacy-first product language from the README and UI: this app is browser-only, with no backend processing. Many pages render the same privacy badge and copy; new tools/pages should fit that model.
- Keep `useSEO()` calls on pages and tools. The repo updates title/description/keywords per screen rather than relying on a single static document title.
- Reuse the shared feedback pattern for copy actions: `showFeedback()` in `src/utils/feedback.js` feeds the global `FeedbackToast` mounted in `App.jsx`.
- For Flow Map changes, update config, machine logic, and tests together. Active flows depend on matching stage IDs, node IDs, `FLOW_START_STAGE_BY_KEY`, and the interaction coverage in `src/pages/FlowMap.test.jsx`.
- Flow Map persistence goes through `readSessionValue()` / `writeSessionValue()` in `src/utils/sessionStorage.js`; keep using those helpers instead of accessing `window.sessionStorage` directly.
- When adding a new general tool, wire all of these surfaces together: lazy import in `App.jsx`, catalog entry and component key in `src/data/toolRegistry.js`, component in `src/tools/`, and matching page CSS in `src/styles/pages/` if needed.
