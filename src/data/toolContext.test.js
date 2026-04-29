import { describe, expect, it } from 'vitest'
import { getRelatedFlowStages, getRelatedGuides } from './toolContext'

describe('toolContext relations', () => {
  it('returns decode flow stage links for decoder tools', () => {
    const related = getRelatedFlowStages('Base64')

    expect(related.some((entry) => entry.flowKey === 'decode' && entry.stageId === 'decode')).toBe(true)
  })

  it('returns guide links for API-like tools', () => {
    const related = getRelatedGuides('GraphQL Injection Generator')

    expect(related).toContain('Postman')
    expect(related).toContain('curl')
  })
})
