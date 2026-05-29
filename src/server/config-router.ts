import { Router } from 'express';
import fs from 'fs';
import path from 'path';

/**
 * Create an Express Router that provides GET/PUT CRUD for a JSON config file.
 *
 * **SERVER-ONLY** — This utility uses Node.js `fs`, `path`, and Express APIs.
 * Do not import it from client/browser code.
 *
 * @param configPath - Absolute or relative path to the JSON config file.
 * The path is resolved via `path.resolve()` so relative paths are relative to
 * the current working directory.
 * @param validate - Optional validation function. Receives the parsed request body
 * and should throw with a message string if validation fails.
 * @returns An Express Router with `GET /` (read) and `PUT /` (write) routes.
 *
 * @example
 * ```ts
 * import { createConfigRouter } from '@lenya/webapp-shared/server/config-router';
 *
 * const app = express();
 * app.use('/api/config', createConfigRouter('/etc/myapp/config.json'));
 * ```
 *
 * @example
 * ```ts
 * // With validation
 * createConfigRouter('config.json', (data) => {
 *   if (!data || !Array.isArray(data.items)) {
 *     throw new Error('Invalid config: "items" must be an array');
 *   }
 * });
 * ```
 */
export function createConfigRouter(
  configPath: string,
  validate?: (data: unknown) => void,
): Router {
  const resolvedPath = path.resolve(configPath);
  const router = Router();

  router.get('/', (_req, res) => {
    try {
      const raw = fs.readFileSync(resolvedPath, 'utf-8');
      res.json(JSON.parse(raw));
    } catch {
      res.status(500).json({ error: `Failed to read config: ${resolvedPath}` });
    }
  });

  router.put('/', (req, res) => {
    const config = req.body;

    try {
      if (validate) {
        validate(config);
      }
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
      return;
    }

    try {
      fs.writeFileSync(resolvedPath, JSON.stringify(config, null, 2) + '\n');
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: `Failed to write config: ${resolvedPath}` });
    }
  });

  return router;
}
