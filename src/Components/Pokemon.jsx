// import React, { useState } from 'react'
// import "../index.css"
// import { useEffect } from 'react'
// import PokemonCards from './PokemonCards';
// import LoadingSpinner from './Loading';
// const Pokemon = () => {
//     const [pokemon,setPokemon]=useState([]);
//     const [loading,setLoading]=useState(true);
//     const [error,setError]=useState('');
//     const api='https://pokeapi.co/api/v2/pokemon?limit=224';
//     const [search,setSearch]=useState("");
//     const fetchPokemon=async()=>{
//         try{
//         const res=await fetch(api);
//         const data=await res.json();
//         // console.log(data)

//             const detailedPokemonData=data.results.map(async (currPokemon)=>{

//                 // console.log(currPokemon.url);
//                 const res=await fetch(currPokemon.url);
//                 const data=await res.json();
//                 // console.log(data);
//                 return data;
//             });
//             // console.log(detailedPokemonData);

//             const detailedResponses=await Promise.all(detailedPokemonData);
//             setPokemon(detailedResponses);
//             setLoading(false);
//             console.log(detailedResponses);
//         }catch(error){
//             console.log(error)
//             setLoading(false);
//             setError(error);
//         }
//     }
//     useEffect(()=>{
//         fetchPokemon();
//     },[]);

//     //search funtionality

//     const searchData=pokemon.filter((currPokemon)=>currPokemon.name.toLowerCase().includes(search.toLowerCase()));

// if(loading){
//     return(
//         <LoadingSpinner/>
//     )
// }
// if(error){
//     return(
//         <div>
//             <h1>Error: {error.message}</h1>
//         </div>
//     )
// }

//   return (
//     <section className="container">
//         <header>
//             <h1>Lets Catch Pokemon</h1>
//         </header>
//         <div className="pokemon-search">
//             <input type="text" placeholder='Search Pokemon'value={search} onChange={(e)=>setSearch(e.target.value)}/>
//         </div>
//         <div>
//             <ul className="cards">
//                 {searchData.map((currPokemon)=>{
//                     return <PokemonCards key={currPokemon.id} pokemonData={currPokemon}/>
//                 })}
//             </ul>
//         </div>
//     </section>
//   )
// }

// export default Pokemon



import React, { useState, useEffect } from 'react';
import "../index.css";
import PokemonCards from './PokemonCards';
import LoadingSpinner from './Loading';

const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const api = 'https://pokeapi.co/api/v2/pokemon?limit=224';
  
  // Get unique Pokemon types
  const pokemonTypes = [...new Set(pokemon.flatMap(p => p.types.map(t => t.type.name)))].sort();
  
  const fetchPokemon = async () => {
    try {
      setLoading(true);
      const res = await fetch(api);
      const data = await res.json();
      
      const detailedPokemonData = data.results.map(async (currPokemon) => {
        const res = await fetch(currPokemon.url);
        const data = await res.json();
        return data;
      });
      
      const detailedResponses = await Promise.all(detailedPokemonData);
      setPokemon(detailedResponses);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error);
    }
  };
  
  useEffect(() => {
    fetchPokemon();
    
    // Add scroll event listener
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Filter Pokemon by search text and type
  const filteredPokemon = pokemon.filter((currPokemon) => {
    const matchesSearch = currPokemon.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "" || 
      currPokemon.types.some(t => t.type.name === typeFilter);
    
    return matchesSearch && matchesType;
  });
  
  const loadMore = () => {
    setVisibleCount(prev => prev + 20);
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const randomizePokemon = () => {
    const randomIndex = Math.floor(Math.random() * pokemon.length);
    const randomPokemon = pokemon[randomIndex];
    setSearch(randomPokemon.name);
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h1>Oops! Something went wrong</h1>
        <p>Error: {error.message}</p>
        <button className="retry-button" onClick={fetchPokemon}>Try Again</button>
      </div>
    );
  }

  return (
    <section className="container">
      <header className="pokemon-header">
        <h1>Pokémon Explorer</h1>
        <p className="app-subtitle">Gotta catch 'em all!</p>
      </header>
      
      <div className="search-filter-container">
        <div className="pokemon-search">
          <input 
            type="text" 
            placeholder="Search Pokémon..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="clear-search" onClick={() => setSearch("")} aria-label="Clear search">
            {search && "×"}
          </button>
        </div>
        
        <div className="filter-controls">
          <select 
            className="type-filter" 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {pokemonTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          
          <button className="random-button" onClick={randomizePokemon}>
            Random Pokémon
          </button>
        </div>
      </div>
      
      {filteredPokemon.length > 0 ? (
        <>
          <div className="results-info">
            <p>Showing {Math.min(visibleCount, filteredPokemon.length)} of {filteredPokemon.length} results</p>
          </div>
          
          <ul className="cards">
            {filteredPokemon.slice(0, visibleCount).map((currPokemon) => (
              <PokemonCards key={currPokemon.id} pokemonData={currPokemon} />
            ))}
          </ul>
          
          {visibleCount < filteredPokemon.length && (
            <div className="load-more-container">
              <button className="load-more-button" onClick={loadMore}>
                Load More Pokémon
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-results">
          <h2>No Pokémon Found</h2>
          <p>Try a different search term or clear filters</p>
          <button className="reset-button" onClick={() => {setSearch(""); setTypeFilter("")}}>
            Reset All Filters
          </button>
        </div>
      )}
      
      {showScrollButton && (
        <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
          ↑
        </button>
      )}
    </section>
  );
};

export default Pokemon;