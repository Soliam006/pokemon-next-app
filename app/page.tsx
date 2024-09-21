import { PokemonProvider } from './context/PokemonContext'
import PokemonList from '@/components/PokemonList'
import PokemonSearch from '@/components/PokemonSearch'
import Image from 'next/image'

export default function PokemonApp() {
  return (
      <PokemonProvider>
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