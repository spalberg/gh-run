import { assertEquals } from 'jsr:@std/assert';
import { normalizeGithubUrl } from './gh_urls.ts';

const githubUrl = 'https://github.com/spalberg/gh-run/blob/main/src/examples/complex/main.ts';
const githubUserContentUrl = 'https://raw.githubusercontent.com/spalberg/gh-run/main/src/examples/complex/main.ts';

Deno.test(function noop() {
  assertEquals(normalizeGithubUrl(githubUserContentUrl), githubUserContentUrl);
});

Deno.test(function happyPath() {
  assertEquals(normalizeGithubUrl(githubUrl), githubUserContentUrl);
});
