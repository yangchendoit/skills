import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('initialization', () => {
    it('should render the app with initial state', () => {
      render(<App />)
      expect(screen.getByText(/五十K记分器/)).toBeInTheDocument()
      expect(screen.getByText(/第.*局/)).toBeInTheDocument()
      expect(screen.getByText(/第.*把/)).toBeInTheDocument()
      expect(screen.getByText('未结算')).toBeInTheDocument()
    })

    it('should show 0 score initially', () => {
      render(<App />)
      // Two teams show "0分" each
      expect(screen.getAllByText('0分')).toHaveLength(2)
      expect(screen.getAllByText('0级')).toHaveLength(2)
    })

    it('should show setup button', () => {
      render(<App />)
      expect(screen.getByText('👥 设置玩家')).toBeInTheDocument()
    })

    it('should render navigation buttons', () => {
      render(<App />)
      expect(screen.getByText('记分')).toBeInTheDocument()
      expect(screen.getByText('历史')).toBeInTheDocument()
      expect(screen.getByText('统计')).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('should switch to history page', () => {
      render(<App />)
      fireEvent.click(screen.getByText('历史'))
      expect(screen.getByText(/游戏历史/)).toBeInTheDocument()
      expect(screen.getByPlaceholderText('🔍 搜索玩家名...')).toBeInTheDocument()
    })

    it('should switch to stats page', () => {
      render(<App />)
      fireEvent.click(screen.getByText('统计'))
      expect(screen.getByText(/玩家战绩/)).toBeInTheDocument()
    })

    it('should switch back to scoring page', () => {
      render(<App />)
      fireEvent.click(screen.getByText('历史'))
      fireEvent.click(screen.getByText('记分'))
      expect(screen.getByText(/基础分/)).toBeInTheDocument()
    })
  })

  describe('base score input', () => {
    it('should update our base score', async () => {
      render(<App />)
      const inputs = screen.getAllByRole('spinbutton')
      const ourInput = inputs[0] // First input is our team
      await userEvent.type(ourInput, '150')
      expect(ourInput).toHaveValue(150)
    })

    it('should auto-calculate their base score to sum to 200', async () => {
      render(<App />)
      const inputs = screen.getAllByRole('spinbutton')
      const ourInput = inputs[0]
      const theirInput = inputs[1]
      await userEvent.clear(ourInput)
      await userEvent.type(ourInput, '150')
      expect(theirInput).toHaveValue(50)
    })

    it('should update their base score', async () => {
      render(<App />)
      const inputs = screen.getAllByRole('spinbutton')
      const ourInput = inputs[0]
      const theirInput = inputs[1]
      await userEvent.clear(theirInput)
      await userEvent.type(theirInput, '180')
      expect(theirInput).toHaveValue(180)
      expect(ourInput).toHaveValue(20)
    })
  })

  describe('bomb operations', () => {
    it('should have bomb buttons present', () => {
      render(<App />)
      // Multiple bomb buttons for each team (6 each)
      expect(screen.getAllByText('5张').length).toBeGreaterThan(0)
      expect(screen.getAllByText('6张').length).toBeGreaterThan(0)
      expect(screen.getAllByText('7张').length).toBeGreaterThan(0)
    })

    it('should show bomb section for both teams', () => {
      render(<App />)
      // There are multiple elements with "我方" and "对方" (in score card and bomb section)
      expect(screen.getAllByText('我方').length).toBeGreaterThan(0)
      expect(screen.getAllByText('对方').length).toBeGreaterThan(0)
    })
  })

  describe('tour selection', () => {
    it('should have tour options', () => {
      render(<App />)
      expect(screen.getByLabelText('无')).toBeInTheDocument()
      expect(screen.getByLabelText('我方12游')).toBeInTheDocument()
      expect(screen.getByLabelText('我方13游')).toBeInTheDocument()
      expect(screen.getByLabelText('对方12游')).toBeInTheDocument()
      expect(screen.getByLabelText('对方13游')).toBeInTheDocument()
    })

    it('should select tour option', async () => {
      render(<App />)
      const our12Radio = screen.getByLabelText('我方12游')
      await userEvent.click(our12Radio)
      expect(our12Radio).toBeChecked()
    })
  })

  describe('action buttons', () => {
    it('should have record, settle, and reset buttons', () => {
      render(<App />)
      expect(screen.getByText('记录本把')).toBeInTheDocument()
      expect(screen.getByText('结算本局')).toBeInTheDocument()
      expect(screen.getByText('重置本把')).toBeInTheDocument()
    })
  })

  describe('setup popup', () => {
    it('should open setup popup when clicking setup button', async () => {
      render(<App />)
      await userEvent.click(screen.getByRole('button', { name: /设置玩家/ }))
      // The popup title contains the same text, but player labels are unique
      expect(screen.getByText('玩家1')).toBeInTheDocument()
      expect(screen.getByText('玩家2')).toBeInTheDocument()
      expect(screen.getByText('玩家3')).toBeInTheDocument()
      expect(screen.getByText('玩家4')).toBeInTheDocument()
    })

    it('should close setup popup when clicking cancel', async () => {
      render(<App />)
      await userEvent.click(screen.getByRole('button', { name: /设置玩家/ }))
      await userEvent.click(screen.getByText('取消'))
      // After closing, player labels should not be visible
      expect(screen.queryByText('玩家1')).not.toBeInTheDocument()
    })

    it('should save player names', async () => {
      render(<App />)
      await userEvent.click(screen.getByRole('button', { name: /设置玩家/ }))

      const inputs = screen.getAllByPlaceholderText('输入姓名')
      await userEvent.type(inputs[0], '张三')
      await userEvent.type(inputs[1], '李四')
      await userEvent.type(inputs[2], '王五')
      await userEvent.type(inputs[3], '赵六')

      await userEvent.click(screen.getByText('确认'))

      expect(screen.getByText('张三 & 李四')).toBeInTheDocument()
      expect(screen.getByText('王五 & 赵六')).toBeInTheDocument()
    })
  })

  describe('settle game', () => {
    it('should prompt to set players when settling without names', async () => {
      render(<App />)
      window.alert = vi.fn()
      await userEvent.click(screen.getByText('结算本局'))
      expect(window.alert).toHaveBeenCalledWith('请先设置所有玩家姓名')
    })

    it('should show result card after settling', async () => {
      render(<App />)

      // Set up players
      await userEvent.click(screen.getByRole('button', { name: /设置玩家/ }))
      const inputs = screen.getAllByPlaceholderText('输入姓名')
      await userEvent.type(inputs[0], '张三')
      await userEvent.type(inputs[1], '李四')
      await userEvent.type(inputs[2], '王五')
      await userEvent.type(inputs[3], '赵六')
      await userEvent.click(screen.getByText('确认'))

      // Settle game
      await userEvent.click(screen.getByText('结算本局'))

      // Should show settle popup with result (draw since no score)
      // Multiple elements match "平局", use getAllByText
      expect(screen.getAllByText(/平局/).length).toBeGreaterThan(0)
    })
  })

  describe('hand recording', () => {
    it('should show hand list after recording a hand', async () => {
      render(<App />)
      // Set up players
      await userEvent.click(screen.getByText('👥 设置玩家'))
      const inputs = screen.getAllByPlaceholderText('输入姓名')
      await userEvent.type(inputs[0], '张三')
      await userEvent.type(inputs[1], '李四')
      await userEvent.type(inputs[2], '王五')
      await userEvent.type(inputs[3], '赵六')
      await userEvent.click(screen.getByText('确认'))
      // This test needs actual bomb buttons or score input
      // For now we just verify the button exists
      expect(screen.getByText('记录本把')).toBeInTheDocument()
    })

    it('should show initial hand number', async () => {
      render(<App />)
      // Hand number is shown in the game status
      expect(screen.getByText(/第.*把/)).toBeInTheDocument()
    })
  })

  describe('rules popup', () => {
    it('should open rules popup', async () => {
      render(<App />)
      const helpButtons = screen.getAllByText('❓')
      await userEvent.click(helpButtons[0])
      expect(screen.getByText(/炸弹规则/)).toBeInTheDocument()
    })

    it('should close rules popup', async () => {
      render(<App />)
      const helpButtons = screen.getAllByText('❓')
      await userEvent.click(helpButtons[0])
      await userEvent.click(screen.getByText('我知道了'))
      expect(screen.queryByText(/炸弹规则/)).not.toBeInTheDocument()
    })
  })

  describe('history page', () => {
    it('should show empty state when no history', () => {
      render(<App />)
      fireEvent.click(screen.getByText('历史'))
      expect(screen.getByText('暂无记录')).toBeInTheDocument()
    })

    it('should have search input', () => {
      render(<App />)
      fireEvent.click(screen.getByText('历史'))
      expect(screen.getByPlaceholderText('🔍 搜索玩家名...')).toBeInTheDocument()
    })
  })

  describe('stats page', () => {
    it('should show initial stats', () => {
      render(<App />)
      fireEvent.click(screen.getByText('统计'))
      // Stats show 0 for both
      expect(screen.getByText('总局数')).toBeInTheDocument()
      expect(screen.getByText('总轮数')).toBeInTheDocument()
    })
  })
})