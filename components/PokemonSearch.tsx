'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePokemonContext } from  "@/app/context/PokemonContext"
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const POKEMON_COUNT = 898 // Número total de Pokémon en la API

export default function PokemonSearch() {
  const [localSearchTerm, setLocalSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [allPokemon, setAllPokemon] = useState<string[]>([])
  const { setSearchTerm } = usePokemonContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Fetch all Pokemon names when the component mounts
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_COUNT}`)
      .then(response => response.json())
      .then(data => {
        setAllPokemon(data.results.map((pokemon: { name: string }) => pokemon.name))
      })
  }, [])

  useEffect(() => {
    if (localSearchTerm.length > 1) {
      const filtered = allPokemon.filter(name =>
        name.toLowerCase().includes(localSearchTerm.toLowerCase())
      ).slice(0, 5) // Limit to 5 suggestions
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [localSearchTerm, allPokemon])


const [windowWidth, setWindowWidth] = useState(window.innerWidth);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(localSearchTerm)
    setSuggestions([])
    if (localSearchTerm) {
      setSearchTerm(localSearchTerm)
      router.push(`/detail/${localSearchTerm.toLowerCase()}`)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setLocalSearchTerm(suggestion)
    setSearchTerm(suggestion)
    setSuggestions([])
    if (inputRef.current) inputRef.current.focus()
  }

  return (
      <div className="relative mb-6">
        <div className="flex flex-col md:flex-row">
          <div className="mr-5 md:w-1/2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar Pokémon"
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  className="w-full"
              />
              <Button className="bg-sky-800 hover:bg-sky-900" type="submit">Buscar</Button>
            </form>
          </div>
        <div className="mt-10 mb-2  md:mt-0 md:mb-0">
          <AnimatePresence>
            {suggestions.length > 0 && (
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    className="absolute  w-full max-w-md  flex flex-wrap justify-center gap-2"
                >
                  {suggestions.map((suggestion, index) => (
                      <motion.button
                          key={suggestion}
                          initial={{scale: 0}}
                          animate={{scale: 1.1}}
                          exit={{scale: 0}}
                          transition={{delay: index * 0.05}}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="pokeball-suggestion mr-2 md:mr-5"
                          aria-label={`Sugerencia: ${suggestion}`}
                      >
                        <div className="pokeball-top"></div>
                        <div className="pokeball-bottom"></div>
                        <div className="pokeball-button"></div>
                        <span className="suggestion-text">{suggestion}</span>
                      </motion.button>
                  ))}
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

</div>
)
}