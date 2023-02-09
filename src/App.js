import React, {useEffect, useState} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const GITHUB_ENDPOINT = 'https://api.github.com/repos/facebook/react/releases';

function App() {
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    fetch(GITHUB_ENDPOINT)
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
