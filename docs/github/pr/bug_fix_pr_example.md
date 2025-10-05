# Example: Bug Fix Pull Request

This document provides an example of how to fill out the `bug_fix.md` Pull Request template.

---

**Scenario:** A user reports that the "Delete Webhook" button on the frontend is not working, and the backend is returning a 500 error when attempting to delete.

---

## Example PR Content

**Title:** `fix: Correct webhook deletion on frontend and backend`

```markdown
---
name: Bug Fix
about: Submit a fix for a bug
title: "[Fix]: Correct webhook deletion on frontend and backend"
labels: ["bug", "fix"]
assignees: '@your-github-username' # Assign yourself or relevant team member
---

**App Name:** `web`, `backend`

**Description**
This PR fixes an issue where deleting a webhook from the frontend would result in a 500 error from the backend and the webhook not being removed.
The fix involves:
-   Correcting the API endpoint path used by the frontend's delete request.
-   Ensuring the backend's webhook deletion logic correctly handles the provided webhook ID and returns an appropriate success response.

**Related Issue**
Fixes #456 (assuming issue #456 is "Delete Webhook button not working")

**Type of change**
- [x] Bug fix (non-breaking change which fixes an issue)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Chore (e.g., dependency updates, build process changes)

**How Has This Been Tested?**
Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce. Please also list any relevant details for your test configuration.

- [x] Unit tests
- [x] Integration tests
- [x] Manual testing (describe steps)

**Description of Tests:**

*   **Unit Tests:**
    *   Ran `pnpm test` in `apps/backend` to verify the `deleteWebhook` service function and controller logic. All existing and new unit tests passed.
    *   Ran `pnpm test` in `apps/web` to verify the `useDeleteWebhook` hook and related API call utility. All existing and new unit tests passed.

*   **Integration Tests:**
    *   Ran `pnpm test` in `apps/backend` (which includes integration tests for API endpoints) to confirm the `/api/webhooks/:id` DELETE endpoint correctly interacts with the database and returns a 204 No Content response on success.
    *   Ran `pnpm test` in `apps/web` (which includes integration tests for API calls) to ensure the frontend's `deleteWebhook` API call correctly sends data to the backend and handles responses.

*   **Manual Testing:**
    1.  Started both frontend and backend applications locally using `pnpm dev` from the monorepo root.
    2.  Navigated to `http://localhost:3000/webhooks` in Chrome.
    3.  Created a new test webhook if none existed.
    4.  Clicked the "Delete" button next to a webhook entry.
    5.  Confirmed the webhook was removed from the list on the UI and a success notification appeared.
    6.  Verified in the backend database (MongoDB Compass) that the webhook entry was indeed deleted.
    7.  Attempted to delete a non-existent webhook and verified appropriate error handling (e.g., 404 not found) on the frontend.

**Test Configuration Details:**
- OS: Windows 11
- Node.js Version: 20.x
- Database State: Local MongoDB instance with existing webhook data.
- Environment Variables: `.env` files configured as per `README.md` for both `apps/web` and `apps/backend`.

**Checklist:**
- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [x] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [x] My changes generate no new warnings
- [x] I have added tests that prove my fix is effective or that my feature works
- [x] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules
```