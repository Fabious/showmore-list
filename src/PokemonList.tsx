import axios, { AxiosRequestConfig } from 'axios';
import { useState } from 'react';
import { PokeapiResponse, Pokemon } from './types';

type Status = 'initial' | 'hasMore' | 'noMore';
type PokemonListState = {
  nextPage: string | null;
  status: Status;
};

const PokemonList = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [state, setState] = useState<PokemonListState>({
    nextPage: null,
    status: 'initial',
  });

  function updatePokemon(data: PokeapiResponse) {
    if (data.next) {
      setState({
        nextPage: data.next,
        status: 'hasMore',
      });
    } else {
      setState({
        nextPage: null,
        status: 'noMore',
      });
    }
    setPokemon((pokemon) => [...pokemon, ...data.results]);
  }

  function fetchPokemon() {
    if (state.status === 'noMore') {
      return console.log(`Nothing more to fetch!`);
    }

    if (state.nextPage) {
      return axios.get<PokeapiResponse>(state.nextPage).then((result) => {
        updatePokemon(result.data);
      });
    }

    const config: AxiosRequestConfig = {
      baseURL: 'https://pokeapi.co/api/v2/',
      params: {
        limit: 10,
      },
    };

    return axios.get<PokeapiResponse>('type', config).then((result) => {
      updatePokemon(result.data);
    });
  }

  return (
    <div>
      <h1>Pokemon List (total fetched: {pokemon.length})</h1>
      <h2>current status: {state.status}</h2>

      {pokemon.length > 0 ? (
        <ol>
          {pokemon.map((p) => (
            <li key={p.name}>{p.name}</li>
          ))}
        </ol>
      ) : (
        <div>no pokemons</div>
      )}

      <button
        disabled={state.status === 'noMore'}
        onClick={() => fetchPokemon()}
      >
        Load pokemon
      </button>
    </div>
  );
};

export default PokemonList;
