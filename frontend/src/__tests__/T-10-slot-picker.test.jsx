import { render, screen, waitFor } from '@testing-library/react'
import SlotPicker from '../pages/SlotPicker.jsx'

const mockGetSlots = () => Promise.resolve({
  items: [
    { id: 1, label: '09:00 - 10:00', dateLabel: '2026-09-23', remaining: 2 },
    { id: 2, label: '10:00 - 11:00', dateLabel: '2026-09-23', remaining: 1 },
  ],
})

beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (url.includes('/slots')) {
      return Promise.resolve({
        json: mockGetSlots,
      })
    }
    return Promise.resolve({ json: async () => ({}) })
  })
})

test('T-10 shows available slots for selected package and date', async () => {
  render(<SlotPicker />)

  await waitFor(() => {
    expect(screen.getByText('เลือกวันและช่วงเวลาตรวจ')).toBeTruthy()
  })

  await waitFor(() => {
    expect(screen.getByText('09:00 - 10:00')).toBeTruthy()
    expect(screen.getByText('10:00 - 11:00')).toBeTruthy()
  })
})
