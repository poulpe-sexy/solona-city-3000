import { cities } from '../lib/cities'

export function useCities() {
  return { cities, isLoading: false }
}
