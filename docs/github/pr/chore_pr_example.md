# Example: Chore Pull Request

This document provides an example of how to fill out the `chore.md` Pull Request template.

---

**Scenario:** Update all `pnpm` dependencies to their latest compatible versions across the monorepo.

---

## Example PR Content

**Title:** `chore: Update pnpm dependencies across monorepo`

```markdown
---
name: Chore
about: Maintenance tasks, dependency updates, build process changes, etc.
title: "[Chore]: Update pnpm dependencies across monorepo"
labels: ["chore"]
assignees: '@your-github-username' # Assign yourself or relevant team member
---

**App Name:** `monorepo-root`, `web`, `backend`, `shared-types`, `ui`

**Description**
This PR updates all `pnpm` dependencies to their latest compatible versions as suggested by `pnpm outdated`.
This includes minor and patch updates for various packages in `apps/web`, `apps/backend`, `packages/shared-types`, and `packages/ui`.

**Specific Chore Details:**
- [ ] Fix typo (code, comments, docs)
- [ ] Remove unused code/files
- [ ] Remove comments
- [ ] Refactor (no behavior change)
- [x] Dependency update
- [ ] Build/CI configuration change
- [ ] Other (please specify)

**Related Issue (if applicable)**
Closes #101 (assuming issue #101 is "Keep dependencies up-to-date")

**Checklist:**
- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [x] My changes generate no new warnings
- [x] Any dependent changes have been merged and published in downstream modules
```