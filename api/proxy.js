export const config = {
  runtime: 'edge',
};

import {Octokit} from '@octokit/rest';

const GITHUB_OWNER = 'facebook';
const GITHUB_REPO = 'react';

const octokit = new Octokit();

export default async () => {
  // The paginate function directly returns an array of data objects, so we use
  // the map function to extract the last response’s headers into this variable.
  let headers;

  const releases = await octokit.paginate(octokit.rest.repos.listReleases, {
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    // As of 2023-02-14, there are 99 releases, so we wouldn’t need to paginate.
    // Still, we keep this here to demonstrate the ability and future-proof.
    // eslint-disable-next-line camelcase
    per_page: 100,
  }, response => {
    headers = response.headers;

    return response.data;
  });

  return new Response(JSON.stringify(releases), {
    headers: {
      // Cache for a week to avoid running into GitHub’s rate limit.
      'Cache-Control': 'public, max-age=604800',
      'Content-Type': 'application/json',
      'X-RateLimit-Limit': headers['x-ratelimit-limit'],
      'X-RateLimit-Remaining': headers['x-ratelimit-remaining'],
      'X-RateLimit-Reset': headers['x-ratelimit-reset'],
      'X-RateLimit-Used': headers['x-ratelimit-used'],
    },
  });
};
