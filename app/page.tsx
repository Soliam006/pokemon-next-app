import { PokemonProvider } from './context/PokemonContext'
import PokemonList from '@/components/PokemonList'
import PokemonSearch from '@/components/PokemonSearch'

export default function PokemonApp() {
  return (
    <PokemonProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Pokémon App</h1>
        <PokemonSearch />
          <div className="mt-10" >
                <PokemonList   initialLimit={20}  />
          </div>
      </div>
    </PokemonProvider>
  )
}