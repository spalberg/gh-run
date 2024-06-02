import { ghRun } from './gh_run.ts';
import { run } from './utils.ts';

export { ghRun } from './gh_run.ts';

if (import.meta.main) {
  const token = run('gh', 'auth', 'token').stdout;

  const scriptUrl = Deno.args[0];
  const configFileUrl = Deno.args[1];

  const statusCode = await ghRun(scriptUrl, { token, configFileUrl });
  Deno.exit(statusCode);
}
