"use client";

import { UnsplashImage } from '@/app/types/types';
import React, { FormEvent, useEffect, useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "./SearchPage.module.css";
import Image from 'next/image';

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchResults, setSearchResults] = useState<UnsplashImage[] | null>(null);
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const [searchResultError, setSearchResultError] = useState(false);
  const [query, setQuery] = useState<string>(searchParams.get('query') || '');

  useEffect(() => {
    // Fetch search results if query exists in URL
    if (query) {
      searchImages(query);
    }
  }, [query]);

  const searchImages = async (query: string) => {
    try {
      setSearchResults(null);
      setSearchResultsLoading(true);
      setSearchResultError(false);

      const response = await fetch(`/api/search?query=${query}`);
      const images: UnsplashImage[] = await response.json();
      setSearchResults(images);
    } catch (error) {
      console.error(error);
      setSearchResultError(true);
    } finally {
      setSearchResultsLoading(false);
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newQuery = formData.get('query')?.toString().trim();

    if (newQuery) {
      setQuery(newQuery);
      router.push(`/search?query=${newQuery}`); // Update the URL
    }
  }

  return (
    <div>

      <Alert>
      This page fetches data <strong>client-side.</strong> In order to not leak API credentials, the request is sent to a NextJS route handler that runs on the server. This <strong>route handler</strong> then fetches the data from the Unsplash API and returns it to the client.
      </Alert>

      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='search-input'>
          <Form.Label>Search query</Form.Label>
          <Form.Control
            name='query'
            placeholder='E.g cats, hotdogs, ...'
            defaultValue={query} // Persist the query in the input field
          />
        </Form.Group>

        <Button type='submit' className='mb-3' disabled={searchResultsLoading}>
          Search
        </Button>
      </Form>

      <div className='d-flex flex-column align-items-center'>
        {searchResultsLoading && <Spinner animation='border' />}
        {searchResultError && <p>Something went wrong. Please try again.</p>}
        {searchResults?.length === 0 && <p>Nothing found. Try a different search!</p>}
      </div>

      {searchResults &&
        <>
          {searchResults.map(image => (
            <Image
              src={image.urls.raw}
              width={250}
              height={250}
              alt={image.description || 'image'}
              key={image.urls.raw}
              className={styles.image}
            />
          ))}
        </>
      }
    </div>
  );
};

export default SearchPage;
