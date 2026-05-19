# R0uty's Cyber Lab

R0uty's Cyber Lab is a browser-based toolkit for developers, security practitioners, and students.

## What this is

This project is a single web app that brings many small security and utility tools into one place.

## What it is trying to do

- Provide fast, practical tools that run directly in the browser
- Keep sensitive input local so users can test and inspect data privately
- Help users move through common security and debugging workflows without switching between many websites

## Privacy model

All processing happens in the browser. Input data is not sent to a backend service.

- Active Flow Map progress is stored in browser session storage so a workflow can resume after navigation or refresh.
- Saved Lab Notes case files are stored in browser local storage on the current device until they are exported or cleared.

## Who it is for

- Developers who need quick format, parse, and conversion tools
- Security learners and professionals doing authorized testing and analysis
- Students learning security concepts and data handling workflows

## Run locally

Requirements:
- Node.js 16+
- npm

Install and start:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev` - start local development server
- `npm run build` - build production bundle
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint
- `npm run test` - run tests
- `npm run test:watch` - run tests in watch mode
- `npm run test:coverage` - run tests with coverage

## Tech stack

- React
- Vite
- ESLint
- Vitest

## Contributor notes: add a new tool

1. Create the tool component in `src/tools` using a default export. Example: `src/tools/MyNewTool.jsx`.
2. Add the catalog entry and user-facing metadata in `src/data/toolRegistry.js`.
3. Add the title-to-component mapping in `TOOL_COMPONENT_KEYS` in `src/data/toolRegistry.js`.
4. If needed, add page styles under `src/styles/pages` and wire `useSEO()` in the tool component.
5. Add or update tests (smoke test and any utility tests), then run `npm run test` and `npm run lint`.
