import axios, { AxiosRequestConfig } from 'axios';
import React, { useEffect, useState } from 'react';
import { Pokemon, PokeapiResponse } from './types';

interface PokemonFilteredListProps {
  initialLoad: boolean;
  step: number;
}

/**
 * Exercice that tackles stale state in React when
 * you use state in a callback: here in fetchMorePokemon
 *
 * If you setState in a useEffect, and just after call the callback,
 * the state inside the callback will be stale, here `page` is stale
 *
 * Be careful when your function uses state or props that change:
 * it means that your function is NOT pure !
 * Calling fetchMorePokemon the way we did (with page state) was not pure
 * because we update the state each time we call the function
 * fetchPokemon() // page === 1
 * fetchPokemon() // page === 2
 * fetchPokemon() // page === 3
 * This is NOT pure and can bring confusion like I did =]
 *
 * solution :
 * - avoid state in callback
 * - don't use a callback after a setState if the callback use the state
 * - useRef (don't like it)
 *
 * NOT sure of this part: in this example the prop `step` is not
 * stale because we set it as a dependency  of the useEffect
 */

const PokemonFilteredList = ({
  initialLoad,
  step,
}: PokemonFilteredListProps) => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // one solution is to use function params, avoiding the use of state
  // we make the function PURE!
  const fetchMorePokemon = async (pageParam: number) => {
    const config: AxiosRequestConfig = {
      baseURL: 'https://pokeapi.co/api/v2/',
      params: {
        // step prop not stale
        limit: step,
        // here we used the stale page state instead of pageParam
        offset: pageParam ? pageParam * step : undefined,
      },
    };

    await axios.get<PokeapiResponse>('type', config).then(({ data }) => {
      setPokemon((pokemon) => [...pokemon, ...data.results]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(!!data.next);
    });
  };

  useEffect(() => {
    setPokemon([]);
    setPage(0);
    setHasMore(true);

    console.log('page', page); // stale page, maybe not 0

    if (initialLoad) {
      fetchMorePokemon(0);
    }
  }, [step]);

  // not sure of this solution...
  // useEffect(() => {
  //   if (pokemon.length === 0 && initialLoad) {
  //     fetchMorePokemon();
  //   }
  // }, [pokemon]);

  return (
    <div>
      <pre>
        page: {page} step: {step}
      </pre>
      <p>total fetched: {pokemon.length}</p>

      {pokemon.length > 0 ? (
        <ol>
          {pokemon.map((p, i) => (
            <li key={i}>{p.name}</li>
          ))}
        </ol>
      ) : (
        <div>no pokemons</div>
      )}

      <button disabled={!hasMore} onClick={() => fetchMorePokemon(page)}>
        Load pokemon
      </button>
    </div>
  );
};

export const PokemonWithFilters = () => {
  const [step, setStep] = useState(10);

  return (
    <>
      <select value={step} onChange={(e) => setStep(parseInt(e.target.value))}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <PokemonFilteredList initialLoad={true} step={step} />
        <PokemonFilteredList initialLoad={false} step={step} />
        <PokemonFilteredList initialLoad={false} step={step} />
        <PokemonFilteredList initialLoad={false} step={step} />
        <PokemonFilteredList initialLoad={false} step={step} />
      </div>
    </>
  );
};
