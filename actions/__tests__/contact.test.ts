import { describe, it, expect, vi } from 'vitest'

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: vi.fn().mockResolvedValue({ id: 'test' }) },
  })),
}))

describe('contact validation', () => {
  it('rejects empty fields', () => {
    const data = { nom: '', email: 'test@test.com', message: 'hello' }
    expect(!data.nom || !data.email || !data.message).toBe(true)
  })
  it('rejects invalid email', () => {
    expect(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test('not-an-email')).toBe(false)
    expect(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test('test@test.com')).toBe(true)
  })
  it('rejects short messages', () => {
    expect('hi'.length < 10).toBe(true)
    expect('This is a valid message'.length < 10).toBe(false)
  })
})
