import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

test('Create blog click handler callback receives correct parameter values.', async () => {
  const mockCallback = jest.fn(event => event.preventDefault())

  render(<CreateBlogForm handleCreateClick={mockCallback} />)

  const titleInput = screen.getByTestId('title-input')
  const authorInput = screen.getByTestId('author-input')
  const urlInput = screen.getByTestId('url-input')

  const user = userEvent.setup()
  await user.type(titleInput, 'Test Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'Test Url')

  const submitButton = screen.getByText('Create')
  await user.click(submitButton)

  expect(mockCallback.mock.calls[0][1]).toBe('Test Title')
  expect(mockCallback.mock.calls[0][2]).toBe('Test Author')
  expect(mockCallback.mock.calls[0][3]).toBe('Test Url')
})