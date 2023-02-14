import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import {DateTime} from 'luxon';

const ENDPOINT = '/api/releases';

function List() {
  const [releases, setReleases] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const abortController = new AbortController();

    fetch(`${ENDPOINT}?query=${encodeURIComponent(query)}`, {
      signal: abortController.signal,
    })
      .then(response => response.json())
      .then(result => setReleases(result))
      .catch(error => {
        if (error?.name === 'AbortError') {
          return;
        }

        throw error;
      });

    return () => {
      abortController.abort();
    };
  }, [query]);

  const onQueryChange = event => {
    setQuery(event.target.value);
  };

  return (
    <>
      <Form
        className='mb-2' onSubmit={event => {
          event.preventDefault();
        }}
      >
        <Form.Control type='text' placeholder='Search by version…' value={query} onChange={onQueryChange}/>
      </Form>

      <ListGroup variant='flush'>
        {releases.map(release => {
          const publishedAt = DateTime.fromISO(release.published_at);

          return (
            <ListGroup.Item key={release.id} action href={release.html_url}>
              <span className='font-monospace'>{release.tag_name}</span> on {publishedAt.toLocaleString()}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </>
  );
}

export default List;
