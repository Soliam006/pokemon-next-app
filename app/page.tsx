import { PokemonProvider } from './context/PokemonContext'
import PokemonList from '@/components/PokemonList'
import PokemonSearch from '@/components/PokemonSearch'
import Image from 'next/image'

export default function PokemonApp() {
  return (
      <PokemonProvider>
          <link
              href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Poppins:wght@400;700&display=swap"
              rel="stylesheet"></link>
          <div className="mx-10 p-4">

              <div className="text-center  items-center ">
                  <Image
                      src="/pokemon-logo.png"
                      alt="Pokémon Logo"
                      width={250}
                      height={110}
                      priority
                  />
              </div>

              <div className="mt-5"><PokemonSearch/></div>

              <div className="mt-10">
                  <PokemonList initialLimit={20}/>
              </div>

          </div>
      </PokemonProvider>
  )
}