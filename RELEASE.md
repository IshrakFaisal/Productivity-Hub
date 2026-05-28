# Productivity Hub Release Guide

Productivity Hub ships as a Windows desktop app through GitHub Releases.

## Create a Release

1. Update `version` in `package.json`.
2. Commit the change and merge it to the default branch.
3. Create and push a matching tag:

```powershell
git tag v0.2.0
git push origin v0.2.0
```

4. GitHub Actions runs `Release Windows Desktop App`.
5. The workflow publishes the Windows installer, blockmap, and `latest.yml` to GitHub Releases.

## Auto Updates

Installed builds check:

```text
https://github.com/IshrakFaisal/Productivity-Hub/releases/latest
```

The Settings page exposes update checking, downloading, and restart-to-install controls. Development builds show a local notice because Electron updates only run from packaged apps.

## Notes

- The current installer is unsigned, so Windows SmartScreen may warn users.
- For public distribution, add a Windows code-signing certificate before promoting the app broadly.
- Keep release assets out of git; the `/release-build` folder is generated locally and published by GitHub Actions.
