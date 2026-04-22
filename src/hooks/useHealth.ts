import { useQuery } from '@tanstack/react-query'
import { healthService } from '../services/healthService'

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => healthService.check(),
    refetchInterval: 30_000, // poll every 30s
    retry: false,
  })
}
