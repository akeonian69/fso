import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('create calls the handler with right details', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/'
  }

  const mockHandler = jest.fn()


  render(<BlogForm createBlog={mockHandler} />)

  const user = userEvent.setup()
  const titleInput = screen.getByPlaceholderText('write blog title here')
  await user.type(titleInput, blog.title)
  const authorInput = screen.getByPlaceholderText('write blog author here')
  await user.type(authorInput, blog.author)
  const urlInput = screen.getByPlaceholderText('write blog url here')
  await user.type(urlInput, blog.url)
  const createButton = screen.getByText('create')
  await user.click(createButton)

  expect(mockHandler.mock.calls).toHaveLength(1)
  const values = mockHandler.mock.calls[0][0]
  expect(values.title).toBe(blog.title)
  expect(values.author).toBe(blog.author)
  expect(values.url).toBe(blog.url)
})