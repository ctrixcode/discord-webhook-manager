import * as fs from 'fs';
import * as path from 'path';
import { logger } from './index';

/**
 * Parses .env.example file and extracts required environment variable names.
 * Ignores comments, empty lines, and optional variables.
 */
function parseEnvExample(): string[] {
  const envExamplePath = path.resolve(__dirname, '../../.env.example');

  if (!fs.existsSync(envExamplePath)) {
    logger.warn(
      '⚠️  .env.example file not found. Skipping automatic validation.'
    );
    return [];
  }

  const content = fs.readFileSync(envExamplePath, 'utf-8');
  const lines = content.split('\n');
  const requiredVars: string[] = [];
  let isOptionalSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and pure comment lines
    if (!trimmed) {
      isOptionalSection = false;
      continue;
    }

    if (trimmed.startsWith('#')) {
      isOptionalSection = trimmed.toLowerCase().includes('optional');
      continue;
    }

    // Extract variable name (before the = sign)
    const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)=/);
    if (match && match[1]) {
      const varName = match[1];

      // Skip optional variables (those in optional sections or marked as optional)
      if (!isOptionalSection) {
        requiredVars.push(varName);
      }
    }
  }

  return requiredVars;
}

/**
 * Validates that all required environment variables from .env.example are set.
 * Throws an error if any required variables are missing or empty.
 */
export function validateEnvVariables(): void {
  const required = parseEnvExample();

  if (required.length === 0) {
    logger.warn('⚠️  No environment variables to validate');
    return;
  }

  const missing: string[] = [];
  const empty: string[] = [];

  for (const key of required) {
    const value = process.env[key];

    if (value === undefined) {
      missing.push(key);
    } else if (typeof value === 'string' && value.trim() === '') {
      empty.push(key);
    }
  }

  if (missing.length > 0) {
    logger.error('Missing required environment variables:', missing);
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  if (empty.length > 0) {
    logger.error('Empty environment variables:', empty);
    throw new Error(`Empty environment variables: ${empty.join(', ')}`);
  }

  logger.info(
    `✅ All ${required.length} required environment variables are set`
  );
}
