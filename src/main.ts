function run(cmd: string, ...args: string[]) {
  const command = new Deno.Command(cmd, { args });
  const { code, stdout, stderr } = command.outputSync();
  return {
    code,
    stdout: new TextDecoder().decode(stdout).trim(),
    stderr: new TextDecoder().decode(stderr).trim(),
  };
}

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
  await Deno.writeTextFile(configFile, content);
  return configFile;
}

type GhRunOptions = {
  token: string;
  configFileUrl?: string;
};

export async function ghRun(scriptUrl: string, {
  token,
  configFileUrl,
}: GhRunOptions) {
  const configFile = configFileUrl != null ? await getConfigFile(configFileUrl, token) : null;

  const args = ['run', '-A'];
  if (configFile != null) {
    args.push('-c', configFile);
  }
  args.push(scriptUrl);
  const cmd = new Deno.Command(Deno.execPath(), {
    args,
    env: {
      DENO_AUTH_TOKENS: `${token}@raw.githubusercontent.com`,
    },
  });
  const proc = cmd.spawn();
  const status = await proc.status;
  return { statusCode: status.code, configFile };
}

if (import.meta.main) {
  const token = run('gh', 'auth', 'token').stdout;

  const scriptUrl = Deno.args[0];
  const configFileUrl = Deno.args[1];

  const { statusCode, configFile } = await ghRun(scriptUrl, { token, configFileUrl });
  if (configFile != null) await Deno.remove(configFile);
  Deno.exit(statusCode);
}
