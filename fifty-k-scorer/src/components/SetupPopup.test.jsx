import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SetupPopup from './SetupPopup'

describe('SetupPopup', () => {
  const defaultProps = {
    players: {
      our: ['', ''],
      their: ['', '']
    },
    onSave: vi.fn(),
    onClose: vi.fn()
  }

  it('should render popup when visible', () => {
    render(<SetupPopup {...defaultProps} />)
    expect(screen.getByText(/设置玩家/)).toBeInTheDocument()
  })

  it('should render player inputs', () => {
    render(<SetupPopup {...defaultProps} />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(4)
    inputs.forEach(input => {
      expect(input).toHaveAttribute('placeholder', '玩家名')
    })
  })

  it('should render action buttons', () => {
    render(<SetupPopup {...defaultProps} />)
    expect(screen.getByText('确认')).toBeInTheDocument()
    expect(screen.getByText('取消')).toBeInTheDocument()
  })

  it('should populate inputs with existing players', () => {
    const players = {
      our: ['张三', '李四'],
      their: ['王五', '赵六']
    }
    render(<SetupPopup {...defaultProps} players={players} />)

    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveValue('张三')
    expect(inputs[1]).toHaveValue('李四')
    expect(inputs[2]).toHaveValue('王五')
    expect(inputs[3]).toHaveValue('赵六')
  })

  it('should call onClose when cancel clicked', async () => {
    const onClose = vi.fn()
    render(<SetupPopup {...defaultProps} onClose={onClose} />)

    await userEvent.click(screen.getByText('取消'))
    expect(onClose).toHaveBeenCalled()
  })

  it('should call onSave with player names when confirm clicked', async () => {
    const onSave = vi.fn()
    render(<SetupPopup {...defaultProps} onSave={onSave} />)

    const inputs = screen.getAllByRole('textbox')
    await userEvent.type(inputs[0], '张三')
    await userEvent.type(inputs[1], '李四')
    await userEvent.type(inputs[2], '王五')
    await userEvent.type(inputs[3], '赵六')

    await userEvent.click(screen.getByText('确认'))

    expect(onSave).toHaveBeenCalledWith({
      our: ['张三', '李四'],
      their: ['王五', '赵六']
    })
  })

  it('should call onClose when clicking outside', async () => {
    const onClose = vi.fn()
    const { container } = render(<SetupPopup {...defaultProps} onClose={onClose} />)

    const overlay = container.querySelector('.popup')
    fireEvent.click(overlay)

    expect(onClose).toHaveBeenCalled()
  })

  it('should handle partial player names', async () => {
    const onSave = vi.fn()
    render(<SetupPopup {...defaultProps} onSave={onSave} />)

    const inputs = screen.getAllByRole('textbox')
    await userEvent.type(inputs[0], '张三')

    await userEvent.click(screen.getByText('确认'))

    expect(onSave).toHaveBeenCalledWith({
      our: ['张三', ''],
      their: ['', '']
    })
  })

  it('should trim player names', async () => {
    const onSave = vi.fn()
    render(<SetupPopup {...defaultProps} onSave={onSave} />)

    const inputs = screen.getAllByRole('textbox')
    await userEvent.type(inputs[0], '  张三  ')

    await userEvent.click(screen.getByText('确认'))

    expect(onSave).toHaveBeenCalledWith({
      our: ['张三', ''],
      their: ['', '']
    })
  })

  it('should select player slot on click', async () => {
    const players = {
      our: ['张三', '李四'],
      their: ['王五', '赵六']
    }
    render(<SetupPopup {...defaultProps} players={players} />)

    const slots = document.querySelectorAll('.player-slot')
    await userEvent.click(slots[0])

    expect(slots[0]).toHaveClass('selected')
  })

  it('should swap any two players when clicking two slots', async () => {
    const players = {
      our: ['张三', '李四'],
      their: ['王五', '赵六']
    }
    render(<SetupPopup {...defaultProps} players={players} />)

    const slots = document.querySelectorAll('.player-slot')
    // Click first slot (张三)
    await userEvent.click(slots[0])
    expect(slots[0]).toHaveClass('selected')

    // Click third slot (王五) - should swap
    await userEvent.click(slots[2])

    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveValue('王五')
    expect(inputs[2]).toHaveValue('张三')
  })

  it('should deselect when clicking same slot again', async () => {
    const players = {
      our: ['张三', '李四'],
      their: ['王五', '赵六']
    }
    render(<SetupPopup {...defaultProps} players={players} />)

    const slots = document.querySelectorAll('.player-slot')
    await userEvent.click(slots[0])
    expect(slots[0]).toHaveClass('selected')

    await userEvent.click(slots[0])
    expect(slots[0]).not.toHaveClass('selected')
  })
})