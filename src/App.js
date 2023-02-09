import React, {useEffect, useState} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const GITHUB_ENDPOINT = 'https://api.github.com/repos/facebook/react/releases';

function App() {
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    async function getResponse() {
      const cache = await caches.open('github');
      const match = await cache.match(GITHUB_ENDPOINT);

      if (match) {
        return match;
      }

      await cache.add(GITHUB_ENDPOINT);
      return cache.match(GITHUB_ENDPOINT);
    }

    getResponse(GITHUB_ENDPOINT)
      .then(response => response.json())
      .then(result => setReleases(result));
  }, []);

  return (
    <ListGroup>
      {releases.map(release => (
        <ListGroup.Item key={release.id}>
          {release.tag_name} on {release.published_at}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default App;
