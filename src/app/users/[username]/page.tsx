import NotFound from "@/app/not-found";
import { UnsplashUser } from "@/app/types/types"
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Alert } from "react-bootstrap";

interface PageProps{
  params: Promise<{username: string}>,
}


async function getUser(username: string): Promise<UnsplashUser>{
   const response = await fetch(`https://api.unsplash.com/users/${username}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`)

  if(response.status === 404) notFound();
  return await response.json();
}

// because of multiple fetch request incase we're using axios then we have to cache the function
const getUserCache = cache(getUser)

// we wnt to generate a dynamic metadata, we use promise cause async function return promises
export async function generateMetadata(props:PageProps): Promise<Metadata> {
  const params = await props.params;

  const {
    username
  } = params;

  // const response = await fetch(`https://api.unsplash.com/users/${username}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`)

  // if(response.status === 404) notFound();
  // const user: UnsplashUser = await response.json();
  const user = await getUserCache(username)
  // const user = getUserCache(username)
  return{
    // title: `${user.first_name}  ${user.last_name} - Nextjs Image gallery`

    // incase there is not first or last name you can use any one or if there is none then use the username
    title: ([user.first_name, user.last_name].filter(Boolean).join(" ") || user.username) + " - Next JS Image gallery"
  }
}

export default async function Page(props: PageProps) {
  const params = await props.params;

  const {
    username
  } = params;

  const user = await getUserCache(username)
  // const response = await fetch(`https://api.unsplash.com/users/${username}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`)

  // if(response.status === 404) notFound();
  // const user: UnsplashUser = await response.json();
  // const user = getUserCache(username)

  return(
    <div>
      <Alert>
      This profile page uses <strong>generateMetadata</strong> to set the <strong>page title</strong> dynamically from the API response.
      </Alert>

      <h1>{user.username}</h1>
      <p>First name: {user.first_name}</p>
      <p>Last name: {user.last_name}</p>
      {/* cause we're using external link we can use the anchor tag */}
      <a href={`https://unsplash.com/${user.username}`} target="_blank">Unsplash profile</a>
    </div>
  )
}