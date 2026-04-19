import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettlePopup from './SettlePopup'

describe('SettlePopup', () => {
  const defaultProps = {
    result: {
      winner: 'our',
      levelDiff: 5,
      ourTotal: 500,
      theirTotal: 300,
      ourLevel: 5,
      theirLevel: 3,
      totalHands: 3
    },
    players: {
      our: ['张三', '李四'],
      their: ['王五', '赵六']
    },
    onNewGame: vi.fn(),
    onClose: vi.fn()
  }

  it('should render popup', () => {
    render(<SettlePopup {...defaultProps} />)
    expect(screen.getByText(/获胜/)).toBeInTheDocument()
  })

  it('should show our team win', () => {
    render(<SettlePopup {...defaultProps} result={{ ...defaultProps.result, winner: 'our' }} />)
    expect(screen.getByText('🎉 我方获胜！')).toBeInTheDocument()
    expect(screen.getByText('张三 & 李四 胜 5级 (3把)')).toBeInTheDocument()
  })

  it('should show their team win', () => {
    render(<SettlePopup {...defaultProps} result={{ ...defaultProps.result, winner: 'their' }} />)
    expect(screen.getByText('😔 对方获胜')).toBeInTheDocument()
    // When their team wins, our team loses
    expect(screen.getByText(/张三 & 李四 负 5级 \(3把\)/)).toBeInTheDocument()
  })

  it('should show draw', () => {
    render(<SettlePopup {...defaultProps} result={{ ...defaultProps.result, winner: 'draw' }} />)
    expect(screen.getByText('🤝 平局')).toBeInTheDocument()
  })

  it('should render action buttons', () => {
    render(<SettlePopup {...defaultProps} />)
    expect(screen.getByText('新局(不变)')).toBeInTheDocument()
    expect(screen.getByText('换队新局')).toBeInTheDocument()
  })

  it('should call onNewGame with true for keep teams', async () => {
    const onNewGame = vi.fn()
    render(<SettlePopup {...defaultProps} onNewGame={onNewGame} />)

    await userEvent.click(screen.getByText('新局(不变)'))
    expect(onNewGame).toHaveBeenCalledWith(true)
  })

  it('should call onNewGame with false for switch teams', async () => {
    const onNewGame = vi.fn()
    render(<SettlePopup {...defaultProps} onNewGame={onNewGame} />)

    await userEvent.click(screen.getByText('换队新局'))
    expect(onNewGame).toHaveBeenCalledWith(false)
  })

  it('should call onClose when clicking outside', async () => {
    const onClose = vi.fn()
    const { container } = render(<SettlePopup {...defaultProps} onClose={onClose} />)

    const overlay = container.querySelector('.popup')
    fireEvent.click(overlay)

    expect(onClose).toHaveBeenCalled()
  })

  it('should display correct level diff', () => {
    render(<SettlePopup {...defaultProps} result={{ ...defaultProps.result, levelDiff: 10 }} />)
    expect(screen.getByText('张三 & 李四 胜 10级 (3把)')).toBeInTheDocument()
  })

  it('should display correct hand count', () => {
    render(<SettlePopup {...defaultProps} result={{ ...defaultProps.result, totalHands: 5 }} />)
    expect(screen.getByText('张三 & 李四 胜 5级 (5把)')).toBeInTheDocument()
  })

  it('should display zero hand count', () => {
    render(<SettlePopup {...defaultProps} result={{ ...defaultProps.result, totalHands: 0 }} />)
    expect(screen.getByText('张三 & 李四 胜 5级 (0把)')).toBeInTheDocument()
  })
})