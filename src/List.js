import React, {useEffect, useState} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import {DateTime} from 'luxon';

const ENDPOINT = '/api/releases';

function List() {
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    fetch(ENDPOINT)
      .then(response => response.json())
      .then(result => setReleases(result));
  }, []);

  return (
    <ListGroup>
      {releases.map(release => {
        const publishedAt = DateTime.fromISO(release.published_at);

        return (
          <ListGroup.Item key={release.id} action href={release.html_url}>
            {release.tag_name} on {publishedAt.toLocaleString()}
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}

export default List;
