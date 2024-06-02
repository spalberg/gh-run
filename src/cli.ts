import * as log from '@std/log';
import { Command } from '@cliffy/command';
import denoJson from '../deno.json' with { type: 'json' };
import { checkCommandAvailability, run } from './utils.ts';
import { ghRun } from './gh_run.ts';

export async function cli() {
  await new Command()
    .name('gh-run')
    .version(denoJson.version)
    .description(denoJson.description)
    .arguments('<scriptUrl>')
    .env('GH_TOKEN=<token:string>', 'GitHub token')
    .option('-t, --token <token:string>', 'GitHub token')
    .option('-c, --config <configUrl:string>', 'GitHub config file')
    .option('--debug', 'Enable debug mode')
    .action(async (options, scriptUrl) => {
      if (options.debug) {
        enableDebugLogging();
      }
      const token = resolveToken(options.token, options.ghToken);
      const statusCode = await ghRun(scriptUrl, { token, configFileUrl: options.config });
      Deno.exit(statusCode);
    })
    .parse(Deno.args);
}

function resolveToken(optionToken: string | undefined, envToken: string | undefined): string {
  if (optionToken != null) {
    log.debug('Using token from option');
    return optionToken;
  }
  const cliToken = getTokenFromGhCli();
  if (cliToken != null) {
    log.debug('Using token from gh cli');
    return cliToken;
  }
  if (envToken != null) {
    log.debug('Using token from env');
    return envToken;
  }
  log.error('GitHub token is required!');
  Deno.exit(1);
}

function getTokenFromGhCli(): string | null {
  const isAvailable = checkCommandAvailability('gh');
  if (!isAvailable) {
    log.debug('gh cli is not available');
    return null;
  }
  const { code, stdout, stderr } = run('gh', 'auth', 'token');
  if (code !== 0) {
    log.error(stderr);
    Deno.exit(1);
  }
  return stdout;
}

function enableDebugLogging() {
  log.setup({
    handlers: {
      console: new log.ConsoleHandler('DEBUG'),
    },
    loggers: {
      default: {
        level: 'DEBUG',
        handlers: ['console'],
      },
    },
  });
}

if (import.meta.main) {
  await cli();
}
