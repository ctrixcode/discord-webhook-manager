import { config as baseConfig } from '@repo/eslint-config/base';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  // Add any monorepo-wide overrides or additional configurations here
];
