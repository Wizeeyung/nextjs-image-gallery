// metadata dont directly work in a client component
import ClientOnly from "@/components/ClientOnly"
import SearchPage from "./SearchPage"

export const metadata = {
  title: 'Search - NextJs 13 Image gallery'
}

export default function Page(){
  return (
  <div>
    <ClientOnly>
      <SearchPage />
    </ClientOnly>
  </div>
  )
}