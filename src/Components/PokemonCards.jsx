import React from 'react';

const PokemonCards = ({ pokemonData }) => {
  // Fallback for image source in case dream_world image is not available
  const getImageSource = () => {
    const dreamWorldImage = pokemonData.sprites.other.dream_world.front_default;
    const officialArtwork = pokemonData.sprites.other['official-artwork']?.front_default;
    const defaultImage = pokemonData.sprites.front_default;
    
    return dreamWorldImage || officialArtwork || defaultImage;
  };

  return (
    <li className="pokemon-card">
      <figure>
        <img
          src={getImageSource()}
          alt={`${pokemonData.name} pokemon`}
          className="pokemon-image"
          loading="lazy"
        />
      </figure>
      
      <h1 className="pokemon-name">{pokemonData.name}</h1>
      
      <div className="pokemon-info pokemon-highlight">
        <p>
          {pokemonData.types.map((curType, index) => (
            <span key={index} className="type-tag">
              {curType.type.name}
              {index < pokemonData.types.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      </div>
      
      <div className="grid-three-cols">
        <p className="pokemon-info">
          <span>Height:</span> {pokemonData.height}
        </p>
        <p className="pokemon-info">
          <span>Weight:</span> {pokemonData.weight}
        </p>
        <p className="pokemon-info">
          <span>Speed:</span> {pokemonData.stats[5].base_stat}
        </p>
      </div>
      
      <div className="grid-three-cols">
        <div className="pokemon-info">
          <p>{pokemonData.base_experience || 'N/A'}</p>
          <span>Experience:</span>
        </div>
        <div className="pokemon-info">
          <p>{pokemonData.stats[1].base_stat}</p>
          <span>Attack:</span>
        </div>
        <div className="pokemon-info">
          <p>
            {pokemonData.abilities.length > 0
              ? pokemonData.abilities[0].ability.name
              : 'None'}
          </p>
          <span>Abilities:</span>
        </div>
      </div>
    </li>
  );
};

export default PokemonCards;