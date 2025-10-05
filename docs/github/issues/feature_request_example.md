# Example: Feature Request Issue

This document provides an example of how to fill out the `feature_request.md` Issue template.

---

**Scenario:** Users want to be able to schedule messages to be sent at a future date/time.

---

## Example Issue Content

**Title:** `[Feature]: Implement scheduled message sending`

```markdown
---
name: Feature Request
about: Suggest an idea for this project
title: "[Feature]: Implement scheduled message sending"
labels: ["enhancement"]
assignees: ''
---

**App Name:** `web`, `backend`

**Is your feature request related to a problem? Please describe.**
Currently, all messages sent via the webhook manager are sent immediately. This limits the utility for announcements that need to go out at specific times (e.g., event reminders, daily updates) without manual intervention at that exact moment. Users have to remember to send messages manually, which can lead to missed timings.

**Describe the solution you'd like**
I would like to see an option when composing a message to specify a future date and time for the message to be sent.
-   A date/time picker should be available in the message composer on the frontend.
-   The backend should store these scheduled messages and have a mechanism (e.g., a cron job or message queue) to send them at the specified time.
-   Users should be able to view, edit, and cancel scheduled messages.

**Describe alternatives you've considered**
-   Using external scheduling tools: This adds complexity and requires users to manage multiple platforms.
-   Manual sending: Prone to human error and inconvenient.

**Additional context**
This feature would greatly enhance the automation capabilities of the webhook manager, making it more useful for community managers and event organizers.
```