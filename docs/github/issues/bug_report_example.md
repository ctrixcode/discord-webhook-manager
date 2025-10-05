# Example: Bug Report Issue

This document provides an example of how to fill out the `bug_report.md` Issue template.

---

**Scenario:** A user finds that the application crashes when trying to upload an avatar larger than 5MB.

---

## Example Issue Content

**Title:** `[Bug]: App crashes on large avatar upload`

```markdown
---
name: Bug Report
about: Report a reproducible bug or unexpected behavior
title: "[Bug]: App crashes on large avatar upload"
labels: ["bug"]
assignees: ''
---

**App Name:** `web`, `backend`

**Describe the bug**
When attempting to upload an avatar image larger than 5MB, the frontend application freezes and the backend API returns a 500 Internal Server Error, causing the app to become unresponsive.

**To Reproduce**
Steps to reproduce the behavior:
1. Log in to the application.
2. Navigate to the "Profile Settings" page.
3. Click on the "Change Avatar" button.
4. Select an image file that is larger than 5MB (e.g., a high-resolution PNG).
5. Click "Upload".
6. See the application freeze and eventually crash.

**Expected behavior**
The application should display a user-friendly error message (e.g., "File size exceeds limit") and prevent the upload, without crashing. The backend should return a 400-level error for invalid input, not a 500.

**Screenshots**
[Attach a screenshot of the frozen UI or the error message if possible]

**Desktop (please complete the following information):**
- OS: Windows 10
- Browser: Chrome

**Smartphone (please complete the following information):**
- Device: Samsung Galaxy S21
- OS: Android 13
- Browser: Chrome

**Additional context**
The issue seems to occur consistently with files over 5MB. Smaller files upload successfully.
```