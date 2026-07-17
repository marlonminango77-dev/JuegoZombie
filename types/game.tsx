export type Cazador = {
  id: number;
  nombre: string;
  nivel: number;
  vida_maxima: number;
  vida_actual: number;
  defensa: number;
};

export type Arma = {
  id: number;
  nombre: string;
  danio: number;
  municiones: number | null;
  id_cazador: number;
};

export type Zombi = {
  id: number;
  nombre: string;
  vida_maxima: number;
  vida_actual: number;
  danio: number;
  emoji: string;
};

