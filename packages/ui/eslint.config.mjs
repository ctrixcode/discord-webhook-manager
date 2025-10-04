import { config as reactInternalConfig } from '@repo/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...reactInternalConfig,
  // Add any UI-specific overrides or additional configurations here
];