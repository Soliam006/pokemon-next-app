import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

async function getPokemonDetails(name: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  if (!res.ok) return null
  return res.json()
}

async function getPokemonSpecies(name: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`)
  if (!res.ok) return null
  return res.json()
}

export default async function PokemonDetail({ params }: { params: { name: string } }) {
  const pokemon = await getPokemonDetails(params.name)
  const species = await getPokemonSpecies(params.name)

  if (!pokemon || !species) notFound()

  const evolution_chain = await fetch(species.evolution_chain.url).then(res => res.json())

  return (
    <div className="container w-full p-4 bg-sky-800">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to list</Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold capitalize">{pokemon.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <Image
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              width={400}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Stats</h2>
              {pokemon.stats.map((stat: any) => (
                <div key={stat.stat.name} className="mb-2">
                  <div className="flex justify-between">
                    <span className="capitalize">{stat.stat.name}</span>
                    <span>{stat.base_stat}</span>
                  </div>
                  <Progress value={stat.base_stat} className="h-2" />
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Types</h2>
              <div className="flex gap-2">
                {pokemon.types.map((type: any) => (
                  <span key={type.type.name} className="px-2 py-1 bg-gray-200 rounded-full capitalize">
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Abilities</h2>
              <ul className="list-disc list-inside">
                {pokemon.abilities.map((ability: any) => (
                  <li key={ability.ability.name} className="capitalize">{ability.ability.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Moves</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {pokemon.moves.slice(0, 20).map((move: any) => (
              <span key={move.move.name} className="px-2 py-1 bg-gray-200 rounded-full capitalize">
                {move.move.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Evolution Chain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            {renderEvolutionChain(evolution_chain.chain)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function renderEvolutionChain(chain: any) {
  const result = []
  let currentPokemon = chain

  while (currentPokemon) {
    result.push(
      <Link href={`/detail/${currentPokemon.species.name}`} key={currentPokemon.species.name} className="text-center">
        <div className="capitalize font-semibold">{currentPokemon.species.name}</div>
        {currentPokemon.evolution_details[0]?.min_level && (
          <div className="text-sm text-gray-500">
            (Level {currentPokemon.evolution_details[0].min_level})
          </div>
        )}
      </Link>
    )

    if (currentPokemon.evolves_to.length > 0) {
      result.push(<span key={`arrow-${currentPokemon.species.name}`} className="text-3xl">→</span>)
      currentPokemon = currentPokemon.evolves_to[0]
    } else {
      break
    }
  }

  return result
}