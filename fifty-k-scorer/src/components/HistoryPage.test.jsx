import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HistoryPage from './HistoryPage'

describe('HistoryPage', () => {
  const defaultHistory = [
    {
      id: 1,
      timestamp: '2024/1/1 10:00:00',
      round: 1,
      totalHands: 2,
      ourTeam: {
        players: ['张三', '李四'],
        totalScore: 500,
        level: 5,
        hands: []
      },
      theirTeam: {
        players: ['王五', '赵六'],
        totalScore: 300,
        level: 3,
        hands: []
      },
      levelDiff: 2,
      winner: 'our'
    }
  ]

  const defaultProps = {
    history: defaultHistory,
    searchTerm: '',
    onSearch: vi.fn(),
    onDelete: vi.fn()
  }

  it('should render history title', () => {
    render(<HistoryPage {...defaultProps} />)
    expect(screen.getByText(/游戏历史/)).toBeInTheDocument()
  })

  it('should render search input', () => {
    render(<HistoryPage {...defaultProps} />)
    expect(screen.getByPlaceholderText('🔍 搜索玩家名...')).toBeInTheDocument()
  })

  it('should show empty state when no history', () => {
    render(<HistoryPage {...defaultProps} history={[]} />)
    expect(screen.getByText('暂无记录')).toBeInTheDocument()
  })

  it('should show search empty state', () => {
    render(<HistoryPage {...defaultProps} history={[]} searchTerm="张三" />)
    expect(screen.getByText('没有找到')).toBeInTheDocument()
  })

  it('should display history item', () => {
    render(<HistoryPage {...defaultProps} />)
    expect(screen.getByText('张三 & 李四 vs 王五 & 赵六')).toBeInTheDocument()
    // "第1局" appears in multiple places, use more specific selector
    expect(screen.getByText(/第1局.*2024/)).toBeInTheDocument()
  })

  it('should display win result', () => {
    render(<HistoryPage {...defaultProps} />)
    expect(screen.getByText(/张三 & 李四 胜/)).toBeInTheDocument()
  })

  it('should display loss result', () => {
    const history = [{
      ...defaultHistory[0],
      winner: 'their'
    }]
    render(<HistoryPage {...defaultProps} history={history} />)
    expect(screen.getByText(/王五 & 赵六 胜/)).toBeInTheDocument()
  })

  it('should display draw result', () => {
    const history = [{
      ...defaultHistory[0],
      winner: 'draw'
    }]
    render(<HistoryPage {...defaultProps} history={history} />)
    expect(screen.getByText(/平局/)).toBeInTheDocument()
  })

  it('should call onSearch when typing in search input', async () => {
    const onSearch = vi.fn()
    render(<HistoryPage {...defaultProps} onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('🔍 搜索玩家名...')
    await userEvent.type(input, '张三')

    // userEvent.type calls onChange for each character
    // Since searchTerm prop is always '', each keystroke triggers onSearch with that character
    expect(onSearch).toHaveBeenCalled()
    // First call: '张', second call: '三' (input resets between keystrokes)
    expect(onSearch).toHaveBeenCalledWith('张')
    expect(onSearch).toHaveBeenCalledWith('三')
  })

  it('should call onDelete when delete button clicked', async () => {
    window.confirm = vi.fn(() => true)
    const onDelete = vi.fn()
    render(<HistoryPage {...defaultProps} onDelete={onDelete} />)

    await userEvent.click(screen.getByText('删除'))
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('should expand history item on click', async () => {
    render(<HistoryPage {...defaultProps} />)

    const historyItem = screen.getByText('张三 & 李四 vs 王五 & 赵六').closest('.history-item')
    await userEvent.click(historyItem)

    expect(historyItem).toHaveClass('expanded')
  })

  it('should collapse expanded item on second click', async () => {
    render(<HistoryPage {...defaultProps} />)

    const historyItem = screen.getByText('张三 & 李四 vs 王五 & 赵六').closest('.history-item')
    await userEvent.click(historyItem)
    await userEvent.click(historyItem)

    expect(historyItem).not.toHaveClass('expanded')
  })

  it('should filter by search term', () => {
    render(<HistoryPage {...defaultProps} searchTerm="张三" />)
    expect(screen.getByText('张三 & 李四 vs 王五 & 赵六')).toBeInTheDocument()
  })

  it('should not show item when search does not match', () => {
    render(<HistoryPage {...defaultProps} searchTerm="不存在的玩家" />)
    expect(screen.getByText('没有找到')).toBeInTheDocument()
  })

  it('should display hand count', () => {
    render(<HistoryPage {...defaultProps} />)
    // "(2把)" appears in the result line
    expect(screen.getByText(/\(2把\)/)).toBeInTheDocument()
  })

  it('should display score and level diff', () => {
    const history = [{
      ...defaultHistory[0],
      levelDiff: 5
    }]
    render(<HistoryPage {...defaultProps} history={history} />)
    expect(screen.getByText(/胜5级/)).toBeInTheDocument()
  })
})