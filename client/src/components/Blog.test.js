import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('Only title is rendered by default.', () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'Test Url',
    likes: 0,
  }

  render(<Blog blog={blog} />)

  screen.getByText('Test Title')

  const author = screen.queryByText('Test Author')
  const url = screen.queryByText('Test Url')
  const likes = screen.queryByTestId('likes')

  expect(author).toBe(null)
  expect(url).toBe(null)
  expect(likes).toBe(null)
})

test('After clicking view button title, url, likes and author are shown.', async () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'Test Url',
    likes: 0,
  }

  render(<Blog blog={blog} />)

  const viewButton = screen.getByText('View')

  const user = userEvent.setup()
  await user.click(viewButton)

  screen.getByText('Test Title')
  screen.getByText('Test Author')
  screen.getByText('Test Url')
  screen.getByText('Likes', { exact: false })
})

test('If the like button is clicked twice the like click handler is called twice.', async () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'Test Url',
    likes: 0,
  }

  const mockHandleLikeClick = jest.fn()
  render(<Blog blog={blog} handleLikeClick={mockHandleLikeClick} />)

  const viewButton = screen.getByText('View')

  const user = userEvent.setup()
  await user.click(viewButton)

  const likeButton = screen.getByText('Like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandleLikeClick.mock.calls).toHaveLength(2)
})