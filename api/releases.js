export const config = {
  runtime: 'edge',
};

const PROXY_ENDPOINT = 'https://react-releases-sonicdoe.vercel.app/api/proxy';

function filterReleases(releases, query) {
  if (!query) {
    return releases;
  }

  return releases.filter(release => release.tag_name.startsWith(query));
}

export default async req => {
  const url = new URL(req.url);
  const query = url.searchParams.get('query');

  const response = await fetch(PROXY_ENDPOINT);
  const releases = await response.json();
  const filteredReleases = filterReleases(releases, query);

  return new Response(JSON.stringify(filteredReleases), {
    headers: {
      'Content-Type': 'application/json',
      'X-RateLimit-Limit': response.headers.get('X-RateLimit-Limit'),
      'X-RateLimit-Remaining': response.headers.get('X-RateLimit-Remaining'),
      'X-RateLimit-Reset': response.headers.get('X-RateLimit-Reset'),
      'X-RateLimit-Used': response.headers.get('X-RateLimit-Used'),
    },
  });
};
