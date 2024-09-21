export interface Type {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}
export interface Pokemon {
    id: number;
    name: string;
    url: string;
    sprites: {
      other: {
        'official-artwork': {
          front_default: string;
          front_shiny: string;
        };
      };
    };
    types: Type[]; // Agrega la nueva propiedad 'types'
    moves: Array<{ move: { name: string , url: string} }>;
     /** The height of this Pokémon in decimeters */
    height: number;
    /** The weight of this Pokémon in hectograms */
    weight: number;
    /** The abilities of this Pokémon **/
    abilities: Array <{ability: {name: string, url: string}}>;
    stats: Array<{base_stat: number, effort:number, stat: {name: string, url: string}}>;
}


export async function getPokemonDetails(name: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  if (!res.ok) return null
  return res.json()
}

export async function getPokemonSpecies(name: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`)
  if (!res.ok) return null
  return res.json()
}

// Modifica la función getPokemons para que también obtenga los datos de los tipos de cada Pokémon
export async function getPokemonsWithTypes(limit: number, offset: number) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
  if (!res.ok) throw new Error('Failed to fetch Pokemons')
  const data = await res.json()

  // Para cada Pokémon, obtén sus datos de tipo
  const pokemonsWithTypes = await Promise.all(data.results.map(async (pokemon: Pokemon) => {
    const res = await fetch(pokemon.url)
    if (!res.ok) throw new Error(`Failed to fetch Pokemon ${pokemon.name}`)
    const pokemonData = await res.json()
    return { ...pokemon, types: pokemonData.types }
  }))

  return { ...data, results: pokemonsWithTypes }
}