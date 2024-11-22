import { UnsplashImage } from "@/app/types/types"
import Image from "next/image";
import styles from "./TopicPage.module.css";
import { Alert } from "react-bootstrap";
import { Metadata } from "next";

// interface PageProps {
//   params: {topic: string}
// }

interface Iparams {
  params: { topic: string },
}

// if you want to generate metadata dynamically
// export function generateMetadata({params}: {params: Iparams}): Metadata{
//   return {
//     title: params.topic + "- Nextjs Image gallery"
//   }
// }


// if i want to generate some query at build time then i can use the generate staticparams feature
export function generateStaticParams(){
  return ["health", "fitness", "coding"].map(topic => ({topic}));
}




// if we want to be able to access only the params or words for this page then we do 
// export const dynamicParams = false;

// if you dont want to cache the data you can set revalidate to zero
// export const revalidate = 0;

const Page = async ({ params }: { params: Promise<Iparams['params']>} ) => {

  const {topic} = await params;
    const response = await fetch(`https://api.unsplash.com/photos/random?query=${topic}&count=30&client_id=${process.env.UNSPLASH_ACCESS_KEY}`)
    const images: UnsplashImage[] = await response.json();

    console.log(images, 'image')


  return(
    <div>
      <Alert>
      This page uses <strong>generateStaticParams</strong> to render and cache static pages at build time, even though the URL has a dynamic parameter. Pages that are not included in generateStaticParams will be etched & rendered on first access and then cached for subsequent requests (this can be disabled).
      </Alert>

      <h1>{topic}</h1>
      {
        images.map(image => (
          <Image 
            src={image.urls.raw}
            width={250}
            height={250}
            alt={image.description || 'Image'}
            key={image.urls.raw}
            className={styles.image}
          />
        ))
      }
    </div>
  )
}

export default Page