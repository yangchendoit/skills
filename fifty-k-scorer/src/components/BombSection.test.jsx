import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BombSection from './BombSection'

describe('BombSection', () => {
  const defaultProps = {
    team: 'our',
    label: '我方炸弹',
    bombs: [],
    onAdd: vi.fn(),
    onRemove: vi.fn(),
    onClear: vi.fn(),
    disabled: false
  }

  it('should render label', () => {
    render(<BombSection {...defaultProps} />)
    expect(screen.getByText('我方炸弹')).toBeInTheDocument()
  })

  it('should render all bomb buttons', () => {
    render(<BombSection {...defaultProps} />)
    expect(screen.getByText('5张')).toBeInTheDocument()
    expect(screen.getByText('6张')).toBeInTheDocument()
    expect(screen.getByText('7张')).toBeInTheDocument()
    expect(screen.getByText('8张')).toBeInTheDocument()
    expect(screen.getByText('9张')).toBeInTheDocument()
    expect(screen.getByText('10张')).toBeInTheDocument()
  })

  it('should render action buttons', () => {
    render(<BombSection {...defaultProps} />)
    expect(screen.getByText('↩️')).toBeInTheDocument()
    expect(screen.getByText('🗑️')).toBeInTheDocument()
  })

  it('should call onAdd when bomb button clicked', async () => {
    const onAdd = vi.fn()
    render(<BombSection {...defaultProps} onAdd={onAdd} />)

    await userEvent.click(screen.getByText('5张'))
    expect(onAdd).toHaveBeenCalledWith('our', 200)
  })

  it('should call onClear when clear button clicked', async () => {
    const onClear = vi.fn()
    window.confirm = vi.fn(() => true)
    render(<BombSection {...defaultProps} onClear={onClear} />)

    await userEvent.click(screen.getByText('🗑️'))
    expect(onClear).toHaveBeenCalledWith('our')
  })

  it('should show bomb list', () => {
    render(<BombSection {...defaultProps} bombs={[200, 500]} />)
    expect(screen.getByText('5张 200分')).toBeInTheDocument()
    expect(screen.getByText('6张 500分')).toBeInTheDocument()
  })

  it('should show total score', () => {
    render(<BombSection {...defaultProps} bombs={[200, 500, 1000]} />)
    expect(screen.getByText('小计: 1700')).toBeInTheDocument()
  })

  it('should call onRemove when remove button clicked', async () => {
    const onRemove = vi.fn()
    render(<BombSection {...defaultProps} bombs={[200, 500]} onRemove={onRemove} />)

    const removeButtons = screen.getAllByText('✕')
    await userEvent.click(removeButtons[0])
    expect(onRemove).toHaveBeenCalledWith('our', 0)
  })

  it('should call onRemove with last index when undo clicked', async () => {
    const onRemove = vi.fn()
    render(<BombSection {...defaultProps} bombs={[200, 500]} onRemove={onRemove} />)

    await userEvent.click(screen.getByText('↩️'))
    expect(onRemove).toHaveBeenCalledWith('our', 1)
  })

  it('should not call onRemove when undo clicked with no bombs', async () => {
    const onRemove = vi.fn()
    render(<BombSection {...defaultProps} bombs={[]} onRemove={onRemove} />)

    await userEvent.click(screen.getByText('↩️'))
    expect(onRemove).not.toHaveBeenCalled()
  })

  it('should disable buttons when disabled prop is true', () => {
    render(<BombSection {...defaultProps} disabled={true} />)
    expect(screen.getByText('5张')).toBeDisabled()
    expect(screen.getByText('6张')).toBeDisabled()
  })

  it('should show correct label for their team', () => {
    render(<BombSection {...defaultProps} team="their" label="对方炸弹" />)
    expect(screen.getByText('对方炸弹')).toBeInTheDocument()
  })

  it('should call onAdd with correct team', async () => {
    const onAdd = vi.fn()
    render(<BombSection {...defaultProps} team="their" onAdd={onAdd} />)

    await userEvent.click(screen.getByText('10张'))
    expect(onAdd).toHaveBeenCalledWith('their', 10000)
  })

  it('should calculate correct total for large bombs', () => {
    render(<BombSection {...defaultProps} bombs={[10000, 10000]} />)
    expect(screen.getByText('小计: 20000')).toBeInTheDocument()
  })
})