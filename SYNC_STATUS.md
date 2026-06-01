# Sync Status

This file is a lightweight project handoff log for Codex sessions on multiple computers.

## 2026-06-01

### Update: Project Name Exports And Static Config Embedding

- Replaced the visible configuration selector with an editable project-name field backed by a datalist of built-in/imported configuration names.
- Export JSON/SVG now asks for a project name when the current name has not been edited yet, then uses `Mutex_BellowGenV2_{ProjectName}_{date&time}.{fileFormat}`.
- PDF export still uses the browser print flow; the print window title is set to the same filename pattern for the browser's save dialog.
- Added `add_config_to_static_page.py` to embed exported JSON configs into `app.js` before publishing the static site.
- Verified with `node --check app.js` and `python -m py_compile add_config_to_static_page.py`.
- Browser-plugin validation was attempted, but the in-app browser runtime failed to start in this environment with a sandbox startup error.

### Update: Minimum Bounding Rectangle

- Added toolbar options `showBoundingBox` and `rotateToBoundingBox`.
- When enabled, the app calculates the minimum bounding rectangle from exportable pattern geometry, draws it, and labels width/height.
- `rotateToBoundingBox` is disabled unless `showBoundingBox` is enabled; when active, it rotates the pattern so the rectangle long side is vertical and short side is horizontal.
- SVG/PDF export include the rectangle and its dimension labels.
- Updated `add_config_to_static_page.py` so embedded JSON configs preserve the two new options.
- Verified with `node --check app.js` and `python -m py_compile add_config_to_static_page.py`.

### Current State

- Repo is on `main` tracking `origin/main`.
- Working tree was clean before adding these sync files.
- Project is a dependency-free static app: open `index.html` directly.
- Core implementation is in `app.js`; UI structure is in `index.html`; styling is in `styles.css`.

### Notes For Next Session

- Chinese text in `README.MD`, `bellowGenRule.md`, `index.html`, and parts of `app.js` currently displays as mojibake in this environment. Do not casually rewrite it while making unrelated changes.
- If the next task is copy cleanup, first recover/confirm the intended Simplified Chinese text, then patch the affected files in one focused pass.
- If the next task is geometry behavior, start from `app.js` and compare against `bellowGenRule.md`.

### Verification

- File structure reviewed.
- Git status checked.
- No runtime/browser test was run in this handoff-only pass.

### Next Recommended Step

- Commit and push these sync files so the other computer can pull the same collaboration context.
