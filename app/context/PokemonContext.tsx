'use client'

import React, { createContext, useState, useContext } from 'react'

interface PokemonContextType {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined)

export function PokemonProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <PokemonContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </PokemonContext.Provider>
  )
}

export function usePokemonContext() {
  const context = useContext(PokemonContext)
  if (context === undefined) {
    throw new Error('usePokemonContext must be used within a PokemonProvider')
  }
  return context
}