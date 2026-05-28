# Productivity Hub

Productivity Hub is a desktop discovery and comparison app for choosing the productivity software people should actually live in. It combines a curated tool directory, comparisons, a recommendation quiz, stack builder analysis, local workspace state, and Windows desktop packaging.

## Development

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:3000` for the web shell, or run the desktop shell:

```powershell
npm run desktop
```

## Quality Checks

```powershell
npm run lint
npx tsc --noEmit
npm test
npm run build
```

## Desktop Installer

Build a local Windows installer:

```powershell
npm run package:win
```

The installer and updater metadata are generated in `release-build/`. Release assets are ignored by git because GitHub Actions publishes them to GitHub Releases.

## Releases and Updates

Create a tag like `v0.2.0` to trigger `.github/workflows/release-windows.yml`. The workflow lints, tests, builds, packages the Windows installer, and publishes release assets.

Installed desktop builds use GitHub Releases for update checks. See `RELEASE.md` for the release checklist and code-signing notes.
