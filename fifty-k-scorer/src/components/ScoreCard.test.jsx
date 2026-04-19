import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScoreCard from './ScoreCard'

describe('ScoreCard', () => {
  const defaultPlayers = {
    our: ['张三', '李四'],
    their: ['王五', '赵六']
  }

  const defaultScores = {
    ourTotal: 500,
    theirTotal: 300,
    ourLevel: 5,
    theirLevel: 3
  }

  it('should render both teams', () => {
    render(<ScoreCard players={defaultPlayers} scores={defaultScores} />)
    expect(screen.getByText('我方')).toBeInTheDocument()
    expect(screen.getByText('对方')).toBeInTheDocument()
  })

  it('should render player names', () => {
    render(<ScoreCard players={defaultPlayers} scores={defaultScores} />)
    expect(screen.getByText('张三 & 李四')).toBeInTheDocument()
    expect(screen.getByText('王五 & 赵六')).toBeInTheDocument()
  })

  it('should render scores and levels', () => {
    render(<ScoreCard players={defaultPlayers} scores={defaultScores} />)
    expect(screen.getByText('500分')).toBeInTheDocument()
    expect(screen.getByText('300分')).toBeInTheDocument()
    expect(screen.getByText('5级')).toBeInTheDocument()
    expect(screen.getByText('3级')).toBeInTheDocument()
  })

  it('should show placeholder when no players', () => {
    render(<ScoreCard players={{ our: [], their: [] }} scores={defaultScores} />)
    // Both teams will show placeholder
    expect(screen.getAllByText('点击上方设置')).toHaveLength(2)
  })

  it('should handle single player each team', () => {
    render(<ScoreCard players={{ our: ['张三'], their: ['王五'] }} scores={defaultScores} />)
    expect(screen.getByText('张三')).toBeInTheDocument()
    expect(screen.getByText('王五')).toBeInTheDocument()
  })

  it('should handle negative scores', () => {
    render(<ScoreCard players={defaultPlayers} scores={{
      ourTotal: -200,
      theirTotal: 100,
      ourLevel: -2,
      theirLevel: 1
    }} />)
    expect(screen.getByText('-200分')).toBeInTheDocument()
    expect(screen.getByText('-2级')).toBeInTheDocument()
  })

  it('should handle zero scores', () => {
    render(<ScoreCard players={defaultPlayers} scores={{
      ourTotal: 0,
      theirTotal: 0,
      ourLevel: 0,
      theirLevel: 0
    }} />)
    expect(screen.getAllByText('0分')).toHaveLength(2)
    expect(screen.getAllByText('0级')).toHaveLength(2)
  })
})