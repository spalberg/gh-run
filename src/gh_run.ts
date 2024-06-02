import * as log from '@std/log';
import { normalizeGithubUrl } from './gh_urls.ts';

async function fetchConfigFileContent(url: string, token: string) {
  const req = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3.raw',
    },
  });
  if (!req.ok) {
    throw new Error(`Failed to fetch config file: ${req.statusText}`);
  }
  return req.text();
}

async function getConfigFile(url: string, token: string) {
  const content = await fetchConfigFileContent(url, token);
  const configFile = await Deno.makeTempFile();
  log.debug(`Writing config file: ${configFile}`);
  await Deno.writeTextFile(configFile, content);
  return {
    configFile,
    [Symbol.asyncDispose]: () => {
      log.debug(`Removing config file: ${configFile}`);
      return Deno.remove(configFile);
    },
  };
}

type GhRunOptions = {
  token: string;
  configFileUrl?: string;
};

export async function ghRun(scriptUrl: string, {
  token,
  configFileUrl,
}: GhRunOptions): Promise<number> {
  const configFile = configFileUrl != null ? await getConfigFile(normalizeGithubUrl(configFileUrl), token) : null;

  const args = ['run', '--reload=https://raw.githubusercontent.com', '-A'];
  if (configFile != null) {
    args.push('-c', configFile.configFile);
  }
  args.push(normalizeGithubUrl(scriptUrl));
  const cmd = new Deno.Command(Deno.execPath(), {
    args,
    env: {
      DENO_AUTH_TOKENS: `${token}@raw.githubusercontent.com`,
    },
  });
  const proc = cmd.spawn();
  const status = await proc.status;
  return status.code;
}
