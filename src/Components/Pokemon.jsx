import React, { useState } from 'react'
import "../index.css"
import { useEffect } from 'react'
import PokemonCards from './PokemonCards';
import LoadingSpinner from './Loading';
const Pokemon = () => {
    const [pokemon,setPokemon]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState('');
    const api='https://pokeapi.co/api/v2/pokemon?limit=224';
    const [search,setSearch]=useState("");
    const fetchPokemon=async()=>{
        try{
        const res=await fetch(api);
        const data=await res.json();
        // console.log(data)

            const detailedPokemonData=data.results.map(async (currPokemon)=>{

                // console.log(currPokemon.url);
                const res=await fetch(currPokemon.url);
                const data=await res.json();
                // console.log(data);
                return data;
            });
            // console.log(detailedPokemonData);

            const detailedResponses=await Promise.all(detailedPokemonData);
            setPokemon(detailedResponses);
            setLoading(false);
            console.log(detailedResponses);
        }catch(error){
            console.log(error)
            setLoading(false);
            setError(error);
        }
    }
    useEffect(()=>{
        fetchPokemon();
    },[]);

    //search funtionality

    const searchData=pokemon.filter((currPokemon)=>currPokemon.name.toLowerCase().includes(search.toLowerCase()));

if(loading){
    return(
        <LoadingSpinner/>
    )
}
if(error){
    return(
        <div>
            <h1>Error: {error.message}</h1>
        </div>
    )
}

  return (
    <section className="container">
        <header>
            <h1>Lets Catch Pokemon</h1>
        </header>
        <div className="pokemon-search">
            <input type="text" placeholder='Search Pokemon'value={search} onChange={(e)=>setSearch(e.target.value)}/>
        </div>
        <div>
            <ul className="cards">
                {searchData.map((currPokemon)=>{
                    return <PokemonCards key={currPokemon.id} pokemonData={currPokemon}/>
                })}
            </ul>
        </div>
    </section>
  )
}

export default Pokemon