export function run(cmd: string, ...args: string[]): { code: number; stdout: string; stderr: string } {
  const command = new Deno.Command(cmd, { args });
  const { code, stdout, stderr } = command.outputSync();
  return {
    code,
    stdout: new TextDecoder().decode(stdout).trim(),
    stderr: new TextDecoder().decode(stderr).trim(),
  };
}

export function checkCommandAvailability(cmd: string): boolean {
  const { code } = isWindows() ? run(`(gcm ${cmd}).Path`) : run('which', cmd);
  return code === 0;
}

function isWindows(): boolean {
  return Deno.build.os === 'windows';
}
