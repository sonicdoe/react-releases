export const config = {
  runtime: 'edge',
};

const GITHUB_ENDPOINT = 'https://api.github.com/repos/facebook/react/releases';

export default async () => {
  const response = await fetch(GITHUB_ENDPOINT, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  });
  const body = await response.blob();

  return new Response(body, {
    headers: {
      // Cache for a week to avoid running into GitHub’s rate limit.
      'Cache-Control': 'public, max-age=604800',
      'Content-Type': 'application/json',
      'X-RateLimit-Limit': response.headers.get('X-RateLimit-Limit'),
      'X-RateLimit-Remaining': response.headers.get('X-RateLimit-Remaining'),
      'X-RateLimit-Reset': response.headers.get('X-RateLimit-Reset'),
      'X-RateLimit-Used': response.headers.get('X-RateLimit-Used'),
    },
  });
};
