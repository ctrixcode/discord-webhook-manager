# Example: Chore / Maintenance Issue

This document provides an example of how to fill out the `chore.md` Issue template.

---

**Scenario:** The project has several unused utility functions in the backend that should be removed.

---

## Example Issue Content

**Title:** `[Chore]: Remove unused backend utility functions`

```markdown
---
name: Chore / Maintenance
about: Tasks for project health, refactoring, dependency updates, etc.
title: "[Chore]: Remove unused backend utility functions"
labels: ["chore"]
assignees: ''
---

**App Name:** `backend`

**Description of Chore**
Identify and remove several utility functions in `apps/backend/src/utils/` that are no longer being called anywhere in the codebase. This will help reduce bundle size and improve code clarity.

**Justification / Motivation**
These functions were likely part of older features or experiments and are now dead code. Removing them improves maintainability, reduces potential confusion for new developers, and slightly reduces the overall codebase size.
```