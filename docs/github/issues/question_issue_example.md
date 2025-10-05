# Example: Question / Support Issue

This document provides an example of how to fill out the `question.md` Issue template.

---

**Scenario:** A user is unsure how to configure Cloudinary credentials for avatar uploads.

---

## Example Issue Content

**Title:** `[Question]: How to configure Cloudinary credentials?`

```markdown
---
name: Question / Support
about: Ask a question or seek support regarding the project
title: "[Question]: How to configure Cloudinary credentials?"
labels: ["question"]
assignees: ''
---

**App Name:** `backend`

**Your Question**
I'm trying to set up the backend for avatar uploads, but I'm unsure where to get the `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` values mentioned in the `.env.example`. Do I need to create a Cloudinary account, and if so, where do I find these specific values?

**Context / What you've tried**
I've looked at the `README.md` and the `apps/backend/.env.example` file. I've also searched the Cloudinary documentation but couldn't immediately find a clear guide on how to obtain these specific credentials for integration with this project. I have a Cloudinary account, but I'm not sure which dashboard section provides these.
```