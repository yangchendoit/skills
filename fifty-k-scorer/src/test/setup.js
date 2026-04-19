import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock

// Mock window.alert
global.alert = vi.fn()

// Mock window.confirm
global.confirm = vi.fn(() => true)

// Mock navigator.vibrate
global.navigator.vibrate = vi.fn()

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  localStorageMock.getItem.mockReturnValue(null)
})