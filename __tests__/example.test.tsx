import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Simple test to verify the test setup is working
describe('Test Setup', () => {
  it('should run a basic test', () => {
    render(<div>Hello Test</div>)
    expect(screen.getByText('Hello Test')).toBeInTheDocument()
  })

  it('should perform basic math', () => {
    expect(1 + 1).toBe(2)
  })
})