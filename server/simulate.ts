export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function shouldSimulateError(probability: number): boolean {
  return Math.random() < probability;
}

export const GET_LIST_DELAY_MS = 700;
export const MUTATION_DELAY_MS = 600;
export const MUTATION_ERROR_RATE = 0.2;
