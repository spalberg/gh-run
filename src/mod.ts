import { cli } from './cli.ts';

export { ghRun } from './gh_run.ts';

if (import.meta.main) {
  await cli();
}
