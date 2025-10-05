# Contributing to Discord Webhook Manager

We welcome contributions to the Discord Webhook Manager monorepo! By contributing, you help us improve and expand this project for everyone.

Please take a moment to review this document to make the contribution process as smooth as possible.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project, you agree to abide by its terms.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please open an issue on GitHub. When reporting a bug, please include:

*   A clear and concise description of the bug.
*   Steps to reproduce the behavior.
*   Expected behavior.
*   Screenshots or error messages if applicable.
*   Your environment details (OS, Node.js version, browser, etc.).

### Suggesting Enhancements

We love new ideas! If you have a suggestion for an enhancement or a new feature, please open an issue on GitHub. Describe your idea clearly and explain why you think it would be beneficial.

### Code Contributions

1.  **Fork the repository:** Start by forking the `discord-webhook-manager` repository to your GitHub account.
2.  **Clone your fork:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/discord-webhook-manager.git
    cd discord-webhook-manager
    ```
3.  **Install dependencies:** This project is a monorepo using `pnpm`.
    ```bash
    pnpm install
    ```
4.  **Create a new branch:**
    ```bash
    git checkout -b feature/your-feature-name
    # or
    git checkout -b bugfix/your-bug-fix-name
    ```
5.  **Make your changes:** Implement your feature or bug fix.
    *   Ensure your code adheres to the existing coding style. We use ESLint and Prettier.
    *   Write clear, concise, and well-documented code.
    *   Add or update tests for your changes.
6.  **Run tests:**
    ```bash
    pnpm test # or navigate to specific app and run pnpm test
    ```
7.  **Format and lint your code:**
    ```bash
    pnpm format:check # Check for formatting issues
    pnpm format # Fix formatting issues
    pnpm lint # Check for linting issues
    pnpm lint:fix # Fix linting issues
    ```
    *(These commands assume you have root-level scripts configured in `package.json` or `turbo.json` to run these across the monorepo, or you can run them within `apps/web` or `apps/backend` directories.)*
8.  **Commit your changes:** Write a clear and descriptive commit message.
    ```bash
    git commit -m "feat: Add new feature X"
    # or
    git commit -m "fix: Resolve bug Y"
    ```
9.  **Push to your fork:**
    ```bash
    git push origin feature/your-feature-name
    ```
10. **Open a Pull Request (PR):** Go to the original `discord-webhook-manager` repository on GitHub and open a new pull request from your branch.
    *   Provide a clear title and description for your PR.
    *   Reference any related issues.

## Development Setup

For detailed instructions on setting up your development environment, including prerequisites and environment variables, please refer to the main [`README.md`](./README.md) file.

## GitHub Contribution Guides

For detailed examples on how to use our Issue and Pull Request templates, and how to manage the `CHANGELOG.md`, please refer to our [GitHub Contribution Guides](./docs/github/README.MD).

## License

By contributing to Discord Webhook Manager, you agree that your contributions will be licensed under its ISC License.
