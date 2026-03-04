import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NoteResizeHandle } from './NoteResizeHandle'

const onMouseDown = vi.fn()

describe('NoteResizeHandle', () => {
  it('should render a button with the resize handle class and label', () => {
    render(<NoteResizeHandle onMouseDown={onMouseDown} />)

    const button = screen.getByRole('button', { name: /resize note/i })
    expect(button).toHaveClass('note-resize-handle')
    expect(screen.getByLabelText(/resize note/i)).toBeInTheDocument()
  })

  it('should call onMouseDown when the handle is pressed', async () => {
    const onMouseDown = vi.fn()

    render(<NoteResizeHandle onMouseDown={onMouseDown} />)
    const button = screen.getByRole('button', { name: /resize note/i })
    await userEvent.pointer({ keys: '[MouseLeft]', target: button })

    expect(onMouseDown).toHaveBeenCalledTimes(1)
    expect(onMouseDown).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mousedown',
      }),
    )
  })

  it('passes the mouse event with target to onMouseDown', async () => {
    const onMouseDown = vi.fn()

    render(<NoteResizeHandle onMouseDown={onMouseDown} />)
    const button = screen.getByRole('button', { name: /resize note/i })
    await userEvent.pointer({ keys: '[MouseLeft]', target: button })

    const [event] = onMouseDown.mock.calls[0]
    expect(event.target).toBe(button)
  })
})
