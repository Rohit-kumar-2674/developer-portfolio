# Verification record

This file records actual checks, not guaranteed future performance.

## Automated

- Strict TypeScript compilation.
- ESLint including React hook rules.
- 12 unit tests for private-repository exclusion, ownership and pagination, optional fields, watcher semantics, API rate limits, 404/offline failures, transient retries, technology evidence, public event boundaries, safe links, redaction, and archived repositories.
- Vite production build and static pre-rendering for all routes.
- Base-path build and generated HTML inspection.

## Browser review

- Desktop homepage, portrait, project explorer, search and compact list.
- Project detail with real README and documentation links.
- Global project search and command dialog.
- Responsive iframe checks at 360, 390, 430, 768, and 1024 pixels: no document-width overflow; mobile menu and project search work.
- GitHub Pages subdirectory build: generated home, project index, and representative detail pages contain the correct base path and metadata.

## Limits

The source repositories' own application functionality is outside this portfolio's verification scope. Their README content is attributed rather than independently certified. No Lighthouse score is asserted without a measured report. GitHub live calls can be rate-limited; the static snapshot remains available.
