import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import {DateTime} from 'luxon';
import {useHotkeys} from 'react-hotkeys-hook';

const ENDPOINT = '/api/releases';

function List() {
  const [releases, setReleases] = useState([]);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState('');

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

  useEffect(() => {
    const cursorRelease = releases.find(release => release.id === cursor);

    // Clear cursor if release no longer exists.
    if (!cursorRelease) {
      setCursor('');
    }
  }, [releases, cursor]);

  useHotkeys(['j', 'k'], event => {
    const direction = event.key === 'j' ? 'down' : 'up';

    if (!releases || releases.length === 0) {
      return;
    }

    if (!cursor) {
      if (direction === 'down') {
        setCursor(releases.at(0).id);
      } else {
        setCursor(releases.at(-1).id);
      }

      return;
    }

    const cursorReleaseIndex = releases.findIndex(release => release.id === cursor);
    const adjacentRelease = direction === 'down'
      ? releases[cursorReleaseIndex + 1]
      : releases[cursorReleaseIndex - 1];

    if (!adjacentRelease) {
      return;
    }

    setCursor(adjacentRelease.id);
  });

  useHotkeys('enter', () => {
    if (!cursor) {
      return;
    }

    const cursorRelease = releases.find(release => release.id === cursor);
    const url = cursorRelease.html_url;

    window.location = url;
  });

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
          const currentlySelected = cursor === release.id;
          const publishedAt = DateTime.fromISO(release.published_at);

          return (
            <ListGroup.Item key={release.id} action href={release.html_url} variant={currentlySelected && 'secondary'}>
              <span className='font-monospace'>{release.tag_name}</span> on {publishedAt.toLocaleString()}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </>
  );
}

export default List;
