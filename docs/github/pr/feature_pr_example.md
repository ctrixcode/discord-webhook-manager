# Example: Feature Pull Request

This document provides an example of how to fill out the `feature.md` Pull Request template.

---

**Scenario:** Implement the ability for users to create new message templates with rich embeds.

---

## Example PR Content

**Title:** `feat: Add message template creation with rich embeds`

```markdown
---
name: Feature
about: Propose a new feature or enhancement
title: "[Feat]: Add message template creation with rich embeds"
labels: ["enhancement", "feature"]
assignees: '@your-github-username' # Assign yourself or relevant team member
---

**App Name:** `web`, `backend`

**Description**
This PR introduces a new feature allowing users to create and save message templates, including rich Discord embeds.
Key changes include:
-   **Frontend (`apps/web`):** New UI for creating/editing templates, including an embed builder. Integration with backend API for saving/fetching templates.
-   **Backend (`apps/backend`):** New API endpoints (`/api/message-templates`) for CRUD operations on message templates. New Mongoose model and service logic for `MessageTemplate`.

**Related Issue (if applicable)**
Closes #789 (assuming issue #789 is "Implement Message Template Management")

**Type of change**
- [x] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

**How Has This Been Tested?**
Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce. Please also list any relevant details for your test configuration.

- [x] Unit tests
- [x] Integration tests
- [x] Manual testing (describe steps)

**Description of Tests:**

*   **Unit Tests:**
    *   Ran `pnpm test` in `apps/backend` to verify the new `messageTemplate` service functions, controller logic, and Mongoose model methods. All existing and new unit tests passed.
    *   Ran `pnpm test` in `apps/web` to verify the new `useMessageTemplates` hook, embed builder logic, and API integration utilities. All existing and new unit tests passed.

*   **Integration Tests:**
    *   Ran `pnpm test` in `apps/backend` to confirm the new `/api/message-templates` endpoints (POST, GET, PUT, DELETE) correctly interact with the database and return expected responses.
    *   Ran `pnpm test` in `apps/web` to ensure the frontend's API calls for message templates correctly send/receive data from the backend and handle responses.

*   **Manual Testing:**
    1.  Started both frontend and backend applications locally using `pnpm dev` from the monorepo root.
    2.  Navigated to `http://localhost:3000/templates/new` in Chrome.
    3.  Filled out the "Create New Template" form, including adding a rich embed (title, description, color, fields).
    4.  Clicked "Save Template". Verified success notification.
    5.  Navigated to `http://localhost:3000/templates` and confirmed the new template appeared in the list.
    6.  Edited the template, changed embed details, and saved. Verified changes reflected.
    7.  Deleted the template. Verified removal from UI and database.
    8.  Tested various input validations (e.g., empty title, invalid embed URL).

**Test Configuration Details:**
- OS: Windows 11
- Node.js Version: 20.x
- Database State: Local MongoDB instance.
- Environment Variables: `.env` files configured as per `README.md` for both `apps/web` and `apps/backend`.

**Checklist:**
- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [x] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation (e.g., API docs, user guide)
- [x] My changes generate no new warnings
- [x] I have added tests that prove my fix is effective or that my feature works
- [x] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules
```