# MUTEX TECH Bellow Generator V2 - Codex Collaboration Notes

This file is the shared handoff point for Codex sessions working on this repo from different computers. Read it before editing.

## Project Snapshot

- Static single-page app. Open `index.html` directly in a browser; no build step, package manager, backend, or dependency install is required.
- Main files:
  - `index.html`: page structure and UI controls.
  - `styles.css`: dark blue technical UI styling and responsive layout.
  - `app.js`: configuration state, geometry generation, SVG preview, hints, language toggle, JSON import/export, SVG/PDF export.
  - `bellowGenRule.md`: original bellows drawing rules.
  - `README.MD`: project overview and user-facing notes.
- Default built-in configuration is `Linhof master technika`.
- Units are millimeters.

## Current Behavior

- The left panel edits front/rear frame dimensions, section groups, overlap strip settings, support rib settings, and front/rear height difference.
- The right panel renders an SVG preview with pan/zoom and fit-to-view.
- Exports:
  - SVG export removes preview-only text/reference helpers and keeps support ribs in `<g id="support-ribs">`.
  - PDF export opens a print window from the serialized SVG.
- Config JSON can be imported/exported and user configs are stored in browser `localStorage` under `mutex-tech-bellow-configs-v2`.

## Collaboration Rules

- Keep the app dependency-free unless there is a clear reason to add tooling.
- Prefer small, testable changes in the existing vanilla HTML/CSS/JS style.
- Before changing geometry, read `bellowGenRule.md` and the relevant functions in `app.js`.
- After editing UI or geometry, verify by opening `index.html` in a browser and checking:
  - initial render is nonblank,
  - section add/remove works,
  - language toggle works,
  - SVG export still contains `bellow-pattern` and `support-ribs`,
  - console has no obvious runtime errors.
- Do not commit generated exported SVG/PDF files unless the user explicitly asks.
- Avoid broad formatting-only rewrites, because `app.js` is large and handoff diffs should stay easy to review.

## Known Issue To Handle Carefully

Some Chinese text in the current tracked files appears mojibake in this environment. Treat this as a project issue, not as intentional copy. Avoid editing Chinese copy opportunistically until you can confirm the intended text from a clean source or from the user. If you fix encoding/copy, do it as a focused change and mention it in `SYNC_STATUS.md`.

## Handoff Workflow

1. Run `git status --short --branch`.
2. Read `SYNC_STATUS.md`.
3. If you make a meaningful change, update `SYNC_STATUS.md` in the same commit or handoff.
4. Leave a short note with date, machine/session context if useful, files touched, verification run, and next recommended step.
