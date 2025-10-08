
export type GameStage = 'intro' | 'playing' | 'result';

export interface EquationParams {
  a: number;
  b: number;
}

export interface Scenario {
  story: string;
  eq1: EquationParams;
  eq2: EquationParams;
}

export interface Point {
  x: number;
  y: number;
}

export interface GraphDataPoint {
  x: number;
  line1: number | null;
  line2: number | null;
}
