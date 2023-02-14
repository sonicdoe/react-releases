export const config = {
  runtime: 'edge',
};

import {Octokit} from '@octokit/rest';

const GITHUB_OWNER = 'facebook';
const GITHUB_REPO = 'react';

const octokit = new Octokit();

export default async () => {
  const response = await octokit.rest.repos.listReleases({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
  });

  return new Response(JSON.stringify(response.data), {
    headers: {
      // Cache for a week to avoid running into GitHub’s rate limit.
      'Cache-Control': 'public, max-age=604800',
      'Content-Type': 'application/json',
      'X-RateLimit-Limit': response.headers['X-RateLimit-Limit'],
      'X-RateLimit-Remaining': response.headers['X-RateLimit-Remaining'],
      'X-RateLimit-Reset': response.headers['X-RateLimit-Reset'],
      'X-RateLimit-Used': response.headers['X-RateLimit-Used'],
    },
  });
};
