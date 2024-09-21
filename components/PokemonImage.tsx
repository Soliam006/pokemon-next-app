"use client"
import { useState } from 'react';
import Image from 'next/image';

interface PokemonImageProps {
  defaultImage: string;
  shinyImage: string;
  name: string;
}

const PokemonImage = ({ defaultImage, shinyImage, name }: PokemonImageProps) => {
  const [currentImage, setCurrentImage] = useState(defaultImage);

  const toggleImage = () => {
    setCurrentImage((prevImage) =>
      prevImage === defaultImage ? shinyImage : defaultImage
    );
  };

  return (
    <Image
      src={currentImage}
      alt={name}
      width={400}
      height={400}
      className="w-full h-auto cursor-pointer"
      onClick={toggleImage}
    />
  );
};

export default PokemonImage;