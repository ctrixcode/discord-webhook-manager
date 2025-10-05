# How to Handle CHANGELOG.md

This document provides guidelines on how to update the `CHANGELOG.md` file for this project. We follow the principles of [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Purpose of the Changelog

The `CHANGELOG.md` is a human-readable history of all notable changes to the project. It helps users and contributors quickly understand what has changed between versions.

## Structure

The changelog is organized by version, with the most recent version at the top. Each version entry includes:

*   **Version Number:** Follows Semantic Versioning (e.g., `## [1.0.0] - YYYY-MM-DD`).
*   **Date:** The date of the release.
*   **Change Types:** Categorized under specific headings:
    *   `### Added`: For new features.
    *   `### Changed`: For changes in existing functionality.
    *   `### Deprecated`: For features that will soon be removed.
    *   `### Removed`: For features that have been removed.
    *   `### Fixed`: For any bug fixes.
    *   `### Security`: For vulnerabilities or security-related changes.

## Updating the Changelog

### 1. The "Unreleased" Section

All new changes should first be added under the `## [Unreleased]` section at the top of the `CHANGELOG.md`. This section acts as a staging area for changes that will be part of the next release.

When you submit a Pull Request, you should add an entry (or entries) under the appropriate change type heading within the `## [Unreleased]` section.

**Example for a new feature:**

```markdown
## [Unreleased]

### Added
- Implemented scheduled message sending functionality.
```

**Example for a bug fix:**

```markdown
## [Unreleased]

### Fixed
- Corrected an issue where webhook deletion failed with a 500 error.
```

### 2. Releasing a New Version

When a new version of the project is released:

1.  **Create a new version heading:** Copy the contents of `## [Unreleased]` to a new section below it, titled with the new version number and release date.
    *   Example: `## [1.0.0] - 2025-10-05`
2.  **Update the "Unreleased" link:** Update the `[Unreleased]` link at the bottom of the file to point to the new version's tag.
3.  **Create a new "Unreleased" section:** Add a fresh `## [Unreleased]` section at the very top, ready for future changes.
4.  **Update version links:** Ensure the links at the bottom of the file (`[Unreleased]`, `[1.0.0]`, etc.) correctly point to their respective GitHub tags or commits.

### Example of a Release Update

Let's say `CHANGELOG.md` currently looks like this (before the 1.0.0 release):

```markdown
# Changelog

## [Unreleased]

### Added
- Initial setup for monorepo structure.
- Frontend (Next.js) and Backend (Fastify) applications.
- Shared types and UI packages.
- Basic README files for root, web, and backend.
- `.env.example` for web and backend.
- Vercel deployment configuration for backend.
- Issue templates (Bug Report, Feature Request, Documentation, Chore, Question).
- Pull Request templates (Bug Fix, Feature, Chore).
- `CONTRIBUTING.md` guidelines.
- `CODE_OF_CONDUCT.md`.

### Changed
- Updated root `README.md` to combine information from web and backend.
- Updated `apps/web/README.md` to include `.env.example` setup.
- Refined PR templates:
    - `chore.md`: Removed irrelevant "Type of change" options and "How Has This Been Tested?" section, streamlined checklist.
    - `feature.md`: Removed irrelevant "Type of change" options.
    - `bug_fix.md`: Removed irrelevant "Type of change" options.
- Removed browser version from all issue/PR templates.

### Deprecated

### Removed

### Fixed

### Security
```

And you are releasing version `1.0.0` on `2025-10-05`. After the release, `CHANGELOG.md` should look like this:

```markdown
# Changelog

## [Unreleased]

## [1.0.0] - 2025-10-05

### Added
- Initial setup for monorepo structure.
- Frontend (Next.js) and Backend (Fastify) applications.
- Shared types and UI packages.
- Basic README files for root, web, and backend.
- `.env.example` for web and backend.
- Vercel deployment configuration for backend.
- Issue templates (Bug Report, Feature Request, Documentation, Chore, Question).
- Pull Request templates (Bug Fix, Feature, Chore).
- `CONTRIBUTING.md` guidelines.
- `CODE_OF_CONDUCT.md`.

### Changed
- Updated root `README.md` to combine information from web and backend.
- Updated `apps/web/README.md` to include `.env.example` setup.
- Refined PR templates:
    - `chore.md`: Removed irrelevant "Type of change" options and "How Has This Been Tested?" section, streamlined checklist.
    - `feature.md`: Removed irrelevant "Type of change" options.
    - `bug_fix.md`: Removed irrelevant "Type of change" options.
- Removed browser version from all issue/PR templates.

### Deprecated

### Removed

### Fixed

### Security
```

Remember to always keep the changelog up-to-date with every significant change.
