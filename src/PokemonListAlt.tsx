import axios, { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Pokemon, PokeapiResponse } from './types';

const PokemonListAlt = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(0);
  const [next, setNext] = useState(false);

  const loadPokemon = useCallback(async () => {
    const config: AxiosRequestConfig = {
      baseURL: 'https://pokeapi.co/api/v2/',
      params: {
        limit: 10,
        offset: page ? page * 10 : undefined,
      },
    };

    await axios.get<PokeapiResponse>('pokemon', config).then(({ data }) => {
      setPokemon((pokemon) => [...pokemon, ...data.results]);
      setNext(!!data.next);
    });
  }, [page]);

  useEffect(() => {
    loadPokemon();
  }, [loadPokemon, page]);

  const loadMore = () => {
    if (page !== 0 && !next) return;
    setPage((page) => page + 1);
  };

  return (
    <div>
      <h1>Pokemon List (total fetched: {pokemon.length})</h1>

      {pokemon.length > 0 ? (
        <ol>
          {pokemon.map((p) => (
            <li key={p.name}>{p.name}</li>
          ))}
        </ol>
      ) : (
        <div>no pokemons</div>
      )}

      <button disabled={!next} onClick={loadMore}>
        Load pokemon
      </button>
    </div>
  );
};

export default PokemonListAlt;
