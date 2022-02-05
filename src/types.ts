export interface Pokemon {
  name: string;
  url: string;
}

export interface PokeapiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}
