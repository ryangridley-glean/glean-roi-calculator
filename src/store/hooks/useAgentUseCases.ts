import { useState, useEffect } from 'react'
import { dataProvider } from '@/api'
import type { AgentUseCase } from '@/types/agents'

interface AgentUseCaseState {
  data: AgentUseCase[] | null
  isLoading: boolean
  error: string | null
}

export function useAgentUseCases(): AgentUseCaseState {
  const [state, setState] = useState<AgentUseCaseState>({
    data: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    dataProvider.getAgentUseCases()
      .then(data => setState({ data, isLoading: false, error: null }))
      .catch(err => setState({ data: null, isLoading: false, error: String(err) }))
  }, [])

  return state
}
