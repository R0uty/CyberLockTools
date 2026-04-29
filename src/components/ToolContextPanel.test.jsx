/* @vitest-environment jsdom */

import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ToolContextPanel from './ToolContextPanel'

describe('ToolContextPanel', () => {
  it('renders related guides and flow stages and triggers callbacks', () => {
    const onOpenGuide = vi.fn()
    const onOpenFlowStage = vi.fn()

    render(
      <ToolContextPanel
        toolTitle="Base64"
        relatedGuides={['Browser DevTools']}
        relatedFlowStages={[{
          flowKey: 'decode',
          flowLabel: 'Decode Flow',
          stageId: 'decode',
          stageLabel: 'Decode'
        }]}
        flowOriginContext={{
          flowKey: 'decode',
          stageId: 'decode',
          recommendedFlowKey: 'decode',
          recommendedStageId: 'result',
          recommendationReason: 'Return after trying a decoder and continue from result.'
        }}
        onOpenGuide={onOpenGuide}
        onOpenFlowStage={onOpenFlowStage}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Browser DevTools' }))
    expect(onOpenGuide).toHaveBeenCalledWith('Browser DevTools')

    fireEvent.click(screen.getByRole('button', { name: /Decode Flow/i }))
    expect(onOpenFlowStage).toHaveBeenCalledWith('decode', 'decode')

    fireEvent.click(screen.getByRole('button', { name: 'Return to current flow' }))
    expect(onOpenFlowStage).toHaveBeenCalledWith('decode', 'decode')

    fireEvent.click(screen.getByRole('button', { name: 'Continue at recommended stage' }))
    expect(onOpenFlowStage).toHaveBeenCalledWith('decode', 'result')
  })
})
