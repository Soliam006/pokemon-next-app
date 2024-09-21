'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getPokemonsWithTypes } from "@/app/services/pokemonApi"
import Image from 'next/image'

import { Pokemon } from "@/app/services/pokemonApi"

export default function PokemonList({ initialLimit }: { initialLimit: number }) {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadMorePokemons()
  }, [])

  const loadMorePokemons = async () => {
    setLoading(true)
    try {
      const newPokemons = await getPokemonsWithTypes(initialLimit, offset)
      setPokemons(prevPokemons => [...prevPokemons, ...newPokemons.results])
      setOffset(prevOffset => prevOffset + initialLimit)
    } catch (error) {
      console.error('Error loading more Pokémon:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <ScrollArea className="h-[calc(100vh-200px)] mt-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pokemons.map((pokemon) => (
              <Link href={`/detail/${pokemon.name}`} key={pokemon.name}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <h2 className="text-xl font-semibold capitalize">{pokemon.name}</h2>
                    <div className="flex">
                      {pokemon?.types?.map((type, index) => (
                        <Image
                          key={index}
                          src={`/types/${type.type.name}.png`}
                          alt={type.type.name}
                          width={200}
                          height={200}
                          className="h-10 w-10 cursor-pointer rounded-full"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </ScrollArea>
      <div className="mt-4 text-center">
        <Button
             className="bg-sky-800 hover:bg-sky-900"
            onClick={loadMorePokemons}
            disabled={loading}
            aria-label={loading ? "Loading more Pokémon" : "Load more Pokémon"}
        >
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      </div>
    </div>
  )
}