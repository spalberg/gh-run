import { assertEquals, assertStringIncludes } from 'jsr:@std/assert';
import { run } from './utils.ts';

const simpleExample = 'https://github.com/spalberg/gh-run/blob/main/src/examples/simple/main.ts';

Deno.test(function simple() {
  const { code, stdout } = run(Deno.execPath(), 'run', '-A', 'src/cli.ts', '--debug', simpleExample);
  assertEquals(code, 0);
  assertStringIncludes(stdout, 'Hello from a simple deno script!');
});
