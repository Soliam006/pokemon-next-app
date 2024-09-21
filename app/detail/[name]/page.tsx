import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {Chain, Pokemon, getPokemonDetails, getPokemonSpecies} from '@/app/services/pokemonApi'

import { GiSpikedShield , GiCrossedSwords , GiDervishSwords, GiSwordsEmblem, GiRun   } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";

import PokemonImage from "@/components/PokemonImage";

type StatName = 'hp' | 'attack' | 'special-attack' | 'special-defense' | 'defense'| 'speed';

const statIcons: Record<StatName, JSX.Element> = {
  hp: <FaHeart />,
  attack: <GiCrossedSwords />,
  'special-attack': <GiDervishSwords />,
    defense: <GiSwordsEmblem />,
  'special-defense': <GiSpikedShield />,
    speed: <GiRun />
};
interface Stat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export default async function PokemonDetail({ params }: { params: { name: string } }) {
  const pokemon : Pokemon = await getPokemonDetails(params.name)
  const species = await getPokemonSpecies(params.name)

  if (!pokemon || !species) notFound()

  const evolution_chain = await fetch(species.evolution_chain.url).then(res => res.json())

  return (
      <div className="w-full p-4 bg-sky-800">
        <Link href="/" className="text-white hover:text-sky-400  ">&larr; Back to list</Link>
        <div className="flex flex-col lg:flex-row mt-5">
          <Card className="">
            <CardHeader>
              <CardTitle className="text-3xl font-bold capitalize">{pokemon.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <PokemonImage
                    defaultImage={pokemon.sprites.other['official-artwork'].front_default}
                    shinyImage={pokemon.sprites.other['official-artwork'].front_shiny}
                    name={pokemon.name}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Stats</h2>
                  {pokemon.stats.map((stat: Stat) => (
                      <div key={stat.stat.name} className="mb-2">
                        <div className="flex justify-between">
                          <div className="flex flex-row justify-between">
                            {statIcons[stat.stat.name as StatName]}
                            <span className="pl-4 capitalize">{stat.stat.name.replace('-', ' ')}</span>
                          </div>
                          <span>{stat.base_stat}</span>
                        </div>
                        <Progress value={stat.base_stat} className="h-2"/>
                      </div>
                  ))}
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Types</h2>
                  <div className="flex gap-2">
                    {pokemon.types.map((type: { type: { name: string } }) => (
                        <span key={type.type.name} className="px-2 py-1 bg-gray-200 rounded-full capitalize">
                    {type.type.name}
                  </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Abilities</h2>
                  <ul className="list-disc list-inside">
                    {pokemon.abilities.map((ability: { ability: { name: string } }) => (
                        <li key={ability.ability.name} className="capitalize">{ability.ability.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 mt-5 lg:mt-0 lg:ml-10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Moves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {pokemon.moves.slice(0, 20).map((move: { move: { name: string } }) => (
                    <span key={move.move.name} className="px-2 py-1 bg-gray-200 rounded-full capitalize">
                {move.move.name}
              </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 ">
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

function renderEvolutionChain(chain: Chain) {
  const result = []
  let currentPokemon = chain
  console.log("Block CHain", chain)

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