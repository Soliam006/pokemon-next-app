'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Pokemon {
  name: string
  url: string
}

async function getPokemons(limit: number, offset: number) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
  if (!res.ok) throw new Error('Failed to fetch Pokemons')
  return res.json()
}

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
      const newPokemons = await getPokemons(initialLimit, offset)
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
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pokemons.map((pokemon) => (
            <Link href={`/detail/${pokemon.name}`} key={pokemon.name}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold capitalize">{pokemon.name}</h2>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-4 text-center">
        <Button
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