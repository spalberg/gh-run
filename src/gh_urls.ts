export function normalizeGithubUrl(url: string) {
  const { hostname, pathname } = new URL(url);
  if (hostname === 'github.com') {
    const [owner, repo, _blob, ref, ...path] = pathname.split('/').filter(Boolean);
    return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path.join('/')}`;
  }
  return url;
}
