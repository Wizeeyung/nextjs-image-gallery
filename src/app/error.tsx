"use client"
// error page has to be a client component

interface ErrorPageProps{
  error: Error;
  reset: () => void;
}

export default function Error({error, reset}: ErrorPageProps){
  return(
    <div>
      <h1>Error</h1>
      <p>Something went wrong</p>
      <Button onClick={reset}>Try again</Button>
    </div>

  )
}

import React from 'react'
import { Button } from 'react-bootstrap';

