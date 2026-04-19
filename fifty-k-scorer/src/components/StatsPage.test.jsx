import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatsPage from './StatsPage'

describe('StatsPage', () => {
  it('should render stats title', () => {
    render(<StatsPage stats={{ totalGames: 0, rounds: 0, players: {} }} />)
    expect(screen.getByText(/统计/)).toBeInTheDocument()
    expect(screen.getByText(/玩家战绩/)).toBeInTheDocument()
  })

  it('should show empty state when no stats', () => {
    render(<StatsPage stats={{ totalGames: 0, rounds: 0, players: {} }} />)
    expect(screen.getByText('暂无数据')).toBeInTheDocument()
  })

  it('should display total games', () => {
    render(<StatsPage stats={{ totalGames: 10, rounds: 5, players: {} }} />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('总局数')).toBeInTheDocument()
  })

  it('should display total rounds', () => {
    render(<StatsPage stats={{ totalGames: 10, rounds: 5, players: {} }} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('总轮数')).toBeInTheDocument()
  })

  it('should display player stats', () => {
    const stats = {
      totalGames: 10,
      rounds: 5,
      players: {
        '张三': { games: 10, wins: 6 },
        '李四': { games: 8, wins: 4 },
        '王五': { games: 10, wins: 8 }
      }
    }
    render(<StatsPage stats={stats} />)

    expect(screen.getByText('张三')).toBeInTheDocument()
    expect(screen.getByText('李四')).toBeInTheDocument()
    expect(screen.getByText('王五')).toBeInTheDocument()
  })

  it('should display win rate', () => {
    const stats = {
      totalGames: 10,
      rounds: 5,
      players: {
        '张三': { games: 10, wins: 6 }
      }
    }
    render(<StatsPage stats={stats} />)

    expect(screen.getByText('6胜 / 10局 (60%)')).toBeInTheDocument()
  })

  it('should display 0% win rate', () => {
    const stats = {
      totalGames: 10,
      rounds: 5,
      players: {
        '张三': { games: 5, wins: 0 }
      }
    }
    render(<StatsPage stats={stats} />)

    expect(screen.getByText('0胜 / 5局 (0%)')).toBeInTheDocument()
  })

  it('should display 100% win rate', () => {
    const stats = {
      totalGames: 10,
      rounds: 5,
      players: {
        '张三': { games: 5, wins: 5 }
      }
    }
    render(<StatsPage stats={stats} />)

    expect(screen.getByText('5胜 / 5局 (100%)')).toBeInTheDocument()
  })

  it('should sort players by wins descending', () => {
    const stats = {
      totalGames: 10,
      rounds: 5,
      players: {
        '张三': { games: 10, wins: 3 },
        '李四': { games: 10, wins: 8 },
        '王五': { games: 10, wins: 5 }
      }
    }
    render(<StatsPage stats={stats} />)

    const playerItems = screen.getAllByText(/胜 \/ \d+局/)
    // 李四 (8胜) should come before 王五 (5胜) should come before 张三 (3胜)
    expect(playerItems[0]).toHaveTextContent('8胜')
    expect(playerItems[1]).toHaveTextContent('5胜')
    expect(playerItems[2]).toHaveTextContent('3胜')
  })
})