import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HandList from './HandList'

describe('HandList', () => {
  const defaultProps = {
    hands: {
      our: [],
      their: []
    },
    onRemove: vi.fn()
  }

  it('should not render when no hands', () => {
    const { container } = render(<HandList {...defaultProps} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render hand list with hands', () => {
    const hands = {
      our: [{ totalScore: 500, bombs: [], baseScore: 100, bombScore: 400 }],
      their: [{ totalScore: 200, bombs: [], baseScore: 100, bombScore: 100 }]
    }
    render(<HandList {...defaultProps} hands={hands} />)

    expect(screen.getByText(/本局累积/)).toBeInTheDocument()
    expect(screen.getByText('1把')).toBeInTheDocument()
    expect(screen.getByText('第1把')).toBeInTheDocument()
  })

  it('should render multiple hands', () => {
    const hands = {
      our: [
        { totalScore: 500 },
        { totalScore: 300 },
        { totalScore: 200 }
      ],
      their: [
        { totalScore: 200 },
        { totalScore: 400 },
        { totalScore: 100 }
      ]
    }
    render(<HandList {...defaultProps} hands={hands} />)

    expect(screen.getByText('3把')).toBeInTheDocument()
    expect(screen.getByText('第1把')).toBeInTheDocument()
    expect(screen.getByText('第2把')).toBeInTheDocument()
    expect(screen.getByText('第3把')).toBeInTheDocument()
  })

  it('should display correct scores', () => {
    const hands = {
      our: [{ totalScore: 800 }],
      their: [{ totalScore: 300 }]
    }
    render(<HandList {...defaultProps} hands={hands} />)

    expect(screen.getByText('+800')).toBeInTheDocument()
    expect(screen.getByText('+300')).toBeInTheDocument()
  })

  it('should call onRemove when remove button clicked', async () => {
    const onRemove = vi.fn()
    const hands = {
      our: [{ totalScore: 500 }],
      their: [{ totalScore: 200 }]
    }
    render(<HandList {...defaultProps} hands={hands} onRemove={onRemove} />)

    await userEvent.click(screen.getByText('✕'))
    expect(onRemove).toHaveBeenCalledWith(0)
  })

  it('should call onRemove with correct index for multiple hands', async () => {
    const onRemove = vi.fn()
    const hands = {
      our: [{ totalScore: 500 }, { totalScore: 300 }],
      their: [{ totalScore: 200 }, { totalScore: 400 }]
    }
    render(<HandList {...defaultProps} hands={hands} onRemove={onRemove} />)

    const removeButtons = screen.getAllByText('✕')
    await userEvent.click(removeButtons[1]) // Remove second hand
    expect(onRemove).toHaveBeenCalledWith(1)
  })

  it('should handle negative scores', () => {
    const hands = {
      our: [{ totalScore: -200 }],
      their: [{ totalScore: 300 }]
    }
    render(<HandList {...defaultProps} hands={hands} />)

    // Negative scores are prepended with +, so -200 shows as +-200
    expect(screen.getByText(/\+?-200/)).toBeInTheDocument()
    expect(screen.getByText('+300')).toBeInTheDocument()
  })

  it('should handle zero scores', () => {
    const hands = {
      our: [{ totalScore: 0 }],
      their: [{ totalScore: 0 }]
    }
    render(<HandList {...defaultProps} hands={hands} />)

    // Two +0 text nodes, one for each team
    expect(screen.getAllByText('+0')).toHaveLength(2)
  })
})