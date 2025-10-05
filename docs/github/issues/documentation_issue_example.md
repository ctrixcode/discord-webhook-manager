# Example: Documentation Issue

This document provides an example of how to fill out the `documentation.md` Issue template.

---

**Scenario:** The `CONTRIBUTING.md` file mentions a "Code of Conduct" but doesn't link to it.

---

## Example Issue Content

**Title:** `[Docs]: Link CODE_OF_CONDUCT.md in CONTRIBUTING.md`

```markdown
---
name: Documentation
about: Report issues or suggest improvements for documentation
title: "[Docs]: Link CODE_OF_CONDUCT.md in CONTRIBUTING.md"
labels: ["documentation"]
assignees: ''
---

**App Name:** `monorepo-root`

**Description of issue/suggestion**
The `CONTRIBUTING.md` file mentions the "Code of Conduct" in the "Code of Conduct" section, but it does not provide a direct link to the `CODE_OF_CONDUCT.md` file. This makes it harder for new contributors to find and read the full Code of Conduct.

**Location of documentation**
Specify the file path or URL of the documentation you are referring to.

**Suggested changes (if any)**
Provide specific suggestions for how the documentation could be improved.
For example, change:
`Please note that this project is released with a Contributor Code of Conduct.`
To:
`Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md).`
```